import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import {
  updateDualFarmUserEarnings,
  updateDualFarmUserStakedBalances,
  updateDualFarmUserTokenBalances,
} from '../../state/dualFarms'
import { useToast } from '../../state/hooks'
import { useTranslation } from '../../contexts/Localization'
import { useZapCallback } from '../../hooks/useZapCallback'
import { useDerivedZapInfo, useZapState } from '../../state/zap/hooks'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import track from '../../utils/track'
import { getBalanceNumber } from '../../utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useTokenPriceUsd } from '../../hooks/useTokenPriceUsd'

const useDualDeposit = (
  isZapSelected: boolean,
  onStakeLp: (value: string) => void,
  pid: number,
  handlePendingTx: (value: boolean) => void,
  poolAddress: string,
  onDismiss: () => void,
) => {
  const { toastError } = useToast()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()
  const { recipient, typedValue, zapType } = useZapState()
  const { zap } = useDerivedZapInfo()
  const [zapSlippage, setZapSlippage] = useUserSlippageTolerance(true)
  const originalSlippage = useMemo(() => {
    return zapSlippage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tokenPrice = useTokenPriceUsd(chainId, zap.currencyIn.currency)

  const { callback: zapCallback } = useZapCallback(
    zap,
    zapType,
    zapSlippage,
    recipient,
    poolAddress,
    null,
    pid.toString(),
  )

  return useCallback(async () => {
    handlePendingTx(true)
    if (isZapSelected) {
      await onStakeLp(typedValue)
    } else {
      await zapCallback()
        .then((hash) => {
          library.waitForTransaction(hash).then(() => {
            handlePendingTx(false)
            setZapSlippage(originalSlippage)
            dispatch(updateDualFarmUserStakedBalances(chainId, pid, account))
            dispatch(updateDualFarmUserEarnings(chainId, pid, account))
            dispatch(updateDualFarmUserTokenBalances(chainId, pid, account))
            onDismiss()
          })
          const amount = getBalanceNumber(new BigNumber(zap.currencyIn.inputAmount.toString()))
          track({
            event: 'zap',
            chain: chainId,
            data: {
              cat: 'farm',
              token1: zap.currencyIn.currency.getSymbol(chainId),
              token2: `${zap.currencyOut1.outputCurrency.getSymbol(
                chainId,
              )}-${zap.currencyOut2.outputCurrency.getSymbol(chainId)}`,
              amount,
              usdAmount: amount * tokenPrice,
            },
          })
        })
        .catch((error) => {
          console.error(error)
          handlePendingTx(false)
          toastError(
            error?.message.includes('INSUFFICIENT')
              ? t('Slippage Error: Please go to the GET LP modal and check your slippage using the ⚙️ icon')
              : error?.message || t('Error: Please try again.'),
          )
          setZapSlippage(originalSlippage)
        })
    }
  }, [
    handlePendingTx,
    isZapSelected,
    onStakeLp,
    typedValue,
    zapCallback,
    library,
    zap,
    chainId,
    tokenPrice,
    setZapSlippage,
    originalSlippage,
    dispatch,
    pid,
    account,
    onDismiss,
    toastError,
    t,
  ])
}

export default useDualDeposit
