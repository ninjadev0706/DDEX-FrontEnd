import { Currency, SmartRouter, Token } from '@ape.swap/sdk'
import { Contract } from 'ethers'
import { useSingleCallResult } from 'lib/hooks/multicall'
import store from 'state'
import { getNativeWrappedAddress, getSmartPriceGetter } from 'utils/addressHelper'
import apePriceGetter from 'config/abi/apePriceGetter.json'
import { getBalanceNumber } from 'utils/formatBalance'

export const useTokenPriceUsd = (chainId: number, currency: Currency, lp = false, smartRouter?: SmartRouter) => {
  const isNative = currency?.symbol === 'ETH'
  const [address] = currency instanceof Token ? [currency?.address, currency?.decimals] : ['', 18]
  const priceGetterAddress = getSmartPriceGetter(chainId, smartRouter)
  const priceGetterContract = new Contract(priceGetterAddress, apePriceGetter)

  const nativeTokenAddress = getNativeWrappedAddress(chainId)

  const { result } = useSingleCallResult(currency ? priceGetterContract : undefined, lp ? 'getLPPrice' : 'getPrice', [
    isNative ? nativeTokenAddress : address,
    18,
  ])
  if (currency?.symbol === 'GNANA') {
    return parseFloat(store.getState().tokenPrices.bananaPrice) * 1.3889
  }
  return result?.[0] ? getBalanceNumber(result[0].toString(), 18) : 0
}
