import React, { useState } from 'react'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useToast } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { Button, AutoRenewIcon } from '@ape.swap/uikit'
import { useERC20 } from 'hooks/useContract'
import { useJungleApprove } from 'hooks/useApprove'

interface ApprovalActionProps {
  lpToApprove: string
  pid: string
}

const ApproveJungle: React.FC<ApprovalActionProps> = ({ lpToApprove, pid }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { toastSuccess } = useToast()
  const stakingTokenContract = useERC20(lpToApprove)

  const { onApprove } = useJungleApprove(stakingTokenContract, parseFloat(pid))

  return (
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
        setPendingTrx(false)
      }}
      endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
      fullWidth
    >
      {t('ENABLE')}
    </Button>
  )
}

export default React.memo(ApproveJungle)
