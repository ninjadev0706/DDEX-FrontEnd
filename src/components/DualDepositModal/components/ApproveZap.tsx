import React, { useState } from 'react'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useToast } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Button, AutoRenewIcon } from '@ape.swap/uikit'

interface ApprovalActionProps {
  action: () => Promise<any>
  zapApprovalState?: ApprovalState
}

const ApproveZap: React.FC<ApprovalActionProps> = ({ action, zapApprovalState }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { toastSuccess } = useToast()
  const zapPendingApproval = zapApprovalState ? zapApprovalState !== ApprovalState.NOT_APPROVED : false

  return (
    <Button
      className="noClick"
      disabled={pendingTrx || zapPendingApproval}
      onClick={async () => {
        setPendingTrx(true)
        await action()
          .then((resp) => {
            const trxHash = resp !== false ? resp.transactionHash : ''
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
      load={zapApprovalState === ApprovalState.PENDING}
      fullWidth
    >
      {t('ENABLE')}
    </Button>
  )
}

export default React.memo(ApproveZap)
