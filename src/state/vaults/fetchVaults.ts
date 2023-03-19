import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import { FarmLpAprsType, TokenPrices, Vault } from 'state/types'
import { getContract } from 'utils/getContract'
import { getVaultApeAddressV2, getVaultApeAddressV3 } from 'utils/addressHelper'
import { chunk } from 'lodash'
import vaultApeV2ABI from 'config/abi/vaultApeV2.json'
import multicall from 'utils/multicall'
import fetchVaultCalls from './fetchVaultCalls'
import cleanVaultData from './cleanVaultData'

const fetchVaults = async (
  chainId: number,
  tokenPrices: TokenPrices[],
  farmLpAprs: FarmLpAprsType,
  vaultsConfig: Vault[],
) => {
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const masterVaultApev2 = getContract(vaultApeV2ABI, getVaultApeAddressV2(chainId), chainId)
  const masterVaultApeV3 = getContract(vaultApeV2ABI, getVaultApeAddressV3(chainId), chainId)
  const vaultIds = []
  const vaultCalls = filteredVaults.flatMap((vault) => {
    vaultIds.push(vault.id)
    return fetchVaultCalls(vault, chainId)
  })
  const vals = await multicall(chainId, [...masterchefABI, ...erc20], vaultCalls)
  const vaultSettingsV2 = await masterVaultApev2.getSettings()
  const vaultSettingsV3 = await masterVaultApeV3.getSettings()
  const chunkSize = vaultCalls.length / filteredVaults.length
  const chunkedVaults = chunk(vals, chunkSize)
  return cleanVaultData(
    vaultIds,
    chunkedVaults,
    vaultSettingsV2,
    vaultSettingsV3,
    tokenPrices,
    farmLpAprs,
    chainId,
    vaultsConfig,
  )
}

export default fetchVaults
