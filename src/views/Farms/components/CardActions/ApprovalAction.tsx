/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Skeleton, AutoRenewIcon, Button } from '@ape.swap/uikit'
import { useApprove } from 'hooks/useApprove'
import { useAppDispatch } from 'state'
import { useERC20 } from 'hooks/useContract'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { useToast } from 'state/hooks'
import { styles } from '../styles'
import { updateFarmV2UserAllowances } from 'state/farmsV2'

interface ApprovalActionProps {
  stakingTokenContractAddress: string
  pid: number
  v2Flag?: boolean
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({
  stakingTokenContractAddress,
  pid,
  isLoading = false,
  v2Flag,
}) => {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const stakingTokenContract = useERC20(stakingTokenContractAddress)
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onApprove } = useApprove(stakingTokenContract, v2Flag)
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
            dispatch(updateFarmV2UserAllowances(chainId, pid, account))
            setPendingTrx(false)
          }}
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
