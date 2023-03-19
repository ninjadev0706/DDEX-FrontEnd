import { useCallback } from 'react'
import { useTreasury } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import track from 'utils/track'
import { useBananaPrice } from 'state/tokenPrices/hooks'

export const buy = async (contract, amount) => {
  try {
    return contract.buy(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).then((tx) => {
      return tx.hash
    })
  } catch (err) {
    return console.warn(err)
  }
}

export const sell = async (contract, amount) => {
  try {
    return contract.sell(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()).then((tx) => {
      return tx.hash
    })
  } catch (err) {
    return console.warn(err)
  }
}

export const useSellGoldenBanana = () => {
  const treasuryContract = useTreasury()
  const bananaPrice = useBananaPrice()

  const handleSell = useCallback(
    async (amount: string) => {
      try {
        const txHash = await sell(treasuryContract, amount)
        track({
          event: 'gnana',
          chain: 56,
          data: {
            amount,
            cat: 'sell',
            usdAmount: parseFloat(amount) * parseFloat(bananaPrice),
          },
        })
        return txHash
      } catch (e) {
        return false
      }
    },
    [bananaPrice, treasuryContract],
  )

  return { handleSell }
}

export const useBuyGoldenBanana = () => {
  const treasuryContract = useTreasury()
  const bananaPrice = useBananaPrice()

  const handleBuy = useCallback(
    async (amount: string) => {
      try {
        const txHash = await buy(treasuryContract, amount)
        track({
          event: 'gnana',
          chain: 56,
          data: {
            amount,
            cat: 'buy',
            usdAmount: parseFloat(amount) * parseFloat(bananaPrice),
          },
        })
        return txHash
      } catch (e) {
        return false
      }
    },
    [bananaPrice, treasuryContract],
  )

  return { handleBuy }
}
