/** @jsxImportSource theme-ui */
import React from 'react'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button } from '@ape.swap/uikit'
import { ApprovalState, useApproveCallbackFromZap } from 'hooks/useApproveCallback'
import { useTranslation } from 'contexts/Localization'
import { AutoRenewIcon } from '@apeswapfinance/uikit'
import { useDerivedZapInfo } from 'state/zap/hooks'
import { PRODUCT } from '../../config/constants'
import ApproveJungle from './components/ApproveJungle'
import ApproveDual from './components/ApproveDual'
import ApproveZap from './components/ApproveZap'

/**
 * Component's goal is to handle actions for DualDepositModal component which, in turn, aims to handle deposit/zap flow
 * for farms, dual farms and jungle farms.
 * The component can handle approval flow for both zap and a given contract defined in lpToApprove
 * @lpToApprove lp address to be approved
 * @showApproveLpFlow Determines whether the approve contract button should be displayed
 * @pid pool's id - might have to be changed to support farms & jungle farms
 * @isZapSelected Determines whether the zap approval button should be displayed
 * @inputError Error text to show in the button
 * @disabled Sets disable state for button
 * @pendingTrx Sets pending trx state
 * @handleAction deposit/zap handler
 * @product Determines where is the component being used. It is important to set ZapType and approve flow
 */

interface DualActionsProps {
  lpToApprove: string
  showApproveLpFlow: boolean
  pid?: string
  isZapSelected?: boolean
  inputError?: string
  disabled: boolean
  pendingTrx: boolean
  handleAction: () => void
  product: PRODUCT
}

const DualActions: React.FC<DualActionsProps> = ({
  lpToApprove,
  showApproveLpFlow,
  pid,
  isZapSelected,
  inputError,
  disabled,
  pendingTrx,
  handleAction,
  product,
}) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { zap } = useDerivedZapInfo()
  const [approval, approveZap] = useApproveCallbackFromZap(zap)
  const showApproveZapFlow = approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING

  const renderAction = () => {
    if (!account) {
      return <UnlockButton fullWidth />
    }
    if (inputError) {
      return (
        <Button fullWidth disabled>
          {inputError}
        </Button>
      )
    }
    if (!isZapSelected && showApproveLpFlow && product === PRODUCT.JUNGLE_FARM) {
      return <ApproveJungle lpToApprove={lpToApprove} pid={pid} />
    }
    if (!isZapSelected && showApproveLpFlow && product === PRODUCT.DUAL_FARM) {
      return <ApproveDual lpToApprove={lpToApprove} pid={pid} />
    }
    if (isZapSelected && showApproveZapFlow) {
      return <ApproveZap action={approveZap} zapApprovalState={approval} />
    }
    if (!showApproveZapFlow || !showApproveLpFlow) {
      return (
        <Button
          fullWidth
          onClick={handleAction}
          endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
          disabled={disabled}
        >
          {pendingTrx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      )
    }
  }

  return renderAction()
}

export default React.memo(DualActions)
