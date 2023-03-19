import { chainMap } from './chainMap'
import { ApiResponse, Chain, Position } from '../types'
import {
  billToPosition,
  farmToPosition,
  iaoToPosition,
  jungleToPosition,
  lendingToPosition,
  maximizerToPosition,
  poolToPosition,
} from './rawToPosition'

export type ProductType = typeof productTypes[number]

export interface PortfolioData {
  type: ProductType
  chainData: { [key in Chain]: Position[] }
  totalValue: number
  totalEarnings: number
}

const productTypes = ['farms', 'pools', 'vaults', 'jungleFarms', 'lending', 'maximizers', 'bills', 'iaos'] as const

function initProducts(): PortfolioData[] {
  return productTypes.map((type) => ({
    type,
    chainData: chainMap(() => [] as Position[]),
    totalValue: 0,
    totalEarnings: 0,
  }))
}

export function rawToPortfolio({ userStats, bananaPrice }: ApiResponse) {
  const products = initProducts()

  userStats.forEach(({ chainId, bills, farms, iaos, jungleFarms, lending, maximizers, pools }) => {
    farms?.forEach((farm) => {
      const positionData = farmToPosition(farm)
      const positionEarnings = positionData.secondaryRewardBalance
        ? positionData.rewardBalance * bananaPrice + positionData.secondaryRewardValue
        : positionData.rewardBalance * bananaPrice

      const product = products.find((p) => p.type === 'farms')

      product.chainData[chainId].push(positionData)
      product.totalValue += positionData.value
      product.totalEarnings += positionEarnings
    })

    pools?.forEach((pool) => {
      const positionData = poolToPosition(pool)
      const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

      const product = products.find((p) => p.type === 'pools')

      product.chainData[chainId].push(positionData)
      product.totalValue += positionData.value
      product.totalEarnings += positionEarnings
    })

    jungleFarms?.forEach((farm) => {
      const positionData = jungleToPosition(farm)
      const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

      const product = products.find((p) => p.type === 'jungleFarms')

      product.chainData[chainId].push(positionData)
      product.totalValue += positionData.value
      product.totalEarnings += positionEarnings
    })

    lending?.markets?.forEach((lendingInfo) => {
      const positionData = lendingToPosition(lendingInfo)

      const product = products.find((p) => p.type === 'lending')

      product.chainData[chainId].push(positionData)
      product.totalValue += positionData.value

      if (!product.totalEarnings) product.totalEarnings = lending.earnedBalance * bananaPrice
    })

    maximizers?.forEach((vault) => {
      const positionData = maximizerToPosition(vault)
      const positionEarnings = positionData.rewardBalance * bananaPrice

      const product = products.find((p) => p.type === 'maximizers')

      product.chainData[chainId].push(positionData)
      product.totalValue += positionData.value
      product.totalEarnings += positionEarnings
    })

    bills?.forEach((bill) => {
      if (bill.vestingTimeRemaining < 1 && bill.earnedBalance === 0) return

      const positionData = billToPosition(bill)
      const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

      const product = products.find((p) => p.type === 'bills')

      product.chainData[chainId].push(positionData)
      product.totalValue += positionData.value
      product.totalEarnings += positionEarnings
    })

    iaos?.forEach((iao) => {
      const positionData = iaoToPosition(iao)
      const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

      const product = products.find((p) => p.type === 'iaos')

      product.chainData[chainId].push(positionData)
      product.totalValue += positionData.value
      product.totalEarnings += positionEarnings
    })
  })

  return products.filter((product) => product.totalEarnings || product.totalValue)
}

const symbolsMap = {
  WBNB: 'BNB',
  WETH: 'ETH',
  WMATIC: 'MATIC',
  eLunr: 'LUNR',
  BTCB: 'BTC',
  WTLOS: 'TLOS',
  WBTC: 'BTC',
}

export function wrappedToNative(symbol: string) {
  return symbolsMap[symbol] || symbol
}
