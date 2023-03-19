/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { useModal } from '@ape.swap/uikit'
import DualLiquidityModal from '../DualLiquidityModal'
import { Field, selectCurrency } from 'state/swap/actions'
import { selectOutputCurrency } from 'state/zap/actions'
import { useDispatch } from 'react-redux'
import { ZapType } from '@ape.swap/sdk'
import { CHAIN_PARAMS } from 'config/constants/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Token } from 'config/constants/types'

const useAddLiquidityModal = (zapIntoProductType?: ZapType) => {
  const { chainId } = useActiveWeb3React()
  const [poolAddress, setPoolAddress] = useState(' ')
  const [pid, setPid] = useState('')
  const [zapable, setZapable] = useState(false)
  const dispatch = useDispatch()
  const [onPresentAddLiquidityWidgetModal] = useModal(
    <DualLiquidityModal
      poolAddress={poolAddress}
      pid={pid}
      zapIntoProductType={zapIntoProductType}
      zapable={zapable}
    />,
    true,
    true,
    'dualLiquidityModal',
  )

  const nativeToETH = useCallback(
    (token: Token) => {
      const nativeSymbol = CHAIN_PARAMS[chainId].nativeCurrency.symbol
      if (token.symbol === nativeSymbol) return 'ETH'
      return token.address[chainId]
    },
    [chainId],
  )

  return useCallback(
    (token: Token, quoteToken: Token, poolAddress?: string, pid?: string, zapable?: boolean) => {
      dispatch(
        selectCurrency({
          field: Field.INPUT,
          currencyId: nativeToETH(token),
        }),
      )
      dispatch(
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: nativeToETH(quoteToken),
        }),
      )
      dispatch(
        selectOutputCurrency({
          currency1: nativeToETH(token),
          currency2: nativeToETH(quoteToken),
        }),
      )
      setPoolAddress(poolAddress)
      setPid(pid)
      setZapable(zapable)
      onPresentAddLiquidityWidgetModal()
    },
    [dispatch, nativeToETH, onPresentAddLiquidityWidgetModal],
  )
}

export default useAddLiquidityModal
