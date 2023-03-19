import BigNumber from 'bignumber.js'
import { BANANA_PER_YEAR, SECONDS_PER_YEAR } from 'config'
import { CHAIN_BLOCKS_PER_YEAR } from 'config/constants/chains'

export const getPoolApr = (
  chainId: number,
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: string,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
    .times(tokenPerBlock)
    .times(CHAIN_BLOCKS_PER_YEAR[chainId])
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const getPoolAprPerSecond = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  rewardsPerSecond: string,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(rewardsPerSecond).times(SECONDS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const getDualFarmApr = (
  poolLiquidityUsd: number,
  miniChefRewardTokenPrice: number,
  miniChefTokensPerSecond: string,
  rewarerdTokenPrice: number,
  rewarderTokensPerSecond: string,
): number => {
  const totalRewarderRewardPricePerYear = new BigNumber(rewarerdTokenPrice)
    .times(rewarderTokensPerSecond)
    .times(SECONDS_PER_YEAR)
  const totalMiniChefRewardPricePerYear = new BigNumber(miniChefRewardTokenPrice)
    .times(miniChefTokensPerSecond)
    .times(SECONDS_PER_YEAR)
  const totalRewardsPerYear = totalMiniChefRewardPricePerYear.plus(totalRewarderRewardPricePerYear)
  const apr = totalRewardsPerYear.div(poolLiquidityUsd).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const getFarmApr = (poolWeight: BigNumber, bananaPriceUsd: BigNumber, poolLiquidityUsd: BigNumber): number => {
  const yearlyBananaRewardAllocation = BANANA_PER_YEAR.times(poolWeight).times(bananaPriceUsd)
  const apr = yearlyBananaRewardAllocation.div(poolLiquidityUsd).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const getFarmV2Apr = (
  poolWeight: BigNumber,
  bananaPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  bananaPerYear?: BigNumber,
): number => {
  const yearlyBananaRewardAllocation = bananaPerYear.times(poolWeight).times(bananaPriceUsd)
  const apr = yearlyBananaRewardAllocation.div(poolLiquidityUsd).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}
