import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import vaultApeV2ABI from 'config/abi/vaultApeV2.json'
import multicall from 'utils/multicall'
import { getBananaAddress, getVaultApeAddressV1, getVaultApeAddressV2, getVaultApeAddressV3 } from 'utils/addressHelper'
import { Vault } from 'state/types'
import { VaultVersion } from '@ape.swap/apeswap-lists'

// TODO: Do the same vault refactoring as farms

export const fetchVaultUserAllowances = async (account: string, chainId: number, vaultsConfig: Vault[]) => {
  const vaultApeAddressV1 = getVaultApeAddressV1(chainId)
  const vaultApeAddressV2 = getVaultApeAddressV2(chainId)
  const vaultApeAddressV3 = getVaultApeAddressV3(chainId)
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return {
      address: vault.stakeToken.address[chainId],
      name: 'allowance',
      params: [
        account,
        vault.version === VaultVersion.V1
          ? vaultApeAddressV1
          : vault.version === VaultVersion.V2
          ? vaultApeAddressV2
          : vaultApeAddressV3,
      ],
    }
  })
  const rawStakeAllowances = await multicall(chainId, erc20ABI, calls)
  const parsedStakeAllowances = rawStakeAllowances.map((stakeBalance) => {
    return new BigNumber(stakeBalance).toJSON()
  })
  return parsedStakeAllowances
}

export const fetchVaultUserTokenBalances = async (account: string, chainId: number, vaultsConfig: Vault[]) => {
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return {
      address: vault.stakeToken.address[chainId],
      name: 'balanceOf',
      params: [account],
    }
  })
  const rawTokenBalances = await multicall(chainId, erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchVaultUserStakedAndPendingBalances = async (
  account: string,
  chainId: number,
  vaultsConfig: Vault[],
) => {
  const vaultApeAddressV1 = getVaultApeAddressV1(chainId)
  const vaultApeAddressV2 = getVaultApeAddressV2(chainId)
  const vaultApeAddressV3 = getVaultApeAddressV3(chainId)
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return vault.version === VaultVersion.V1
      ? {
          address: vaultApeAddressV1,
          name: 'stakedWantTokens',
          params: [vault.pid, account],
        }
      : {
          address: vault.version === VaultVersion.V2 ? vaultApeAddressV2 : vaultApeAddressV3,
          name: 'balanceOf',
          params: [vault.pid, account],
        }
  })

  const rawStakedBalances = await multicall(chainId, vaultApeV2ABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance, i) => {
    const isBanana =
      vaultsConfig[i].stakeToken.address[chainId].toLowerCase() === getBananaAddress(chainId).toLowerCase()
    const rawStakedBalance = new BigNumber(stakedBalance[0]._hex)
    // Dont display dust as it is confusing for the migration
    return rawStakedBalance.gt(isBanana ? 10000000000000 : 10) ? rawStakedBalance.toJSON() : '0'
  })
  const parsePendingBalances = rawStakedBalances.map((stakedBalance, index) => {
    return filteredVaults[index].version === VaultVersion.V1 ? '0' : new BigNumber(stakedBalance[1]._hex).toJSON()
  })
  return { stakedBalances: parsedStakedBalances, pendingRewards: parsePendingBalances }
}
