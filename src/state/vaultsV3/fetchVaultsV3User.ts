import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import vaultApeV2ABI from 'config/abi/vaultApeV2.json'
import multicall from 'utils/multicall'
import { getVaultApeAddressV1, getVaultApeAddressV3 } from 'utils/addressHelper'
import { Vault } from 'state/types'
import { VaultVersion } from '@ape.swap/apeswap-lists'

export const fetchVaultUserAllowances = async (account: string, chainId: number, vaultsConfig: Vault[]) => {
  const returnObj: Record<number, string> = {}
  const vaultApeAddressV3 = getVaultApeAddressV3(chainId)
  const vaultApeAddressV1 = getVaultApeAddressV1(chainId)
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return {
      address: vault.stakeToken.address[chainId],
      name: 'allowance',
      params: [account, vault.version === VaultVersion.V1 ? vaultApeAddressV1 : vaultApeAddressV3],
    }
  })
  const rawStakeAllowances = await multicall(chainId, erc20ABI, calls)
  rawStakeAllowances.forEach((stakeBalance, i) => {
    returnObj[vaultsConfig[i].pid] = new BigNumber(stakeBalance).toJSON()
  })
  return returnObj
}

export const fetchVaultUserTokenBalances = async (account: string, chainId: number, vaultsConfig: Vault[]) => {
  const returnObj: Record<number, string> = {}
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return {
      address: vault.stakeToken.address[chainId],
      name: 'balanceOf',
      params: [account],
    }
  })
  const rawTokenBalances = await multicall(chainId, erc20ABI, calls)
  rawTokenBalances.forEach((tokenBalance, i) => {
    returnObj[vaultsConfig[i].pid] = new BigNumber(tokenBalance).toJSON()
  })
  return returnObj
}

export const fetchVaultUserStakedAndPendingBalances = async (
  account: string,
  chainId: number,
  vaultsConfig: Vault[],
) => {
  const returnStakedObj: Record<number, string> = {}
  const returnPendingObj: Record<number, string> = {}
  const vaultApeAddressV1 = getVaultApeAddressV1(chainId)
  const vaultApeAddressV3 = getVaultApeAddressV3(chainId)
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  // const filterAutoVault = filteredVaults.filter((vault) => vault.type !== 'AUTO')
  const calls = filteredVaults.map((vault) => {
    return vault.type === 'AUTO'
      ? {
          address: vaultApeAddressV1,
          name: 'stakedWantTokens',
          params: [vault.pid, account],
        }
      : {
          address: vaultApeAddressV3,
          name: 'balanceOf',
          params: [vault.pid, account],
        }
  })

  const rawStakedBalances = await multicall(chainId, vaultApeV2ABI, calls)
  rawStakedBalances.forEach((stakedBalance, i) => {
    returnStakedObj[vaultsConfig[i].pid] = new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  rawStakedBalances.forEach((stakedBalance, i) => {
    returnPendingObj[vaultsConfig[i].pid] =
      vaultsConfig[i].type === 'AUTO' ? '0' : new BigNumber(stakedBalance[1]._hex).toJSON()
  })
  return { stakedBalances: returnStakedObj, pendingRewards: returnPendingObj }
}
