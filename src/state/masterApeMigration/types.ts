import { Pair, TokenAmount } from '@ape.swap/sdk'
import { ReactNode } from 'react'

export interface MasterApeMigrationInterface {
  activeIndex: number
  migrateMaximizers: boolean
  v1Products: MasterApeProductsInterface[]
  v2Products: MasterApeV2ProductsInterface[]
  migrateLpStatus: MigrateLpStatus[]
  migrationCompleteLog: MigrationCompleteLog[]
  transactions: MigrateTransaction[]
  migrationLoading: {
    userDataLoaded: boolean
    mergedMigrationLoaded: boolean
    allDataLoaded: boolean
  }
}

export interface MigrateTransaction {
  hash: string
  id: string
  type: 'unstake' | 'approveStake' | 'stake'
  migrateLpType?: ProductTypes
  migrateLocation?: string
  lpAddress?: string
  v2FarmPid?: number
  v1FarmPid?: number
  v1VaultPid?: number
  v3VaultPid?: number
  statusText?: string
  lpValueUsd?: number
  lpAmount?: string
  lpSymbol?: string
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
  id: string
  lp: string
  status: {
    unstake: MigrateStatus
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

export enum ProductTypes {
  FARM = 'FARM',
  VAULT = 'VAULT',
  VAULT_V1 = 'VAULT_V1',
}

// Since LPs can be duplicate an ID is the product-lp combined
export interface MasterApeProductsInterface {
  id: string
  lp: string
  pid: number
  type: ProductTypes
  singleStakeAsset: boolean
  token0: { address: string; symbol: string }
  token1: { address: string; symbol: string }
  stakedAmount: string
  walletBalance: string
  allowance: string
  lpValueUsd: number
}

export interface V2Product {
  pid: number
  token0: { address: string; symbol: string }
  token1: { address: string; symbol: string }
  stakedAmount: string
  allowance: string
}

export interface MasterApeV2ProductsInterface {
  id: string
  lp: string
  singleStakeAsset: boolean
  walletBalance: string
  lpValueUsd: number
  farm: V2Product
  vault: V2Product | null
}
