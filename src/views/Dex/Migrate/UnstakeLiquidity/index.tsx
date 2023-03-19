/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import { Button, Flex, Svg, Text } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { JSBI, Percent, TokenAmount } from '@ape.swap/sdk'
import { useUserRecentTransactions } from 'state/user/hooks'
import { Field } from 'state/burn/actions'
import { dexStyles, textUnderlineHover } from '../../styles'
import DexPanel from '../../components/DexPanel'
import DexNav from '../../components/DexNav'
import RecentTransactions from '../../components/RecentTransactions'
import {
  useDerivedZapMigratorInfo,
  useMigratorBalances,
  useZapMigratorActionHandlers,
  useZapMigratorState,
} from 'state/zapMigrator/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import UnlockButton from 'components/UnlockButton'
import { useMigrateUnstake } from 'hooks/useUnstake'
import BigNumber from 'bignumber.js'
import { useToast } from 'state/hooks'
import { getEtherscanLink } from 'utils'
import { SMART_ROUTER_FULL_NAME } from 'config/constants/chains'

function MigrateLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { chainId, account, library } = useActiveWeb3React()

  const { t } = useTranslation()
  const [recentTransactions] = useUserRecentTransactions()
  const [pendingTx, setPendingTx] = useState(false)
  const { toastSuccess } = useToast()
  const history = useHistory()

  // Set currencies
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // burn state
  const { independentField, typedValue } = useZapMigratorState()
  const { pair, parsedAmounts, error } = useDerivedZapMigratorInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { valid, results } = useMigratorBalances()
  const stakedBalances = valid ? results.filter((bal) => parseFloat(bal.stakedBalance) > 0.0) : []
  const lpToUnstake = stakedBalances
    .filter((b) => b.smartRouter === pair.router)
    .find(
      (lp) =>
        lp.token0.address.toLowerCase() === currencyIdA.toLowerCase() &&
        lp.token1.address.toLowerCase() === currencyIdB.toLowerCase(),
    )

  const { onUserInput: _onUserInput } = useZapMigratorActionHandlers()

  // allowance handling
  const [, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  // get formatted amounts
  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const { onUnstake } = useMigrateUnstake(lpToUnstake?.chefAddress, lpToUnstake?.pid)

  const handleMaxInput = useCallback(() => {
    onUserInput(Field.LIQUIDITY_PERCENT, '100')
  }, [onUserInput])

  const handleUnstake = useCallback(
    (amount: string) => {
      setPendingTx(true)
      onUnstake(amount)
        .then((resp) => {
          library.waitForTransaction(resp.transactionHash).then((finishedTx) => {
            setPendingTx(false)
            toastSuccess(t('Withdraw Successful'), {
              text: t('View Transaction'),
              url: getEtherscanLink(finishedTx.transactionHash, 'transaction', chainId),
            })
            history.push({ pathname: `/migrate/${lpToUnstake.token0.address}/${lpToUnstake.token1.address}` })
          })
        })
        .catch((e) => {
          setPendingTx(false)
          console.error(e)
        })
    },
    [onUnstake, chainId, t, toastSuccess, history, lpToUnstake, library],
  )

  const amountToApprove =
    lpToUnstake?.stakedBalance &&
    new TokenAmount(
      pair?.liquidityToken,
      JSBI.BigInt(new BigNumber(lpToUnstake?.stakedBalance).times(new BigNumber(10).pow(18)).toString()),
    )

  // Approval
  const [approval, approveCallback] = useApproveCallback(amountToApprove, lpToUnstake?.chefAddress || undefined)

  const renderAction = () => {
    if (!account) {
      return <UnlockButton fullWidth />
    }
    if (error) {
      return (
        <Button fullWidth disabled>
          {error}
        </Button>
      )
    }
    if ((approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && !error) {
      return (
        <Flex sx={{ width: '100%' }}>
          <Button
            onClick={approveCallback}
            disabled={approval === ApprovalState.PENDING}
            load={approval === ApprovalState.PENDING}
            fullWidth
            sx={{ padding: '10px 2px' }}
          >
            {approval === ApprovalState.PENDING ? t('Enabling') : t('Enable')}
          </Button>
        </Flex>
      )
    }
    return (
      <Button
        fullWidth
        load={pendingTx}
        disabled={pendingTx}
        onClick={() =>
          handleUnstake(
            formattedAmounts[Field.LIQUIDITY_PERCENT] === '100'
              ? lpToUnstake.stakedBalance
              : new BigNumber(lpToUnstake.stakedBalance)
                  .times(parseInt(formattedAmounts[Field.LIQUIDITY_PERCENT]))
                  .div(100)
                  .toFixed(18),
          )
        }
      >
        {t('Unstake')}
      </Button>
    )
  }

  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ ...dexStyles.dexContainer }}>
          <DexNav />
          <Flex sx={{ height: '30px' }} />
          <Flex
            sx={{
              margin: '0px 0px 40px 0px',
              width: 'fit-content',
              alignItems: 'center',
              position: 'relative',
              ...textUnderlineHover,
            }}
            as={Link}
            to="/migrate"
          >
            <Svg icon="caret" direction="left" width="7px" />
            <Text size="12px" ml="5px">
              {t('Back')}
            </Text>
          </Flex>
          <DexPanel
            value={formattedAmounts[Field.LIQUIDITY_PERCENT]}
            userBalance={parseFloat(lpToUnstake?.stakedBalance)}
            panelText={`${t('Unstake From ')}${SMART_ROUTER_FULL_NAME[lpToUnstake?.smartRouter] || ''}:`}
            currency={currencyA}
            otherCurrency={currencyB}
            fieldType={Field.LIQUIDITY_PERCENT}
            onCurrencySelect={null}
            onUserInput={(field, val) =>
              parseInt(val) > 100
                ? onUserInput(field, '100')
                : val.toString() === ''
                ? onUserInput(field, '0')
                : onUserInput(field, parseInt(val).toString())
            }
            handleMaxInput={handleMaxInput}
            showCommonBases
            lpPair={pair}
          />
          <Flex sx={{ height: '10px' }} />
          {renderAction()}
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}

export default React.memo(MigrateLiquidity)
