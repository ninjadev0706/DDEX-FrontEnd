import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { MigrateResult, useMigratorBalances } from 'state/zapMigrator/hooks'
import { activeIndexHelper, filterCurrentFarms, setMigrateLpStatus } from './utils'
import { useFarms } from 'state/farms/hooks'
import { useVaults } from 'state/vaults/hooks'
import {
  useHandleAddMigrationCompleteLog,
  useHandleMaximizerApprovalToggle,
  useHandleUpdateMigrateLp,
  useHandleUpdateMigratorResults,
  useHandleUpdateOfApeswapLpBalance,
  useLpBalances,
} from './hooks'
import {
  ApeswapWalletLpInterface,
  MigrateLpStatus,
  MigrateProviderProps,
  MigrateContextData,
  MigrationCompleteLog,
} from './types'
import track from 'utils/track'

const MigrateContext = createContext<MigrateContextData>({} as MigrateContextData)

/* eslint-disable react-hooks/exhaustive-deps */
export function MigrateProvider({ children }: MigrateProviderProps) {
  // Initial states

  const [migrationLoading, setMigrationLoading] = useState<boolean>(true)
  const [migrateMaximizers, setMigrateMaximizers] = useState<boolean>(false)
  const [migrateWalletBalances, setMigrateWalletBalances] = useState<MigrateResult[]>([])
  const [migrateStakedBalances, setMigrateStakedBalances] = useState<MigrateResult[]>([])
  const [apeswapLpBalances, setApeswapLpBalances] = useState<ApeswapWalletLpInterface[]>([])
  const [migrationCompleteLog, setMigrationCompleteLog] = useState<MigrationCompleteLog[]>([])
  const [lpStatus, setLpStatus] = useState<MigrateLpStatus[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [timeReady, setTimeReady] = useState<boolean>(false)

  // Helpful hooks used

  const timer = useRef(null)
  const { account, chainId } = useActiveWeb3React()
  const { results: migrateLpBalances, syncing, loading, valid } = useMigratorBalances(1)
  const { allPairs: liquidityTokens, pairAndBalances: userApeswapLpBalances, apeBalancesLoading } = useLpBalances()
  const farms = useFarms(account)
  const { vaults: fetchedVaults } = useVaults()

  // Value filters and needed variables

  // Since each vault needs a farm we can filter by just farms
  const filteredLpsForStake = apeswapLpBalances?.filter((lp) =>
    farms?.find((farm) => lp.pair.liquidityToken.address.toLowerCase() === farm.lpAddresses[chainId].toLowerCase()),
  )
  // Filter out innactive vaults and farms
  const vaults = fetchedVaults.filter((vault) => !vault.inactive)
  // There is an edgecase of multiple protocols with the same LP that need to be migrated which causes duplicate entries.
  // If a duplicate is identified we filter it out
  // We wont need this for migrationV2
  const duplicateStatusIds = new Set(lpStatus.map(({ id }) => id)).size !== lpStatus.length
  // Flag to run a hook when finished loading
  const farmAndVaultUserDataLoaded = farms?.[0]?.userData !== undefined && vaults?.[0]?.userData !== undefined

  // Callbacks that are used on user actions

  const handleUpdateOfApeswapLpBalance = useHandleUpdateOfApeswapLpBalance(
    apeswapLpBalances,
    lpStatus,
    liquidityTokens,
    setLpStatus,
    setApeswapLpBalances,
  )
  const handleMaximizerApprovalToggle = useHandleMaximizerApprovalToggle(
    farms,
    vaults,
    lpStatus,
    setLpStatus,
    setMigrateMaximizers,
  )
  const handleUpdateMigratorResults = useHandleUpdateMigratorResults(
    farms,
    migrateLpBalances,
    setMigrateWalletBalances,
    setMigrateStakedBalances,
  )
  const handleUpdateMigrateLp = useHandleUpdateMigrateLp(lpStatus, setLpStatus)
  const handleAddMigrationCompleteLog = useHandleAddMigrationCompleteLog(setMigrationCompleteLog)
  const handleActiveIndexCallback = useCallback((activeIndex: number) => setActiveIndex(activeIndex), [])

  // On load and value change hooks

  // If there is a duplicate filter it out
  useMemo(() => {
    setLpStatus([...[...new Map(lpStatus.map((v) => [v.id, v])).values()]])
  }, [duplicateStatusIds, setLpStatus])

  // Set the initial migrate lp states
  useMemo(() => {
    const filterMigrateLps = filterCurrentFarms(farms, migrateLpBalances, chainId)
    setMigrateWalletBalances(filterMigrateLps?.filter((bal) => parseFloat(bal.walletBalance) > 0.0))
    setMigrateStakedBalances(filterMigrateLps?.filter((bal) => parseFloat(bal.stakedBalance) > 0.0))
  }, [migrateLpBalances.length, loading, chainId, farms.length, syncing])

  // Set the initial apeswap lp state
  useMemo(() => {
    setApeswapLpBalances(userApeswapLpBalances)
  }, [userApeswapLpBalances.length])

  // Monitor is status change for active index
  useMemo(() => {
    const newActiveIndex = activeIndexHelper(lpStatus)
    if (newActiveIndex !== activeIndex && !migrationLoading) {
      track({
        event: 'migrate_liq',
        chain: chainId,
        data: {
          cat: newActiveIndex,
        },
      })
    }
    setActiveIndex(newActiveIndex)
  }, [lpStatus])

  // Set the initial status for each LP
  useEffect(() => {
    setMigrateLpStatus(
      [...migrateWalletBalances, ...migrateStakedBalances],
      filteredLpsForStake,
      farms,
      vaults,
      migrateMaximizers,
      setLpStatus,
      account,
      chainId,
    )
  }, [valid, apeBalancesLoading, account, setLpStatus, farmAndVaultUserDataLoaded, chainId])

  // Migration loading logic

  timer.current = setTimeout(() => {
    setTimeReady(true)
  }, 4000)

  if (!loading && !apeBalancesLoading && valid && liquidityTokens.length > 0 && timeReady) {
    if (migrationLoading) {
      setMigrationLoading(false)
    }
  }

  return (
    <MigrateContext.Provider
      value={{
        activeIndex,
        migrateMaximizers,
        migrateWalletLps: migrateWalletBalances,
        migrateStakeLps: migrateStakedBalances,
        apeswapWalletLps: apeswapLpBalances,
        migrateLpStatus: lpStatus,
        migrationCompleteLog,
        migrationLoading,
        handleActiveIndexCallback,
        handleUpdateMigrateLp,
        handleUpdateMigratorResults,
        handleUpdateOfApeswapLpBalance,
        handleMaximizerApprovalToggle,
        handleAddMigrationCompleteLog,
      }}
    >
      {children}
    </MigrateContext.Provider>
  )
}

export function useMigrateAll() {
  const context = useContext(MigrateContext)
  return context
}
