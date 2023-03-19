import getTimePeriods from 'utils/getTimePeriods'
import { ApiResponse, Chain } from '../types'
import { wrappedToNative } from './rawToPortfolio'

export interface NftInfo {
  type: 'NFA' | 'NFB' | 'Bill'
  id: number | string
  name: string
  imageUrl: string
  chain?: Chain
  rarityRank?: number
  rarityTier?: number
  billType?: 'Banana' | 'Jungle'
  billValue?: number
  timeRemaining?: string
  tokens?: {
    token1: string
    token2: string
    token3: string
  }
}

export function rawToNfts({ userHoldings, userStats }: ApiResponse) {
  const nfts: NftInfo[] = [...userHoldings.nfts]

  userStats.forEach(({ bills, chainId }) => {
    bills?.forEach(({ billId, earnToken, imageUrl, purchaseToken, totalPayout, type, vestingTimeRemaining }) => {
      const timeUntilEnd = vestingTimeRemaining > 0 ? getTimePeriods(vestingTimeRemaining, true) : null

      const tokens = {
        token1: wrappedToNative(purchaseToken.pairData.token0.symbol),
        token2: wrappedToNative(purchaseToken.pairData.token1.symbol),
        token3: wrappedToNative(earnToken.symbol),
      }

      nfts.push({
        chain: chainId,
        name: `${tokens.token1}-${tokens.token2}`,
        id: `${chainId}-${billId}`,
        imageUrl,
        type: 'Bill',
        billType: type,
        billValue: totalPayout,
        timeRemaining: timeUntilEnd
          ? `${timeUntilEnd.days}d ${timeUntilEnd.hours}h ${timeUntilEnd.minutes}m`
          : 'FULLY VESTED',
        tokens,
      })
    })
  })

  return nfts
}
