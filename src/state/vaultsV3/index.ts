/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import {
  fetchVaultUserAllowances,
  fetchVaultUserStakedAndPendingBalances,
  fetchVaultUserTokenBalances,
} from './fetchVaultsV3User'
import { VaultsState, TokenPrices, Vault, FarmLpAprsType, AppThunk } from '../types'
import fetchVaultsV3 from './fetchVaultsV3'
import { vaultsV3 } from '@ape.swap/apeswap-lists'

const initialState: VaultsState = { data: vaultsV3, loadVaultData: false, userDataLoaded: false }

export const vaultSlice = createSlice({
  name: 'VaultsV3',
  initialState,
  reducers: {
    setLoadVaultV3Data: (state, action) => {
      const liveVaultsData: Vault[] = action.payload
      state.data = state.data.map((vault) => {
        const liveVaultData = liveVaultsData.find((entry) => entry.id === vault.id)
        return { ...vault, ...liveVaultData }
      })
    },
    setVaultV3UserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((vault) => {
        const userVaultData = userData.find((entry) => entry.id === vault.id)
        return { ...vault, userData: userVaultData }
      })
    },
    updateVaultsV3UserData: (state, action) => {
      const { field, value, id } = action.payload
      const index = state.data.findIndex((v) => v.id === id)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index]?.userData, [field]: value } }
    },

    setVaultsV3Load: (state, action) => {
      state.loadVaultData = action.payload
    },
  },
})

// thunks
export const fetchVaultsV3PublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[], farmLpAprs: FarmLpAprsType): AppThunk =>
  async (dispatch, getState) => {
    try {
      const vaultsConfig = getState().vaultsV3.data
      const vaults = await fetchVaultsV3(chainId, tokenPrices, farmLpAprs, vaultsConfig)
      dispatch(setLoadVaultV3Data(vaults))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchVaultV3UserDataAsync =
  (account: string, chainId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const vaults = getState().vaultsV3.data
      const filteredVaults = vaults.filter((vault) => vault.availableChains.includes(chainId))
      const userVaultAllowances = await fetchVaultUserAllowances(account, chainId, vaults)
      const userVaultTokenBalances = await fetchVaultUserTokenBalances(account, chainId, vaults)
      const userVaultBalances = await fetchVaultUserStakedAndPendingBalances(account, chainId, vaults)
      const userData = filteredVaults.map(({ pid, id }) => {
        return {
          id: id,
          allowance: userVaultAllowances[pid],
          tokenBalance: userVaultTokenBalances[pid],
          stakedBalance: userVaultBalances.stakedBalances[pid],
          pendingRewards: userVaultBalances.pendingRewards[pid],
        }
      })
      dispatch(setVaultV3UserData(userData))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateVaultV3UserAllowance =
  (account: string, chainId: number, pid: number): AppThunk =>
  async (dispatch, getState) => {
    const vaults = getState().vaultsV3.data
    const allowances = await fetchVaultUserAllowances(account, chainId, vaults)
    dispatch(updateVaultsV3UserData({ pid, field: 'allowance', value: allowances[pid] }))
  }

export const updateVaultV3UserBalance =
  (account: string, chainId: number, pid: number): AppThunk =>
  async (dispatch, getState) => {
    const vaults = getState().vaultsV3.data
    const tokenBalances = await fetchVaultUserTokenBalances(account, chainId, vaults)
    dispatch(updateVaultsV3UserData({ pid, field: 'tokenBalance', value: tokenBalances[pid] }))
  }

export const updateVaultV3UserStakedBalance =
  (account: string, chainId: number, pid: number): AppThunk =>
  async (dispatch, getState) => {
    const vaults = getState().vaultsV3.data
    const stakedBalances = await fetchVaultUserStakedAndPendingBalances(account, chainId, vaults)
    dispatch(updateVaultsV3UserData({ pid, field: 'stakedBalance', value: stakedBalances.stakedBalances[pid] }))
  }

// Actions
export const { setLoadVaultV3Data, setVaultV3UserData, setVaultsV3Load, updateVaultsV3UserData } = vaultSlice.actions

export default vaultSlice.reducer
