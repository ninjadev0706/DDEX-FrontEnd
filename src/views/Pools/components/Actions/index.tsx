/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import ApprovalAction from './ApprovalAction'
import UnlockButton from 'components/UnlockButton'
import { AddIcon, Button, Flex, MinusIcon, useModal } from '@ape.swap/uikit'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { getBalanceNumber } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { useToast } from 'state/hooks'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { useTranslation } from 'contexts/Localization'
import { useCurrency } from 'hooks/Tokens'
import { useBananaAddress } from 'hooks/useAddress'
import { useIsModalShown } from 'state/user/hooks'
import { useHistory } from 'react-router-dom'
import { getEtherscanLink, showCircular } from 'utils'
import DepositModal from '../Modals/DepositModal'
import { fetchPoolsUserDataAsync } from 'state/pools'
import WithdrawModal from 'components/WithdrawModal'
import { poolStyles } from '../styles'

interface CardActionProps {
  allowance: string
  stakingTokenBalance: string
  stakedTokenSymbol: string
  stakedBalance: string
  stakeTokenValueUsd: number
  stakeTokenAddress: string
  sousId: number
  earnTokenSymbol: string
}

const Actions: React.FC<CardActionProps> = ({
  allowance,
  stakingTokenBalance,
  stakedTokenSymbol,
  stakedBalance,
  stakeTokenValueUsd,
  stakeTokenAddress,
  sousId,
  earnTokenSymbol,
}) => {
  const rawStakedBalance = getBalanceNumber(new BigNumber(stakedBalance))
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const userStakedBalanceUsd = `$${(
    getBalanceNumber(new BigNumber(stakedBalance) || new BigNumber(0)) * stakeTokenValueUsd
  ).toFixed(2)}`
  const [pendingDepositTrx, setPendingDepositTrx] = useState(false)
  const [pendingWithdrawTrx, setPendingWithdrawTrx] = useState(false)

  const { toastSuccess } = useToast()
  const firstStake = !new BigNumber(stakedBalance)?.gt(0)

  const { onStake } = useSousStake(sousId, stakeTokenValueUsd)
  const { onUnstake } = useSousUnstake(sousId)
  const { t } = useTranslation()
  const bananaToken = useCurrency(useBananaAddress())
  const { showPoolHarvestModal } = useIsModalShown()
  const history = useHistory()

  const harvestBanana = earnTokenSymbol === bananaToken.symbol
  const displayPHCircular = () =>
    showPoolHarvestModal && harvestBanana && showCircular(chainId, history, '?modal=circular-gh')

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingTokenBalance}
      tokenName={stakedTokenSymbol}
      onConfirm={async (val) => {
        setPendingDepositTrx(true)
        await onStake(val)
          .then((resp) => {
            const trxHash = resp.transactionHash
            toastSuccess(t('Deposit Successful'), {
              text: t('View Transaction'),
              url: getEtherscanLink(trxHash, 'transaction', chainId),
            })
          })
          .catch((e) => {
            console.error(e)
            setPendingDepositTrx(false)
          })
        dispatch(fetchPoolsUserDataAsync(chainId, account))
        setPendingDepositTrx(false)
      }}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      title={`${t('Unstake')} ${stakedTokenSymbol}`}
      onConfirm={async (val) => {
        setPendingWithdrawTrx(true)
        await onUnstake(val)
          .then((resp) => {
            const trxHash = resp.transactionHash
            toastSuccess(t('Withdraw Successful'), {
              text: t('View Transaction'),
              url: getEtherscanLink(trxHash, 'transaction', chainId),
            })
            if (trxHash) displayPHCircular()
          })
          .catch((e) => {
            console.error(e)
            setPendingWithdrawTrx(false)
          })
        dispatch(fetchPoolsUserDataAsync(chainId, account))
        setPendingWithdrawTrx(false)
      }}
    />,
  )

  return (
    <Flex sx={poolStyles.actionContainer}>
      <ListViewContent
        title={t('Staked')}
        value={`${!account ? '0.000' : rawStakedBalance.toFixed(2)}`}
        value2={!account ? '$0.00' : userStakedBalanceUsd}
        value2Secondary
        value2Direction="column"
        style={{ flexDirection: 'column' }}
      />
      <Flex sx={poolStyles.depositContainer}>
        {!account ? (
          <UnlockButton sx={{ width: '100%' }} />
        ) : !new BigNumber(allowance)?.gt(0) ? (
          <ApprovalAction stakingTokenContractAddress={stakeTokenAddress} sousId={sousId} />
        ) : firstStake ? (
          <Button
            onClick={onPresentDeposit}
            load={pendingDepositTrx}
            disabled={pendingDepositTrx}
            sx={poolStyles.styledBtn}
          >
            {t('DEPOSIT')}
          </Button>
        ) : (
          <Flex sx={poolStyles.stakeActions}>
            <Button
              onClick={onPresentWithdraw}
              load={pendingWithdrawTrx}
              disabled={pendingWithdrawTrx}
              sx={poolStyles.smallBtn}
              mr="10px"
              size="sm"
            >
              {!pendingWithdrawTrx && <MinusIcon color="white" width="20px" height="20px" fontWeight={700} />}
            </Button>
            <Button
              onClick={onPresentDeposit}
              load={pendingDepositTrx}
              disabled={pendingDepositTrx || !new BigNumber(stakingTokenBalance)?.gt(0)}
              sx={poolStyles.smallBtn}
              size="sm"
            >
              {!pendingDepositTrx && <AddIcon color="white" width="25px" height="25px" fontWeight={700} />}
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(Actions)
