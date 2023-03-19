/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { WrapType } from 'hooks/useWrapCallback'
import React from 'react'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { warningSeverity } from 'utils/prices'
import { styles } from './styles'
import { OrdersActionProps } from './types'

const OrdersActions: React.FC<OrdersActionProps> = ({
  trade,
  swapInputError,
  isExpertMode,
  showWrap,
  wrapType,
  priceImpactWithoutFee,
  swapCallbackError,
  userHasSpecifiedInputOutput,
  routerType,
  disabled,
  onWrap,
  handleSwap,
  onPresentConfirmModal,
  setSwapState,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, true, routerType)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const renderAction = () => {
    if (!account) {
      return <UnlockButton fullWidth />
    }
    if (showWrap) {
      return (
        <Button fullWidth onClick={onWrap}>
          {wrapType === WrapType.WRAP ? t('Wrap') : t('Unwrap')}
        </Button>
      )
    }
    if (!trade?.route && userHasSpecifiedInputOutput) {
      return (
        <Text margin="10px 0px" sx={{ width: '100%', textAlign: 'center' }}>
          {t('Insufficient liquidity for this trade')}
        </Text>
      )
    }
    if (showApproveFlow) {
      return (
        <Button
          fullWidth
          onClick={approveCallback}
          disabled={approval !== ApprovalState.NOT_APPROVED || disabled}
          load={approval === ApprovalState.PENDING}
        >
          {approval === ApprovalState.PENDING ? t('Approving') : t('Approve Order')}
        </Button>
      )
    }
    return (
      <Button
        fullWidth
        onClick={() => {
          if (isExpertMode) {
            handleSwap()
          } else {
            setSwapState({
              tradeToConfirm: trade,
              attemptingTxn: false,
              swapErrorMessage: undefined,
              txHash: undefined,
            })
            onPresentConfirmModal()
          }
        }}
        id="swap-button"
        disabled={!!swapInputError || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || disabled}
      >
        {swapInputError ||
          (priceImpactSeverity > 3 && !isExpertMode
            ? t('Price Impact Too High')
            : priceImpactSeverity > 2
            ? t('Place Order Anyway')
            : t('Place Order'))}
      </Button>
    )
  }

  return <Flex sx={styles.dexActionsContainer}>{renderAction()}</Flex>
}

export default React.memo(OrdersActions)
