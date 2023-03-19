/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Flex, AddIcon, MinusIcon, useModal, Button } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import { fetchVaultV3UserDataAsync } from 'state/vaultsV3'
import { useToast } from 'state/hooks'
import { useAppDispatch } from 'state'
import { useVaultStake } from 'views/Vaults/hooks/useVaultStake'
import { useVaultUnstake } from 'views/Vaults/hooks/useVaultUnstake'
import { getEtherscanLink, showCircular } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import DepositModal from '../Modals/DepositModal'
import { useIsModalShown } from 'state/user/hooks'
import { useHistory } from 'react-router-dom'
import WithdrawModal from 'components/WithdrawModal'
import { useTranslation } from 'contexts/Localization'
import ApprovalAction from './ApprovalAction'
import UnlockButton from 'components/UnlockButton'
import { VaultVersion } from 'config/constants/types'
import { styles } from '../styles'

interface StakeActionsProps {
  stakingTokenBalance: string
  stakedTokenSymbol: string
  stakedBalance: string
  stakeTokenValueUsd: number
  withdrawFee: string
  pid: number
  vaultVersion: VaultVersion
  allowance: string
  stakeTokenAddress: string
}

const StakeAction: React.FC<StakeActionsProps> = ({
  stakingTokenBalance,
  stakedTokenSymbol,
  stakedBalance,
  stakeTokenValueUsd,
  withdrawFee,
  pid,
  vaultVersion,
  allowance,
  stakeTokenAddress,
}) => {
  const lpText = vaultVersion === VaultVersion.V1 ? 'BANANA' : 'LP tokens'
  const { showGeneralHarvestModal } = useIsModalShown()
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { chainId, account } = useActiveWeb3React()
  const [pendingDepositTrx, setPendingDepositTrx] = useState(false)
  const [pendingWithdrawTrx, setPendingWithdrawTrx] = useState(false)
  const { t } = useTranslation()

  const { toastSuccess } = useToast()
  const firstStake = !new BigNumber(stakedBalance)?.gt(0)

  const { onStake } = useVaultStake(pid, vaultVersion, stakeTokenValueUsd)
  const { onUnstake } = useVaultUnstake(pid, vaultVersion)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingTokenBalance}
      tokenName={stakedTokenSymbol}
      onConfirm={async (val) => {
        setPendingDepositTrx(true)
        await onStake(val)
          .then((resp) => {
            const trxHash = resp.transactionHash
            toastSuccess('Deposit Successful', {
              text: 'View Transaction',
              url: getEtherscanLink(trxHash, 'transaction', chainId),
            })
          })
          .catch((e) => {
            console.error(e)
            setPendingDepositTrx(false)
          })
        dispatch(fetchVaultV3UserDataAsync(account, chainId))
        setPendingDepositTrx(false)
      }}
    />,
  )

  const displayGHCircular = () => showGeneralHarvestModal && showCircular(chainId, history, '?modal=circular-gh')
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      title={t(`Unstake ${lpText}`)}
      withdrawFee={withdrawFee}
      onConfirm={async (val) => {
        setPendingWithdrawTrx(true)
        await onUnstake(val)
          .then((resp) => {
            const trxHash = resp.transactionHash
            toastSuccess('Withdraw Successful', {
              text: 'View Transaction',
              url: getEtherscanLink(trxHash, 'transaction', chainId),
            })
            if (trxHash) displayGHCircular()
          })
          .catch((e) => {
            console.error(e)
            setPendingWithdrawTrx(false)
          })
        dispatch(fetchVaultV3UserDataAsync(account, chainId))
        setPendingWithdrawTrx(false)
      }}
    />,
  )

  const renderStakingButtons = () => {
    if (!account) {
      return <UnlockButton sx={{ width: '100%' }} />
    }
    if (!new BigNumber(allowance)?.gt(0)) {
      return <ApprovalAction stakingTokenContractAddress={stakeTokenAddress} vaultVersion={vaultVersion} pid={pid} />
    }
    if (firstStake) {
      return (
        <Button onClick={onPresentDeposit} load={pendingDepositTrx} disabled={pendingDepositTrx} sx={styles.styledBtn}>
          {t('DEPOSIT')}
        </Button>
      )
    }
    return (
      <Flex sx={styles.stakeActions}>
        <Button
          onClick={onPresentWithdraw}
          load={pendingWithdrawTrx}
          disabled={pendingWithdrawTrx}
          mr="10px"
          size="sm"
          sx={styles.smallBtn}
        >
          <MinusIcon color="white" width="20px" height="20px" fontWeight={700} />
        </Button>
        <Button
          onClick={onPresentDeposit}
          load={pendingDepositTrx}
          disabled={pendingDepositTrx || !new BigNumber(stakingTokenBalance)?.gt(0)}
          size="sm"
          sx={styles.smallBtn}
        >
          <AddIcon color="white" width="25px" height="25px" fontWeight={700} />
        </Button>
      </Flex>
    )
  }

  return renderStakingButtons()
}

export default React.memo(StakeAction)
