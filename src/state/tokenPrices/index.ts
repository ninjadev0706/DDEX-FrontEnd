/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getTokenUsdPrice } from 'utils/getTokenUsdPrice'
import { getBananaAddress } from 'utils/addressHelper'
import fetchPrices from './fetchPrices'
import { TokenPricesState, TokenPrices, AppThunk } from '../types'
import { tokens } from '@ape.swap/apeswap-lists'

const initialState: TokenPricesState = {
  isTokensInitialized: false,
  isInitialized: false,
  isLoading: true,
  tokens: Object.values(tokens),
  bananaPrice: null,
  data: null,
}

export const tokenPricesSlice = createSlice({
  name: 'tokenPrices',
  initialState,
  reducers: {
    tokenPricesFetchStart: (state) => {
      state.isLoading = true
    },
    setBananaPrice: (state, action) => {
      state.bananaPrice = action.payload
      state.isInitialized = true
    },
    tokenPricesFetchSucceeded: (state, action: PayloadAction<TokenPrices[]>) => {
      state.data = action.payload
      state.isLoading = false
      state.isInitialized = true
    },
    tokenPricesFetchFailed: (state) => {
      state.isLoading = false
      state.isInitialized = true
    },
  },
})

// Actions
export const { setBananaPrice, tokenPricesFetchStart, tokenPricesFetchSucceeded, tokenPricesFetchFailed } =
  tokenPricesSlice.actions

export const fetchTokenPrices =
  (chainId, tokens): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(tokenPricesFetchStart())
      const tokenPrices = await fetchPrices(chainId, tokens)
      dispatch(tokenPricesFetchSucceeded(tokenPrices))
    } catch (error) {
      dispatch(tokenPricesFetchFailed())
    }
  }

export const fetchBananaPrice =
  (chainId): AppThunk =>
  async (dispatch) => {
    try {
      const bananaPrice = await getTokenUsdPrice(chainId, getBananaAddress(chainId), 18)
      dispatch(setBananaPrice(bananaPrice))
    } catch {}
  }

export default tokenPricesSlice.reducer
