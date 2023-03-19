import { VaultVersion } from '@ape.swap/apeswap-lists'
import { ChainId } from '@ape.swap/sdk'
import BigNumber from 'bignumber.js'
import { Farm, Vault } from 'state/types'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { MIGRATION_STEPS } from './constants'
import {
  MasterApeProductsInterface,
  MasterApeV2ProductsInterface,
  MigrateLpStatus,
  MigrateStatus,
  ProductTypes,
} from './types'

export const mergeV1Products = (farms: Farm[], v2Farms: Farm[], v1Vaults: Vault[], chainId: ChainId) => {
  const userV1Farms = farms?.filter(
    ({ userData }) =>
      (userData && new BigNumber(userData.stakedBalance).isGreaterThan(0)) ||
      new BigNumber(userData?.tokenBalance).isGreaterThan(0),
  )

  const userV1StakedVaults = v1Vaults?.filter(
    ({ userData }) => userData && new BigNumber(userData.stakedBalance).isGreaterThan(0),
  )

  // Filter out farms that do not exists on v2Farms
  const filteredV1V2FarmProducts = userV1Farms?.filter(({ lpAddresses }) => {
    return v2Farms?.find(({ lpAddresses: lpAddressesV2 }) => {
      return lpAddressesV2[chainId]?.toLowerCase() === lpAddresses[chainId]?.toLowerCase()
    })
  })

  return [
    ...filteredV1V2FarmProducts.map((farm) => {
      const singleStakeAsset = farm.pid === 0
      const lp = farm.lpAddresses[chainId]?.toLowerCase()
      return {
        id: `${ProductTypes.FARM}-${lp}`,
        lp,
        pid: farm.pid,
        type: ProductTypes.FARM,
        singleStakeAsset,
        token0: {
          address: farm.tokenAddresses[chainId]?.toLowerCase(),
          symbol: !singleStakeAsset ? farm.tokenSymbol : farm.lpSymbol,
        },
        token1: {
          address: farm.quoteTokenAdresses[chainId]?.toLowerCase(),
          symbol: farm.quoteTokenSymbol,
        },
        stakedAmount: getFullDisplayBalance(new BigNumber(farm.userData.stakedBalance)),
        walletBalance: getFullDisplayBalance(new BigNumber(farm.userData.tokenBalance)),
        allowance: farm.userData.allowance.toString(),
        lpValueUsd: farm.lpValueUsd,
      }
    }),
    ...userV1StakedVaults.map((vault) => {
      const singleStakeAsset = !vault.quoteToken
      const productType = vault.version === VaultVersion.V1 ? ProductTypes.VAULT_V1 : ProductTypes.VAULT
      const lp = vault.stakeToken.address[chainId]?.toLowerCase()

      return {
        // Since there is a BANANA single stake vault one LP could be the BANANA address
        id: `${productType}-${lp}`,
        lp,
        pid: vault.pid,
        type: productType,
        singleStakeAsset,
        token0: {
          address: vault.token.address[chainId].toLowerCase(),
          symbol: vault.token.symbol,
        },
        token1: {
          address: !singleStakeAsset ? vault.quoteToken.address[chainId].toLowerCase() : '',
          symbol: !singleStakeAsset ? vault.quoteToken.symbol : '',
        },
        stakedAmount: getFullDisplayBalance(new BigNumber(vault.userData.stakedBalance)),
        walletBalance: getFullDisplayBalance(new BigNumber(vault.userData.tokenBalance)),
        allowance: vault.userData.allowance.toString(),
        lpValueUsd: vault.stakeTokenPrice,
      }
    }),
  ]
}

export const mergeV2Products = (v1Farms: Farm[], v2Farms: Farm[], v3Vaults: Vault[], chainId: ChainId) => {
  // Filter out farms that do not exists on v1Farms
  const filteredV1V2FarmProducts = v2Farms?.filter(({ lpAddresses }) => {
    return v1Farms?.find(({ lpAddresses: lpAddressesV2 }) => {
      return lpAddressesV2[chainId]?.toLowerCase() === lpAddresses[chainId]?.toLowerCase()
    })
  })
  const userV2Farms = filteredV1V2FarmProducts?.filter(({ userData }) =>
    new BigNumber(userData?.tokenBalance).isGreaterThan(0),
  )
  const filteredActiveVaults = v3Vaults?.filter((vault) => !vault.inactive)

  return userV2Farms?.map(
    ({
      lpAddresses,
      tokenAddresses,
      tokenSymbol,
      lpSymbol,
      quoteTokenAdresses,
      quoteTokenSymbol,
      userData,
      pid,
      lpValueUsd,
    }) => {
      const matchedVault: Vault = filteredActiveVaults.find(
        (vault) => vault.stakeToken.address[chainId].toLowerCase() === lpAddresses[chainId].toLowerCase(),
      )
      const singleStakeAsset = pid === 0
      return {
        id: lpAddresses[chainId]?.toLowerCase(),
        lp: lpAddresses[chainId]?.toLowerCase(),
        singleStakeAsset,
        walletBalance: getFullDisplayBalance(new BigNumber(userData.tokenBalance)),
        lpValueUsd,
        farm: {
          pid: pid,
          token0: {
            address: tokenAddresses[chainId]?.toLowerCase(),
            symbol: !singleStakeAsset ? tokenSymbol : lpSymbol,
          },
          token1: {
            address: quoteTokenAdresses[chainId]?.toLowerCase(),
            symbol: quoteTokenSymbol,
          },
          stakedAmount: getFullDisplayBalance(new BigNumber(userData.stakedBalance)),
          allowance: userData.allowance?.toString(),
        },
        vault: matchedVault
          ? {
              pid: matchedVault.pid,
              token0: {
                address: matchedVault.token.address[chainId]?.toLowerCase(),
                symbol: matchedVault.token.symbol,
              },
              token1: {
                address: !singleStakeAsset ? matchedVault.quoteToken.address[chainId]?.toLowerCase() : '',
                symbol: !singleStakeAsset ? matchedVault.quoteToken.symbol : '',
              },
              stakedAmount: getFullDisplayBalance(new BigNumber(matchedVault?.userData?.stakedBalance)),
              allowance: matchedVault.userData?.allowance?.toString(),
            }
          : null,
      }
    },
  )
}

