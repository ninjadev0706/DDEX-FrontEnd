import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefV2ABI from 'config/abi/masterChefV2.json'
import { Farm } from 'state/types'
import { getMasterChefV2Address } from 'utils/addressHelper'
import multicall from 'utils/multicall'

export const fetchFarmV2UserAllowances = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const returnObj: Record<number, string> = {}
  const masterChefAddress = getMasterChefV2Address(chainId)
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.lpAddresses[chainId]
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAddress] }
  })

  const rawLpAllowances = await multicall(chainId, erc20ABI, calls)
  rawLpAllowances.forEach((lpBalance, i) => {
    returnObj[farmsConfig[i].pid] = new BigNumber(lpBalance).toJSON()
  })
  return returnObj
}

export const fetchFarmV2UserTokenBalances = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const returnObj: Record<number, string> = {}
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.lpAddresses[chainId]
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(chainId, erc20ABI, calls)
  rawTokenBalances.forEach((tokenBalance, i) => {
    returnObj[farmsConfig[i].pid] = new BigNumber(tokenBalance).toJSON()
  })
  return returnObj
}

export const fetchFarmV2UserStakedBalances = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const returnObj: Record<number, string> = {}
  const masterChefAddress = getMasterChefV2Address(chainId)
  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(chainId, masterchefV2ABI, calls)
  rawStakedBalances.forEach((stakedBalance, i) => {
    returnObj[farmsConfig[i].pid] = new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return returnObj
}

export const fetchFarmV2UserEarnings = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const returnObj: Record<number, string> = {}
  const masterChefAddress = getMasterChefV2Address(chainId)
  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'pendingBanana',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(chainId, masterchefV2ABI, calls)
  rawEarnings.forEach((earnings, i) => {
    returnObj[farmsConfig[i].pid] = new BigNumber(earnings).toJSON()
  })
  return returnObj
}
