/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import { Button, Flex, Svg, Text } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { Percent, ZAP_ADDRESS } from '@ape.swap/sdk'
import { useUserRecentTransactions, useUserSlippageTolerance } from 'state/user/hooks'
import { Field } from 'state/burn/actions'
import { dexStyles, textUnderlineHover } from '../../styles'
import DexPanel from '../../components/DexPanel'
import DexNav from '../../components/DexNav'
import PoolInfo from '../components/PoolInfo'
import RecentTransactions from '../../components/RecentTransactions'
import { useZapMigratorCallback } from 'hooks/useZapMigratorCallback'
import {
  useDerivedZapMigratorInfo,
  useMigratorBalances,
  useZapMigratorActionHandlers,
  useZapMigratorState,
} from 'state/zapMigrator/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { parseAddress } from 'hooks/useAddress'
import UnlockButton from 'components/UnlockButton'
import { useToast } from 'state/hooks'
import { useFarms } from 'state/farms/hooks'
import track from 'utils/track'

function MigrateLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  useMigratorBalances()
  const { chainId, account, library } = useActiveWeb3React()
  const { toastSuccess } = useToast()
  const history = useHistory()

  const [pendingTx, setPendingTx] = useState(false)

  const { t } = useTranslation()
  const [recentTransactions] = useUserRecentTransactions()

  const [tradeValueUsd, setTradeValueUsd] = useState(0)
  const setTradeValueUsdCallback = useCallback((value: number) => setTradeValueUsd(value), [setTradeValueUsd])

  // Set currencies
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // burn state
  const { independentField, typedValue, smartRouter } = useZapMigratorState()
  const { pair, zapMigrate, parsedAmounts, error } = useDerivedZapMigratorInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
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

  const handleMaxInput = useCallback(() => {
    onUserInput(Field.LIQUIDITY_PERCENT, '100')
  }, [onUserInput])

  const [allowedSlippage] = useUserSlippageTolerance()

  const { callback: zapMigrator } = useZapMigratorCallback(zapMigrate, allowedSlippage, account)

  const farms = useFarms(null)

  const matchingFarm = farms.find(
    (farm) =>
      (farm.tokenAddresses[chainId].toLowerCase() === pair?.token0?.address.toLowerCase() ||
        farm.tokenAddresses[chainId].toLowerCase() === pair?.token1?.address.toLowerCase()) &&
      (farm.quoteTokenAdresses[chainId].toLowerCase() === pair?.token0?.address.toLowerCase() ||
        farm.quoteTokenAdresses[chainId].toLowerCase() === pair?.token1?.address.toLowerCase()),
  )

  // Approval
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    parseAddress(ZAP_ADDRESS, chainId),
  )

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
        onClick={() => {
          setPendingTx(true)
          zapMigrator()
            .then((txHash) =>
              library.waitForTransaction(txHash).then(() => {
                setPendingTx(false)
                track({
                  event: 'migrate_liq',
                  chain: chainId,
                  data: {
                    cat: pair.router,
                    token1: pair.token0.getSymbol(chainId),
                    token2: pair.token1.getSymbol(chainId),
                    amount: zapMigrate.amount,
                    usdAmount: tradeValueUsd,
                  },
                })
                toastSuccess(t('Migrate Successful'), {
                  text: t('Go To Farm'),
                  url: `/farms?pid=${matchingFarm.pid}`,
                })
                history.push({ pathname: `/migrate` })
              }),
            )
            .catch(() => setPendingTx(false))
        }}
        load={pendingTx}
        disabled={pendingTx}
      >
        {t('Migrate')}
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
            panelText={t('Migrate To ApeSwap:')}
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
            smartRouter={smartRouter}
            setTradeValueUsd={setTradeValueUsdCallback}
          />
          <PoolInfo pair={pair} parsedAmounts={parsedAmounts} chainId={chainId} />
          <Flex sx={{ height: '10px' }} />
          {renderAction()}
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}

export default React.memo(MigrateLiquidity)
