import { PoolConfig } from 'config/constants/types'
import { getMasterChefV2Address } from 'utils/addressHelper'
import { Call } from 'utils/multicall'

const fetchPoolCalls = (pool: PoolConfig, chainId: number): Call[] => {
  const standardCalls = [
    {
      address: pool.contractAddress[chainId],
      name: 'startBlock',
    },
    // Get end block
    {
      address: pool.contractAddress[chainId],
      name: 'bonusEndBlock',
    },
  ]
  const bananaCall = {
    address: pool.stakingToken.address[chainId],
    name: 'balanceOf',
    params: [pool.contractAddress[chainId]],
  }
  const gnanaCall = {
    address: pool.contractAddress[chainId],
    name: 'totalStaked',
  }
  // Banana earn banana pool will break on start / end block calls
  if (pool.sousId === 0 || pool.sousId === 999) {
    return [bananaCall]
  }
  return [...standardCalls, pool.reflect || pool.stakingToken.symbol === 'GNANA' ? gnanaCall : bananaCall]
}

export const fetchBananaPoolCall = (chainId: number): Call[] => {
  const masterChefAddress = getMasterChefV2Address(chainId)
  return [
    {
      address: masterChefAddress,
      name: 'poolInfo',
      params: [0],
    },
    {
      address: masterChefAddress,
      name: 'totalAllocPoint',
    },
    {
      address: masterChefAddress,
      name: 'bananaPerSecond',
    },
  ]
}

export default fetchPoolCalls
