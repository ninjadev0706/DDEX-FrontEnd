/* eslint-disable no-param-reassign */
import { ChainId } from '@ape.swap/sdk'
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { AppThunk } from 'state/types'
import { MasterApeMigrationInterface, MigrateStatus } from './types'
import { getInitialMigrateLpStatus, mergeV1Products, mergeV2Products } from './utils'
// import { MigrationPhases, MigrationTimerState } from './types'

const initialState: MasterApeMigrationInterface = {
  migrationLoading: { userDataLoaded: false, mergedMigrationLoaded: false, allDataLoaded: false },
  activeIndex: 0,
  v1Products: [],
  v2Products: [],
  migrateLpStatus: [],
  migrationCompleteLog: [],
  transactions: [],
  migrateMaximizers: false,
}

export const masterApeMigrationSlice = createSlice({
  name: 'masterApeMigration',
  initialState,
  reducers: {
    setMigrationLoading: (state, action) => {
      state.migrationLoading = { ...state.migrationLoading, ...action.payload }
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload
    },
    setV1Products: (state, action) => {
      state.v1Products = action.payload
    },
    setV2Products: (state, action) => {
      state.v2Products = action.payload
    },
    setMigrateLpStatus: (state, action) => {
      state.migrateLpStatus = action.payload
    },
    setMigrationCompletionLog: (state, action) => {
      state.migrationCompleteLog = action.payload
    },
    setMigrateMaximizers: (state, action) => {
      state.migrateMaximizers = action.payload
    },
    setAddTransactions: (state, action) => {
      state.transactions = [...state.transactions, action.payload]
    },
    setRemoveTransactions: (state, action) => {
      const newTransactionList = state.transactions.filter((tx) => tx.id !== action.payload)
      state.transactions = newTransactionList
    },
    setAddCompletionLog: (state, action) => {
      state.migrationCompleteLog = [...state.migrationCompleteLog, action.payload]
    },
    setToggleMaximizer: (state, action) => {
      state.migrateMaximizers = !action.payload
    },
  },
})

// Actions
export const {
  setMigrationLoading,
  setActiveIndex,
  setV1Products,
  setV2Products,
  setMigrateLpStatus,
  setMigrationCompletionLog,
  setMigrateMaximizers,
  setAddTransactions,
  setRemoveTransactions,
  setAddCompletionLog,
  setToggleMaximizer,
} = masterApeMigrationSlice.actions

// Thunks
export const fetchV1Products =
  (chainId: ChainId): AppThunk =>
  (dispatch, getState) => {
    try {
      const farms = getState().farms.data
      const vaults = getState().vaults.data
      const farmsV2 = getState().farmsV2.data
      const v1Products = mergeV1Products(farms, farmsV2, vaults, chainId)
      dispatch(setV1Products(v1Products))
      dispatch(setMigrationLoading({ mergedMigrationLoaded: true }))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchV2Products =
  (chainId: ChainId): AppThunk =>
  (dispatch, getState) => {
    try {
      const vaultsV3 = getState().vaultsV3.data
      const farmsV2 = getState().farmsV2.data
      const farmsV1 = getState().farms.data
      const v2Products = mergeV2Products(farmsV1, farmsV2, vaultsV3, chainId)
      dispatch(setV2Products(v2Products))
      dispatch(setMigrationLoading({ mergedMigrationLoaded: true }))
    } catch (error) {
      console.warn(error)
    }
  }

export const setInitializeMigrateStatus =
  (chainId: number, migrateMaximizers: boolean): AppThunk =>
  (dispatch, getState) => {
    try {
      const { v1Products, v2Products } = getState().masterApeMigration
      const farmsV2 = getState().farms.data
      const mergedLpStatus = getInitialMigrateLpStatus(v1Products, v2Products, farmsV2, migrateMaximizers, chainId)
      dispatch(setMigrateLpStatus(mergedLpStatus))
      dispatch(setMigrationLoading({ allDataLoaded: true }))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateMigrateStatus =
  (id: string, type: 'unstake' | 'approveStake' | 'stake', status: MigrateStatus, statusText: string): AppThunk =>
  (dispatch, getState) => {
    try {
      const { migrateLpStatus } = getState().masterApeMigration
      // const updatedMigrateLpStatus = migrateStatus
      const lpToUpdateIndex = migrateLpStatus.findIndex((migrateLp) => migrateLp.id === id)
      const lpToUpdate = {
        ...migrateLpStatus[lpToUpdateIndex],
        status: { ...migrateLpStatus[lpToUpdateIndex].status, [type]: status },
        statusText: statusText,
      }
      const updatedMigrateLpStatus = migrateLpStatus.map((status, i) => {
        if (i === lpToUpdateIndex) {
          return lpToUpdate
        }
        return status
      })
      dispatch(setMigrateLpStatus(updatedMigrateLpStatus))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateAndMergeStatus =
  (
    chainId: ChainId,
    id: string,
    lp: string,
    type: 'unstake' | 'approveStake' | 'stake',
    status: MigrateStatus,
    statusText: string,
  ): AppThunk =>
  (dispatch, getState) => {
    try {
      const farmsV2 = getState().farmsV2.data
      const vaultsV3 = getState().vaultsV3.data
      const { migrateLpStatus, migrateMaximizers } = getState().masterApeMigration
      const allowance = migrateMaximizers
        ? vaultsV3.find((vault) => vault.stakeToken.address[chainId].toLowerCase() === lp)?.userData.allowance
        : farmsV2.find((farm) => farm.lpAddresses[chainId].toLowerCase() === lp)?.userData.allowance
      const lpToUpdateIndex = migrateLpStatus.findIndex((migrateLp) => migrateLp.id === id)
      const lpToUpdate = {
        ...migrateLpStatus[lpToUpdateIndex],
        id: lp,
        status: {
          ...migrateLpStatus[lpToUpdateIndex].status,
          [type]: status,
          approveStake: new BigNumber(allowance).gt(0) ? MigrateStatus.COMPLETE : MigrateStatus.INCOMPLETE,
        },
        statusText: statusText,
      }
      const updatedMigrateLpStatus = migrateLpStatus.map((status, i) => {
        if (i === lpToUpdateIndex) {
          return lpToUpdate
        }
        return status
      })
      const mergedStatus = [...new Map(updatedMigrateLpStatus.map((item) => [item.id, item])).values()]
      dispatch(setMigrateLpStatus(mergedStatus))
    } catch (error) {
      console.warn(error)
    }
  }

export default masterApeMigrationSlice.reducer
