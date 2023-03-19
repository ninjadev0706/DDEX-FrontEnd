import React, { useCallback } from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { ZAP_ADDRESS } from '@ape.swap/sdk'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { ApeswapWalletLpInterface, MigrateLpStatus, MigrateStatus } from './types'
import { Farm, Vault } from 'state/types'
import { MIGRATION_STEPS } from './constants'
import { useFarms } from 'state/farms/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

/**
 * Helper function to set the initial status of both Migrate LPs and ApeSwap LPs if they exist
 * This function should only run on render and when user LPs have been loaded
 * @param migrateLps List of Migrate LPs
 * @param apeswapLps List of ApeSwap LPs
 * @param farms List of ApeSwap Farms to check allowances
 * @param vaults List of ApeSwap Vaults to check allowances
 * @param migrateMaximizers Flag to get the users preferred stake option
 * @param setLpStatus Action to set the LP status
 * @param account Users account address
 * @param chainId Current chain id the user is on
 */
export const setMigrateLpStatus = async (
  migrateLps: MigrateResult[],
  apeswapLps: ApeswapWalletLpInterface[],
  farms: Farm[],
  vaults: Vault[],
  migrateMaximizers: boolean,
  setLpStatus: React.Dispatch<React.SetStateAction<MigrateLpStatus[]>>,
  account,
  chainId,
) => {
  const getMigrateLpStatus = async () => {
    const calls = migrateLps?.map((migrateLp) => {
      return { address: migrateLp.lpAddress, name: 'allowance', params: [account, ZAP_ADDRESS[chainId]] }
    })
    const rawLpAllowances = await multicall(chainId, erc20ABI, calls)
    return migrateLps?.map((migrateLp, i) => {
      return {
        id: migrateLp.id,
        lpAddress: migrateLp.lpAddress,
        status: {
          unstake: parseFloat(migrateLp.stakedBalance) > 0 ? MigrateStatus.INCOMPLETE : MigrateStatus.COMPLETE,
          approveMigrate: new BigNumber(rawLpAllowances[i]).gt(0) ? MigrateStatus.COMPLETE : MigrateStatus.INCOMPLETE,
          migrate:
            parseFloat(migrateLp.walletBalance) > 0 || parseFloat(migrateLp.stakedBalance) > 0
              ? MigrateStatus.INCOMPLETE
              : MigrateStatus.COMPLETE,
          approveStake: MigrateStatus.INCOMPLETE,
          stake: MigrateStatus.INCOMPLETE,
        },
        statusText: 'Migration Initialized',
      }
    })
  }
  const getApeswapLpStatus = async () => {
    return apeswapLps?.map(({ pair, id }) => {
      const matchedVault = vaults.find(
        (vault) => vault.stakeToken.address[chainId].toLowerCase() === pair.liquidityToken.address.toLowerCase(),
      )
      const matchedFarm = farms.find(
        (farm) => farm.lpAddresses[chainId].toLowerCase() === pair.liquidityToken.address.toLowerCase(),
      )
      const migrateVaultAvailable = migrateMaximizers && matchedVault
      return {
        id,
        lpAddress: pair.liquidityToken.address,
        status: {
          unstake: MigrateStatus.COMPLETE,
          approveMigrate: MigrateStatus.COMPLETE,
          migrate: MigrateStatus.COMPLETE,
          approveStake: migrateVaultAvailable
            ? new BigNumber(matchedVault?.userData?.allowance).gt(0)
              ? MigrateStatus.COMPLETE
              : MigrateStatus.INCOMPLETE
            : new BigNumber(matchedFarm?.userData?.allowance).gt(0)
            ? MigrateStatus.COMPLETE
            : MigrateStatus.INCOMPLETE,
          stake: MigrateStatus.INCOMPLETE,
        },
        statusText: 'Migration Initialized',
      }
    })
  }
  const migrateLpStatus = await getMigrateLpStatus()
  const apeswapLpStatus = await getApeswapLpStatus()
  setLpStatus([...migrateLpStatus, ...apeswapLpStatus])
}

