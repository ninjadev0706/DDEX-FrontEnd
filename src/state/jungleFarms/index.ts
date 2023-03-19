import { createSlice } from '@reduxjs/toolkit'
import {
  fetchJungleFarmsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchJungleFarmUser'
import { JungleFarmsState, JungleFarm, TokenPrices, AppThunk } from '../types'
import fetchJungleFarms from './fetchJungleFarms'
import { ChainId } from '@ape.swap/sdk'
import { MAINNET_CHAINS } from 'config/constants/chains'
import { jungleFarms } from '@ape.swap/apeswap-lists'

const filterByChainId = (chainId: ChainId) => {
  return jungleFarms.filter(
    (farm) =>
      farm.contractAddress?.[chainId] !== '' &&
      farm.contractAddress?.[chainId] !== null &&
      farm.contractAddress?.[chainId] !== undefined,
  )
}

const initialJungleFarmState = {}

MAINNET_CHAINS.forEach((chainId: ChainId) => {
  initialJungleFarmState[chainId] = filterByChainId(chainId)
})

const initialState: JungleFarmsState = { data: initialJungleFarmState }

export const JungleFarmsSlice = createSlice({
  name: 'JungleFarms',
  initialState,
  reducers: {
    setJungleFarmsPublicData: (state, action) => {
      const { value: liveJungleFarmsData, chainId } = action.payload
      state.data[chainId] = state.data[chainId].map((farm) => {
        let liveFarmData: JungleFarm = liveJungleFarmsData.find((entry) => entry.jungleId === farm.jungleId)
        if (!liveFarmData?.rewardToken) {
          liveFarmData = null
        }
        return { ...farm, ...liveFarmData }
      })
    },
    setJungleFarmsUserData: (state, action) => {
      const { userData, chainId } = action.payload
      state.data[chainId] = state.data[chainId].map((farm) => {
        const userFarmData = userData.find((entry) => entry.jungleId === farm.jungleId)
        return { ...farm, userData: userFarmData }
      })
    },
    updateJungleFarmsUserData: (state, action) => {
      const { field, value, jungleId, chainId } = action.payload
      const index = state.data[chainId].findIndex((p) => p.jungleId === jungleId)
      state.data[chainId][index] = {
        ...state.data[chainId][index],
        userData: { ...state.data[chainId][index].userData, [field]: value },
      }
    },
  },
})

// Actions
export const { setJungleFarmsPublicData, setJungleFarmsUserData, updateJungleFarmsUserData } = JungleFarmsSlice.actions

// Thunks

export const fetchJungleFarmsPublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[]): AppThunk =>
  async (dispatch, getState) => {
    try {
      const jungleFarms = getState().jungleFarms.data[chainId]
      const farms = await fetchJungleFarms(chainId, tokenPrices, jungleFarms)
      if (farms !== undefined) {
        dispatch(setJungleFarmsPublicData({ value: farms, chainId }))
      }
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchJungleFarmsUserDataAsync =
  (chainId: number, account): AppThunk =>
  async (dispatch, getState) => {
    try {
      const jungleFarms = getState().jungleFarms.data[chainId]
      const allowances = await fetchJungleFarmsAllowance(chainId, account, jungleFarms)
      const stakingTokenBalances = await fetchUserBalances(chainId, account, jungleFarms)
      const stakedBalances = await fetchUserStakeBalances(chainId, account, jungleFarms)
      const pendingRewards = await fetchUserPendingRewards(chainId, account, jungleFarms)
      const userData = jungleFarms.map((farm) => ({
        jungleId: farm.jungleId,
        allowance: allowances[farm.jungleId],
        stakingTokenBalance: stakingTokenBalances[farm.jungleId],
        stakedBalance: stakedBalances[farm.jungleId],
        pendingReward: pendingRewards[farm.jungleId],
      }))
      dispatch(setJungleFarmsUserData({ userData, chainId }))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateJungleFarmsUserAllowance =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data[chainId]
    const allowances = await fetchJungleFarmsAllowance(chainId, account, jungleFarms)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'allowance', value: allowances[jungleId], chainId }))
  }

export const updateJungleFarmsUserBalance =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data[chainId]
    const tokenBalances = await fetchUserBalances(chainId, account, jungleFarms)
    dispatch(
      updateJungleFarmsUserData({ jungleId, field: 'stakingTokenBalance', value: tokenBalances[jungleId], chainId }),
    )
  }

export const updateJungleFarmsUserStakedBalance =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data[chainId]
    const stakedBalances = await fetchUserStakeBalances(chainId, account, jungleFarms)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'stakedBalance', value: stakedBalances[jungleId], chainId }))
  }

export const updateJungleFarmsUserPendingReward =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data[chainId]
    const pendingRewards = await fetchUserPendingRewards(chainId, account, jungleFarms)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'pendingReward', value: pendingRewards[jungleId], chainId }))
  }

export default JungleFarmsSlice.reducer
