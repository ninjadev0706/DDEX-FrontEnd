/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { Flex, AddIcon, MinusIcon, AutoRenewIcon, useModal, Button } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import { useMiniChefUnstake } from 'hooks/useUnstake'
import { useToast } from 'state/hooks'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import DualDepositModal from 'components/DualDepositModal'
import WithdrawModal from 'components/WithdrawModal'
import { DualFarm } from 'state/types'
import { useDualFarmStake } from 'hooks/useStake'
import { PRODUCT } from 'config/constants'
import UnlockButton from 'components/UnlockButton'
import { styles } from '../styles'

interface StakeActionsProps {
  lpValueUsd: number
  farm: DualFarm
}

const StakeAction: React.FC<StakeActionsProps> = ({ lpValueUsd, farm }) => {
  const stakedBalance = farm?.userData?.stakedBalance?.toString()
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [pendingDepositTrx, setPendingDepositTrx] = useState(false)
  const [pendingWithdrawTrx, setPendingWithdrawTrx] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const firstStake = !new BigNumber(stakedBalance)?.gt(0)

  const { onStake } = useDualFarmStake(farm?.pid)
  const { onUnstake } = useMiniChefUnstake(farm?.pid)

  const handlePendingDepositTx = useCallback((value: boolean) => {
    setPendingDepositTrx(value)
  }, [])

  const [onPresentDeposit] = useModal(
    <DualDepositModal
      setPendingDepositTrx={handlePendingDepositTx}
      pendingTx={pendingDepositTrx}
      pid={farm?.pid}
      allowance={farm?.userData?.allowance?.toString()}
      token0={farm?.stakeTokens?.token0?.address[chainId]}
      token1={farm?.stakeTokens?.token1?.address[chainId]}
      lpAddress={farm?.stakeTokenAddress}
      poolAddress={farm?.stakeTokenAddress}
      onStakeLp={async (val: string) => {
        setPendingDepositTrx(true)
        await onStake(val)
          .then((resp) => {
            resp.wait().then(() => {
              setPendingDepositTrx(false)
              toastSuccess(t('Deposit Successful'), {
                text: t('View Transaction'),
                url: getEtherscanLink(resp.hash, 'transaction', chainId),
              })
            })
          })
          .catch((error) => {
            console.error(error)
            setPendingDepositTrx(false)
            toastError(error?.message || t('Error: Please try again.'))
          })
      }}
      enableZap={true}
      product={PRODUCT.DUAL_FARM}
    />,
    true,
    true,
    `depositModal-${farm.pid}`,
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
          })
          .catch((e) => {
            console.error(e)
            setPendingWithdrawTrx(false)
          })
        setPendingWithdrawTrx(false)
      }}
      title={t('Unstake LP tokens')}
    />,
    true,
    true,
    `withdrawModal-${farm.pid}`,
  )

  const renderStakingButtons = () => {
    if (!account) {
      return <UnlockButton sx={{ width: '100%' }} />
    }
    if (firstStake) {
      return (
        <Button
          onClick={onPresentDeposit}
          endIcon={pendingDepositTrx && <AutoRenewIcon spin color="currentColor" />}
          disabled={pendingDepositTrx}
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
          {!pendingWithdrawTrx && <MinusIcon color="white" width="16px" height="20px" fontWeight={700} />}
        </Button>
        <Button
          onClick={onPresentDeposit}
          endIcon={pendingDepositTrx && <AutoRenewIcon spin color="currentColor" />}
          disabled={pendingDepositTrx}
          size="sm"
          sx={styles.smallBtn}
        >
          {!pendingDepositTrx && <AddIcon color="white" width="20px" height="20px" fontWeight={700} />}
        </Button>
      </Flex>
    )
  }

  return renderStakingButtons()
}

export default React.memo(StakeAction)
