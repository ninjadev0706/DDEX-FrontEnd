import sousChefABI from 'config/abi/sousChef.json'
import bananaABI from 'config/abi/banana.json'
import { Pool, TokenPrices } from 'state/types'
import masterchefV2ABI from 'config/abi/masterChefV2.json'
import { chunk } from 'lodash'
import multicall from 'utils/multicall'
import fetchPoolCalls, { fetchBananaPoolCall } from './fetchPoolCalls'
import cleanPoolData from './cleanPoolData'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, BSC_BLOCK_TIME } from 'config'
import { ethers } from 'ethers'

const fetchPools = async (chainId: number, tokenPrices: TokenPrices[], poolsConfig: Pool[]) => {
  const poolIds = []
  const poolCalls = poolsConfig.flatMap((pool) => {
    poolIds.push(pool.sousId)
    return fetchPoolCalls(pool, chainId)
  })
  const bananaPoolCalls = fetchBananaPoolCall(chainId)
  const vals = await multicall(chainId, [...sousChefABI, ...bananaABI], poolCalls)
  const [bananaPoolVals, totalAlloc, bananaPerSecond] = await multicall(chainId, masterchefV2ABI, bananaPoolCalls)
  // We do not want the block time for the banana earn banana pool so we append two null values to keep the chunks even
  // First null values is for Master Ape V2 and second is Master Ape V1
  const formattedVals = [null, null, bananaPoolVals?.totalStaked._hex, null, null, ...vals.slice(1)]
  const chunkSize = formattedVals.length / poolsConfig.length
  const bananaAlloc = bananaPoolVals?.allocPoint._hex
  const poolWeight = new BigNumber(bananaAlloc).div(new BigNumber(totalAlloc))
  const chunkedPools = chunk(formattedVals, chunkSize)
  const bananaPerYear = new BigNumber(ethers.utils.formatEther(bananaPerSecond.toString()))
    .times(BSC_BLOCK_TIME)
    .times(BLOCKS_PER_YEAR)
  return cleanPoolData(poolIds, chunkedPools, tokenPrices, chainId, poolsConfig, poolWeight, bananaPerYear)
}

export default fetchPools