export const getInitialMigrateLpStatus = (
  v1Products: MasterApeProductsInterface[],
  v2Products: MasterApeV2ProductsInterface[],
  v2Farms: Farm[],
  migrateMaximizers: boolean,
  chainId,
) => {
  // To make sure we dont have farms that wont be part of the migration we need to filter them out
  const filteredV1Products = v1Products.filter(({ lp }) =>
    v2Farms.find(({ lpAddresses }) => lpAddresses[chainId]?.toLowerCase() === lp.toLowerCase()),
  )

  // Filter out dust left in vaults
  const filterV1Dust = filteredV1Products.flatMap((product) => {
    if (product.type === ProductTypes.VAULT || product.type === ProductTypes.VAULT_V1) {
      if (product.singleStakeAsset && new BigNumber(product.stakedAmount).gt(0.5)) {
        return product
      } else if (
        !product.singleStakeAsset &&
        new BigNumber(parseFloat(product.stakedAmount) * product.lpValueUsd).gt(0.25)
      ) {
        return product
      } else {
        return []
      }
    } else {
      return product
    }
  })

  const apeswapLpStatus = filterV1Dust?.flatMap(({ stakedAmount, lp, id }) => {
    const matchedV2Product: MasterApeV2ProductsInterface = v2Products?.find(({ lp: v2Lp }) => v2Lp === lp)
    const matchedV2Vault = matchedV2Product?.vault
    const idToUse = new BigNumber(stakedAmount).isGreaterThan(0) ? id : lp
    return {
      id: idToUse,
      lp,
      status: {
        unstake: new BigNumber(stakedAmount).isGreaterThan(0) ? MigrateStatus.INCOMPLETE : MigrateStatus.COMPLETE,
        approveStake: matchedV2Product
          ? migrateMaximizers && matchedV2Vault
            ? new BigNumber(matchedV2Product.vault.allowance).isGreaterThan(0)
              ? MigrateStatus.COMPLETE
              : MigrateStatus.INCOMPLETE
            : new BigNumber(matchedV2Product.farm.allowance).isGreaterThan(0)
            ? MigrateStatus.COMPLETE
            : MigrateStatus.INCOMPLETE
          : MigrateStatus.INCOMPLETE,
        stake: MigrateStatus.INCOMPLETE,
      },
      statusText: 'Migration Initialized',
    }
  })

  // To make sure we dont have farms that wont be part of the migration we need to filter them out
  const filteredV2Products = v2Products.filter(({ lp }) =>
    v2Farms.find(({ lpAddresses }) => lpAddresses[chainId]?.toLowerCase() === lp.toLowerCase()),
  )

  const apeswapV2LpStatus = filteredV2Products?.flatMap(({ id, lp, farm, vault }) => {
    // If there is a matched V1 product that means we still need to unstake so make that incomplete
    const matchedV1ProductStaked = new BigNumber(
      filteredV1Products.find(({ lp: v1Lp }) => v1Lp === lp)?.stakedAmount || 0,
    )?.gt(0)
    return {
      id,
      lp,
      status: {
        unstake: matchedV1ProductStaked ? MigrateStatus.INCOMPLETE : MigrateStatus.COMPLETE,
        approveStake:
          migrateMaximizers && vault
            ? new BigNumber(vault.allowance).gt(0)
              ? MigrateStatus.COMPLETE
              : MigrateStatus.INCOMPLETE
            : new BigNumber(farm.allowance).gt(0)
            ? MigrateStatus.COMPLETE
            : MigrateStatus.INCOMPLETE,
        stake: MigrateStatus.INCOMPLETE,
      },
      statusText: 'Migration Initialized',
    }
  })
  // Get rid of duplicate status
  // v1 status gets priority over v2 status

  // Get rid of duplicate status
  return [...new Map([...apeswapV2LpStatus, ...apeswapLpStatus].map((item) => [item.id, item])).values()]
}

/**
 * Helper function to get the correct step a user is on
 * @param migrateLpStatus List of LP Status to check complete status
 */
export const activeIndexHelper = (migrateLpStatus: MigrateLpStatus[]) => {
  const isComplete =
    migrateLpStatus?.map((item) =>
      Object.entries(item.status).map(([, status]) => status === MigrateStatus.COMPLETE),
    ) || []
  for (let i = 0; i < MIGRATION_STEPS.length; i++) {
    if (isComplete.filter((loFlag) => !loFlag[i]).length !== 0) {
      return i
    }
  }
  return MIGRATION_STEPS.length - 1
}