/**
 * Helper function to get the correct step a user is on
 * @param migrateLpStatus List of LP Status to check complete status
 */
export const activeIndexHelper = (migrateLpStatus: MigrateLpStatus[]) => {
  const isComplete = migrateLpStatus?.map((item) =>
    Object.entries(item.status).map(([, status]) => status === MigrateStatus.COMPLETE),
  )
  for (let i = 0; i < MIGRATION_STEPS.length; i++) {
    if (isComplete.filter((loFlag) => !loFlag[i]).length !== 0) {
      return i
    }
  }
  return MIGRATION_STEPS.length - 1
}

/**
 * Helper function to filter out migrate LPs that dont have a corresponding farm
 * @param farms List of ApeSwap farms
 * @param migrateLps List of Migrate LPs that will be filtered and returned
 * @param chainId Current chain id the user is on
 */
export const filterCurrentFarms = (farms: Farm[], migrateLps: MigrateResult[], chainId: number) => {
  const filteredLps = migrateLps?.filter((lp) => {
    return farms?.find(
      (farm) =>
        (farm.tokenAddresses[chainId].toLowerCase() === lp.token0.address.toLowerCase() ||
          farm.tokenAddresses[chainId].toLowerCase() === lp.token1.address.toLowerCase()) &&
        (farm.quoteTokenAdresses[chainId].toLowerCase() === lp.token0.address.toLowerCase() ||
          farm.quoteTokenAdresses[chainId].toLowerCase() === lp.token1.address.toLowerCase()),
    )
  })
  return filteredLps
}

/**
 * Helper callback to change the previous LP status id with a new one
 * @param lpStatus List of Migrate LP Status
 * @param setLpStatus Action to set Migrate LP Status state
 */
export const useUpdateStatusId = (
  lpStatus: MigrateLpStatus[],
  setLpStatus: React.Dispatch<React.SetStateAction<MigrateLpStatus[]>>,
) => {
  const updateStatusId = useCallback(
    (id: number, newId: number) => {
      const updatedMigrateLpStatus = lpStatus
      const lpToUpdateIndex = lpStatus.findIndex((migrateLp) => migrateLp.id === id)
      const lpToUpdate = {
        ...lpStatus[lpToUpdateIndex],
        id: newId,
      }
      updatedMigrateLpStatus[lpToUpdateIndex] = lpToUpdate
      setLpStatus([...updatedMigrateLpStatus])
    },
    [setLpStatus, lpStatus],
  )
  return updateStatusId
}

/**
 * Helper callback to check if a farm is already approved and set the correct LP status
 * @param lpStatus List of Migrate LP Status
 * @param setLpStatus Action to set Migrate LP Status state
 */
export const useUpdateApproveStakeStatus = (
  lpStatus: MigrateLpStatus[],
  setLpStatus: React.Dispatch<React.SetStateAction<MigrateLpStatus[]>>,
) => {
  const farms = useFarms(null)
  const { chainId } = useActiveWeb3React()
  const updateApproveStakeStatus = useCallback(
    (apeswapLp: ApeswapWalletLpInterface) => {
      const updatedMigrateLpStatus = lpStatus
      const { pair, id } = apeswapLp
      const matchedFarm = farms.find(
        (farm) => farm.lpAddresses[chainId].toLowerCase() === pair.liquidityToken.address.toLowerCase(),
      )
      const lpToUpdateIndex = lpStatus.findIndex((migrateLp) => migrateLp.id === id)
      const lpToUpdate = {
        ...lpStatus[lpToUpdateIndex],
        status: {
          ...lpStatus[lpToUpdateIndex].status,
          approveStake: new BigNumber(matchedFarm?.userData?.allowance).gt(0)
            ? MigrateStatus.COMPLETE
            : MigrateStatus.INCOMPLETE,
        },
      }
      updatedMigrateLpStatus[lpToUpdateIndex] = lpToUpdate
      setLpStatus([...updatedMigrateLpStatus])
    },
    [setLpStatus, lpStatus, farms, chainId],
  )
  return updateApproveStakeStatus
}
