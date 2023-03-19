/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { AutoRenewIcon, Button, Skeleton } from '@ape.swap/uikit'
import { useJungleApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { updateJungleFarmsUserAllowance } from 'state/jungleFarms'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useToast } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

interface ApprovalActionProps {
  stakingTokenContractAddress: string
  jungleId: number
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({
  stakingTokenContractAddress,
  jungleId,
  isLoading = false,
}) => {
  const { chainId, account } = useActiveWeb3React()
  const stakingTokenContract = useERC20(stakingTokenContractAddress)
  const [pendingTrx, setPendingTrx] = useState(false)
  const dispatch = useAppDispatch()
  const { onApprove } = useJungleApprove(stakingTokenContract, jungleId)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          className="noClick"
          disabled={pendingTrx}
          onClick={async () => {
            setPendingTrx(true)
            await onApprove()
              .then((resp) => {
                const trxHash = resp.transactionHash
                toastSuccess(t('Approve Successful'), {
                  text: t('View Transaction'),
                  url: getEtherscanLink(trxHash, 'transaction', chainId),
                })
              })
              .catch((e) => {
                console.error(e)
                setPendingTrx(false)
              })
            dispatch(updateJungleFarmsUserAllowance(chainId, jungleId, account))
            setPendingTrx(false)
          }}
          load={pendingTrx}
          endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
          sx={styles.styledBtn}
        >
          {t('ENABLE')}
        </Button>
      )}
    </>
  )
}

export default React.memo(ApprovalAction)
