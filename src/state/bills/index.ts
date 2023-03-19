import { createSlice } from '@reduxjs/toolkit'
import {
  fetchBillsAllowance,
  fetchUserBalances,
  fetchUserOwnedBills,
  fetchUserOwnedBillNftData,
} from './fetchBillsUser'
import { TokenPrices, AppThunk, BillsState } from '../types'
import fetchBills from './fetchBills'
import { getNewBillNftData } from './getBillNftData'
import { bills } from '@ape.swap/apeswap-lists'
import { ChainId } from '@ape.swap/sdk'
import { MAINNET_CHAINS } from 'config/constants/chains'

const filterByChainId = (chainId: ChainId) => {
  return bills.filter(
    (bill) =>
      bill.contractAddress?.[chainId] !== '' &&
      bill.contractAddress?.[chainId] !== null &&
      bill.contractAddress?.[chainId] !== undefined,
  )
}

const initialBillsState = {}
MAINNET_CHAINS.forEach((chainId: ChainId) => {
  initialBillsState[chainId] = filterByChainId(chainId)
})

const initialState: BillsState = {
  data: initialBillsState,
}

export const billsSlice = createSlice({
  name: 'Bills',
  initialState,
  reducers: {
    setBillsPublicData: (state, action) => {
      const { value: liveBillsData, chainId } = action.payload
      state.data[chainId] = state.data[chainId].map((bill) => {
        const liveBillData = liveBillsData.find((entry) => entry.index === bill.index)
        return { ...bill, ...liveBillData }
      })
    },
    setBillsUserData: (state, action) => {
      const { value: userData, chainId } = action.payload
      state.data[chainId] = state.data[chainId].map((bill) => {
        const userBillData = userData.find((entry) => entry.index === bill.index)
        return { ...bill, userData: userBillData }
      })
    },
    setUserOwnedBillsData: (state, action) => {
      const { value: userData, chainId } = action.payload
      state.data[chainId] = state.data[chainId].map((bill) => {
        const userOwnedBillsData = userData.find((entry) => entry.index === bill.index)
        return { ...bill, userOwnedBillsData: userOwnedBillsData?.userOwnedBills }
      })
    },
    setUserOwnedBillsNftData: (state, action) => {
      const { value: userData, chainId } = action.payload
      state.data[chainId] = state.data[chainId].map((bill) => {
        const userOwnedBillsNftData = userData.find((entry) => entry.index === bill.index)
        return { ...bill, userOwnedBillsNftData: userOwnedBillsNftData?.userOwnedBillsNfts }
      })
    },
    updateBillsUserData: (state, action) => {
      const { field, value, index, chainId } = action.payload
      const i = state.data[chainId].findIndex((bill) => bill.index === index)
      state.data[chainId][i] = {
        ...state.data[chainId][i],
        userData: { ...state.data[chainId][i].userData, [field]: value },
      }
    },
    updateBillsUserNftData: (state, action) => {
      const { value, index, chainId } = action.payload
      const i = state.data[chainId].findIndex((bill) => bill.index === index)
      state.data[chainId][i] = {
        ...state.data[chainId][i],
        userOwnedBillsNftData: { ...state.data[chainId][i].userOwnedBillsNftData, ...value },
      }
    },
  },
})

// Actions
export const {
  setBillsPublicData,
  setBillsUserData,
  setUserOwnedBillsData,
  setUserOwnedBillsNftData,
  updateBillsUserData,
} = billsSlice.actions

// Thunks

// TODO: When swapping between chain the state will reset sometimes when the multicall fetch is null
export const fetchBillsPublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[]): AppThunk =>
  async (dispatch, getState) => {
    try {
      const bills = getState().bills.data[chainId]
      const returnedBills = await fetchBills(chainId, tokenPrices, bills)
      dispatch(setBillsPublicData({ value: returnedBills, chainId }))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchBillsUserDataAsync =
  (chainId: number, account): AppThunk =>
  async (dispatch, getState) => {
    try {
      const bills = getState().bills.data[chainId]
      // fetch and set user bill interaction data
      const allowances = await fetchBillsAllowance(chainId, account, bills)
      const stakingTokenBalances = await fetchUserBalances(chainId, account, bills)
      const userData = bills.map((bill) => ({
        index: bill.index,
        allowance: allowances[bill.index],
        stakingTokenBalance: stakingTokenBalances[bill.index],
      }))
      dispatch(setBillsUserData({ value: userData, chainId }))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchUserOwnedBillsDataAsync =
  (chainId: number, account): AppThunk =>
  async (dispatch, getState) => {
    try {
      const bills = getState().bills.data[chainId]
      // Fetch and set user owned bill data without NFT Data
      const userOwnedBills = await fetchUserOwnedBills(chainId, account, bills)
      const mapUserOwnedBills = bills.map((bill) =>
        userOwnedBills.filter((b) => b.address === bill.contractAddress[chainId]),
      )
      const userOwnedBillsData = bills.map((bill, i) => ({
        index: bill.index,
        userOwnedBills: mapUserOwnedBills[i],
      }))
      dispatch(setUserOwnedBillsData({ value: userOwnedBillsData, chainId }))

      // Fetch owned bill NFT data
      const ownedBillsData = mapUserOwnedBills.flatMap((bs) => {
        return bs.map((b) => {
          return { id: b.id, billNftAddress: b.billNftAddress }
        })
      })
      const userBillNftData = await fetchUserOwnedBillNftData(ownedBillsData, chainId)
      const ownedBillsWithNftData = mapUserOwnedBills.map((bs, index) => {
        return {
          index: bills[index].index,
          userOwnedBillsNfts: [
            ...bs.map((b) => {
              return userBillNftData.find((nftB) => parseInt(nftB.id) === parseInt(b.id))?.data
            }),
          ],
        }
      })
      dispatch(setUserOwnedBillsNftData({ value: ownedBillsWithNftData, chainId }))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateUserAllowance =
  (chainId: number, index: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const bills = getState().bills.data[chainId]
    const allowances = await fetchBillsAllowance(chainId, account, bills)
    dispatch(updateBillsUserData({ index, field: 'allowance', value: allowances[index], chainId }))
  }

export const updateUserBalance =
  (chainId: number, index: string, account: string): AppThunk =>
  async (dispatch, getState) => {
    const bills = getState().bills.data[chainId]
    const tokenBalances = await fetchUserBalances(chainId, account, bills)
    dispatch(updateBillsUserData({ index, field: 'stakingTokenBalance', value: tokenBalances[index], chainId }))
  }

/**
 * @deprecated since multiple NFT contracts
 */
export const updateUserNftData =
  (index: number, billNftId: string, transactionHash: string, chainId: number): AppThunk =>
  async (dispatch) => {
    const fetchedBillNftData = await getNewBillNftData(billNftId, transactionHash, chainId)
    dispatch(updateBillsUserData({ index, value: fetchedBillNftData, chainId }))
  }

export default billsSlice.reducer
