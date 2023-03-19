import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import {
  fetchFarmV2UserEarnings,
  fetchFarmV2UserAllowances,
  fetchFarmV2UserTokenBalances,
  fetchFarmV2UserStakedBalances,
} from './fetchFarmV2User'
import { Farm, LpTokenPrices, FarmLpAprsType, AppThunk, FarmsV2State } from '../types'
import { farmsV2 } from '@ape.swap/apeswap-lists'
import fetchFarmsV2 from './fetchFarmsV2'

const initialState: FarmsV2State = {
  data: farmsV2,
}

export const farmsSlice = createSlice({
  name: 'FarmsV2',
  initialState,
  reducers: {
    setFarmsV2PublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmV2UserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
    updateFarmV2UserData: (state, action) => {
      const { field, value, pid } = action.payload
      const index = state.data.findIndex((p) => p.pid === pid)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setFarmsV2PublicData, setFarmV2UserData, updateFarmV2UserData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync =
  (chainId: number, lpPrices: LpTokenPrices[], bananaPrice: BigNumber, farmLpAprs: FarmLpAprsType): AppThunk =>
  async (dispatch, getState) => {
    try {
      const farmsConfig = getState().farmsV2.data
      const farms = await fetchFarmsV2(chainId, lpPrices, bananaPrice, farmLpAprs, farmsConfig)
      dispatch(setFarmsV2PublicData(farms))
    } catch (error) {
      console.warn(error)
    }
  }
export const fetchFarmV2UserDataAsync =
  (chainId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const farms = getState().farmsV2.data
      const userFarmAllowances = await fetchFarmV2UserAllowances(chainId, account, farms)
      const userFarmTokenBalances = await fetchFarmV2UserTokenBalances(chainId, account, farms)
      const userStakedBalances = await fetchFarmV2UserStakedBalances(chainId, account, farms)
      const userFarmEarnings = await fetchFarmV2UserEarnings(chainId, account, farms)

      const arrayOfUserDataObjects = farms.map(({ pid }, index) => {
        return {
          index,
          allowance: userFarmAllowances[pid],
          tokenBalance: userFarmTokenBalances[pid],
          stakedBalance: userStakedBalances[pid],
          earnings: userFarmEarnings[pid],
        }
      })
      dispatch(setFarmV2UserData({ arrayOfUserDataObjects }))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateFarmV2UserAllowances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farmsV2.data
    const allowances = await fetchFarmV2UserAllowances(chainId, account, farms)
    dispatch(updateFarmV2UserData({ field: 'allowance', value: allowances[pid], pid }))
  }

export const updateFarmV2UserTokenBalances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farmsV2.data
    const tokenBalances = await fetchFarmV2UserTokenBalances(chainId, account, farms)
    dispatch(updateFarmV2UserData({ field: 'tokenBalance', value: tokenBalances[pid], pid }))
  }

export const updateFarmV2UserStakedBalances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farmsV2.data
    const stakedBalances = await fetchFarmV2UserStakedBalances(chainId, account, farms)
    dispatch(updateFarmV2UserData({ field: 'stakedBalance', value: stakedBalances[pid], pid }))
  }

export const updateFarmV2UserEarnings =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farmsV2.data
    const pendingRewards = await fetchFarmV2UserEarnings(chainId, account, farms)
    dispatch(updateFarmV2UserData({ field: 'earnings', value: pendingRewards[pid], pid }))
  }

export default farmsSlice.reducer
