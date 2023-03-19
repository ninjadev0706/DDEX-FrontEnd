import BigNumber from 'bignumber.js'
import { PoolConfig, Token } from 'config/constants/types'
import { Pool, TokenPrices } from 'state/types'
import { getFarmV2Apr, getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'

const cleanPoolData = (
  poolIds: number[],
  chunkedPools: any[],
  tokenPrices: TokenPrices[],
  chainId: number,
  poolsConfig: Pool[],
  bananaAlloc,
  bananaPerYear,
) => {
  const data = chunkedPools.map((chunk, index) => {
    const poolConfig: PoolConfig = poolsConfig.find((pool) => pool.sousId === poolIds[index])
    const [startBlock, endBlock, totalStaked] = chunk
    const totalStakedFormatted = new BigNumber(totalStaked).toJSON()
    const [stakingToken, rewardToken, apr] = fetchPoolTokenStatsAndApr(
      poolConfig,
      tokenPrices,
      totalStakedFormatted,
      chainId,
      bananaAlloc,
      bananaPerYear,
    )
    return {
      sousId: poolIds[index],
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: poolConfig?.bonusEndBlock || new BigNumber(endBlock).toJSON(),
      totalStaked: totalStakedFormatted,
      stakingToken: { ...poolConfig?.stakingToken, ...stakingToken },
      rewardToken: { ...poolConfig?.rewardToken, ...rewardToken },
      apr,
    }
  })
  return data
}

const fetchPoolTokenStatsAndApr = (
  pool: PoolConfig,
  tokenPrices: TokenPrices[],
  totalStaked,
  chainId: number,
  bananaAlloc,
  bananaPerYear,
): [Token, Token, number] => {
  // Get values needed to calculate apr
  const curPool = pool
  const rewardToken = tokenPrices
    ? tokenPrices.find(
        (token) => pool?.rewardToken && token?.address?.[chainId] === pool?.rewardToken?.address?.[chainId],
      )
    : pool?.rewardToken
  const stakingToken = tokenPrices
    ? tokenPrices.find((token) => token?.address?.[chainId] === pool?.stakingToken?.address?.[chainId])
    : pool?.stakingToken
  // Calculate apr
  let apr
  if (pool.sousId === 0) {
    apr = getFarmV2Apr(
      bananaAlloc,
      new BigNumber(stakingToken?.price),
      new BigNumber(getBalanceNumber(totalStaked) * stakingToken?.price),
      bananaPerYear,
    )
  } else {
    apr = getPoolApr(
      chainId,
      stakingToken?.price,
      rewardToken?.price,
      getBalanceNumber(totalStaked),
      curPool?.tokenPerBlock,
    )
  }
  return [stakingToken, rewardToken, apr]
}

export default cleanPoolData
