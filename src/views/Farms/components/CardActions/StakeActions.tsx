/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Flex, AddIcon, MinusIcon, useModal, AutoRenewIcon, Button } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { useToast } from 'state/hooks'
import { useAppDispatch } from 'state'
import { fetchFarmV2UserDataAsync } from 'state/farmsV2'
import { getEtherscanLink, showCircular } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import DepositModal from '../Modals/DepositModal'
import { useHistory } from 'react-router-dom'
import { useIsModalShown } from 'state/user/hooks'
import WithdrawModal from 'components/WithdrawModal'
import UnlockButton from 'components/UnlockButton'
import ApprovalAction from './ApprovalAction'
import { styles } from '../styles'
import { useMigrationPhase } from 'state/migrationTimer/hooks'
import { MigrationPhases } from 'state/migrationTimer/types'

interface StakeActionsProps {
  stakingTokenBalance: string
  stakedBalance: string
  lpValueUsd: number
  pid: number
  allowance: string
  stakeLpAddress: string
  v2Flag: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  stakingTokenBalance,
  stakedBalance,
  lpValueUsd,
  pid,
  allowance,
  stakeLpAddress,
  v2Flag,
}) => {
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const [pendingDepositTrx, setPendingDepositTrx] = useState(false)
  const [pendingWithdrawTrx, setPendingWithdrawTrx] = useState(false)
  const { toastSuccess } = useToast()
  const firstStake = !new BigNumber(stakedBalance)?.gt(0)
  const { t } = useTranslation()
  const history = useHistory()
  const { showGeneralHarvestModal } = useIsModalShown()
  const displayGHCircular = () => showGeneralHarvestModal && showCircular(chainId, history, '?modal=circular-gh')

  const { onStake } = useStake(pid, v2Flag, lpValueUsd)
  const { onUnstake } = useUnstake(pid, v2Flag)
  const currentPhase = useMigrationPhase()

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingTokenBalance}
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
        dispatch(fetchFarmV2UserDataAsync(chainId, account))
        setPendingDepositTrx(false)
      }}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={async (val) => {
        setPendingWithdrawTrx(true)
        await onUnstake(val)
          .then((resp) => {
            const trxHash = resp.transactionHash
            toastSuccess(t('Withdraw Successful'), {
              text: t('View Transaction'),
              url: getEtherscanLink(trxHash, 'transaction', chainId),
            })
            if (trxHash) displayGHCircular()
          })
          .catch((e) => {
            console.error(e)
            setPendingWithdrawTrx(false)
          })
        dispatch(fetchFarmV2UserDataAsync(chainId, account))
        setPendingWithdrawTrx(false)
      }}
      title={'Unstake LP tokens'}
    />,
  )

  const renderStakingButtons = () => {
    if (!account) {
      return <UnlockButton sx={{ width: '100%' }} />
    }
    if (!new BigNumber(allowance)?.gt(0)) {
      return <ApprovalAction stakingTokenContractAddress={stakeLpAddress} pid={pid} v2Flag={v2Flag} />
    }
    if (firstStake) {
      return (
        <Button
          onClick={onPresentDeposit}
          endIcon={pendingDepositTrx && <AutoRenewIcon spin color="currentColor" />}
          disabled={pendingDepositTrx || (!v2Flag && currentPhase !== MigrationPhases.MIGRATE_PHASE_0)}
          sx={styles.styledBtn}
        >
          {t('DEPOSIT')}
        </Button>
      )
    }
    return (
      <Flex sx={styles.stakeActions}>
        <Button
          onClick={onPresentWithdraw}
          endIcon={pendingWithdrawTrx && <AutoRenewIcon spin color="currentColor" />}
          disabled={pendingWithdrawTrx}
          mr="10px"
          size="sm"
          sx={styles.smallBtn}
        >
          <MinusIcon color="white" width="16px" height="20px" fontWeight={700} />
        </Button>
        <Button
          onClick={onPresentDeposit}
          endIcon={pendingDepositTrx && <AutoRenewIcon spin color="currentColor" />}
          disabled={pendingDepositTrx || !new BigNumber(stakingTokenBalance)?.gt(0) || !v2Flag}
          size="sm"
          sx={styles.smallBtn}
        >
          <AddIcon color="white" width="20px" height="20px" fontWeight={700} />
        </Button>
      </Flex>
    )
  }

  return renderStakingButtons()
}

export default React.memo(StakeAction)
