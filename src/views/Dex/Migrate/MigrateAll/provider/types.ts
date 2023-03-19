import { Pair, TokenAmount } from '@ape.swap/sdk'
import { ReactNode } from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'

export interface MigrateContextData {
  activeIndex: number
  handleActiveIndexCallback: (activeIndex: number) => void
  handleMaximizerApprovalToggle: (apeswapLps: ApeswapWalletLpInterface[], migrateMaximizers: boolean) => void
  handleAddMigrationCompleteLog: (migrationLog: MigrationCompleteLog) => void
  handleUpdateMigratorResults: () => void
  handleUpdateOfApeswapLpBalance: (id: number, token0: string, token1: string) => void
  handleUpdateMigrateLp: (
    id: number,
    type: 'unstake' | 'approveMigrate' | 'migrate' | 'approveStake' | 'stake',
    status: MigrateStatus,
    statusText?: string,
  ) => void
  migrateMaximizers: boolean
  migrateStakeLps: MigrateResult[]
  migrateWalletLps: MigrateResult[]
  apeswapWalletLps: ApeswapWalletLpInterface[]
  migrateLpStatus: MigrateLpStatus[]
  migrationCompleteLog: MigrationCompleteLog[]
  migrationLoading: boolean
}

export const enum MigrateStatus {
  PENDING = 'pending',
  INCOMPLETE = 'incomplete',
  COMPLETE = 'complete',
  INVALID = 'invalid',
}

export interface MigrateProviderProps {
  children: ReactNode
}

export interface MigrateLpStatus {
  id: number
  lpAddress: string
  status: {
    unstake: MigrateStatus
    approveMigrate: MigrateStatus
    migrate: MigrateStatus
    approveStake: MigrateStatus
    stake: MigrateStatus
  }
  statusText?: string
}

export interface ApeswapWalletLpInterface {
  id: number
  pair: Pair
  balance: TokenAmount
}

export interface MigrationCompleteLog {
  lpSymbol: string
  location: string
  stakeAmount: string
}
