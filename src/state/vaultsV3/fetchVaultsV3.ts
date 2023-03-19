import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterChefV2.json'
import { FarmLpAprsType, TokenPrices, Vault } from 'state/types'
import { getContract } from 'utils/getContract'
import masterchefV2ABI from 'config/abi/masterChefV2.json'
import { getMasterChefV2Address, getVaultApeAddressV3 } from 'utils/addressHelper'
import { chunk } from 'lodash'
import vaultApeV2ABI from 'config/abi/vaultApeV2.json'
import multicall from 'utils/multicall'
import fetchVaultCalls from './fetchVaultV3Calls'
import cleanVaultData from './cleanVaultV3Data'
import { BLOCKS_PER_YEAR, BSC_BLOCK_TIME } from 'config'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

const fetchVaults = async (
  chainId: number,
  tokenPrices: TokenPrices[],
  farmLpAprs: FarmLpAprsType,
  vaultsConfig: Vault[],
) => {
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const masterVaultApeV3 = getContract(vaultApeV2ABI, getVaultApeAddressV3(chainId), chainId)
  const masterChefAddress = getMasterChefV2Address(chainId)
  const vaultIds = []
  const vaultCalls = filteredVaults.flatMap((vault) => {
    vaultIds.push(vault.id)
    return fetchVaultCalls(vault, chainId)
  })
  const vals = await multicall(chainId, [...masterchefABI, ...erc20], vaultCalls)
  const vaultSettingsV3 = await masterVaultApeV3.getSettings()
  const chunkSize = vaultCalls.length / filteredVaults.length
  const chunkedVaults = chunk(vals, chunkSize)
  const [bananaPerSecond] = await multicall(chainId, masterchefV2ABI, [
    {
      address: masterChefAddress,
      name: 'bananaPerSecond',
    },
  ])
  const bananaPerYear = new BigNumber(ethers.utils.formatEther(bananaPerSecond.toString()))
    .times(BSC_BLOCK_TIME)
    .times(BLOCKS_PER_YEAR)

  return cleanVaultData(
    vaultIds,
    chunkedVaults,
    vaultSettingsV3,
    tokenPrices,
    farmLpAprs,
    chainId,
    vaultsConfig,
    bananaPerYear,
  )
}

export default fetchVaults
