/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { InfoState } from './types'
import {
  getInfoPairs,
  getBlocks,
  getDaysData,
  getNativePrices,
  getTokens,
  getTransactions,
  getUniswapFactories,
  getChartData,
  getTokenDaysData,
  getPairDaysData,
} from './api'
import { MAINNET_CHAINS_INFOPAGE } from 'config/constants/chains'
import { ChainId } from '@ape.swap/sdk'

const dataAsListInitialState = {} as Record<ChainId, { data: []; loading: boolean; initialized: boolean }>
const dataAsNullInitialState = {} as Record<ChainId, { data: null; loading: boolean; initialized: boolean }>
MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
  dataAsListInitialState[chainId] = { data: [], loading: false, initialized: false }
  dataAsNullInitialState[chainId] = { data: null, loading: false, initialized: false }
})

const initialState: InfoState = {
  pairs: dataAsListInitialState,
  transactions: dataAsListInitialState,
  nativePrice: dataAsNullInitialState,
  daysData: dataAsListInitialState,
  tokens: dataAsListInitialState,
  block: dataAsNullInitialState,
  currentDayFactories: dataAsNullInitialState,
  dayOldFactories: dataAsNullInitialState,
  chartData: dataAsNullInitialState,
  tokensDayOld: dataAsNullInitialState,
  tokenDaysData: dataAsNullInitialState,
  dayOldPairs: dataAsNullInitialState,
  pairDaysData: dataAsNullInitialState,
  activeChains: [ChainId.MAINNET, ChainId.TLOS, ChainId.BSC, ChainId.MATIC],
  favTokens: [],
  favPairs: [],
}
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setPairs: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.pairs[chainId] = { data, loading, initialized }
    },
    setTransactions: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.transactions[chainId] = { data, loading, initialized }
    },
    setNativePrice: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.nativePrice[chainId] = { data, loading, initialized }
    },
    setDaysData: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.daysData[chainId] = { data, loading, initialized }
    },
    setTokens: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.tokens[chainId] = { data, loading, initialized }
    },
    setBlock: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.block[chainId] = { data, loading, initialized }
    },
    setCurrentDayFactories: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.currentDayFactories[chainId] = { data, loading, initialized }
    },
    setDayOldFactories: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.dayOldFactories[chainId] = { data, loading, initialized }
    },
    setChartData: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.chartData[chainId] = { data, loading, initialized }
    },
    setDayOldTokens: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.tokensDayOld[chainId] = { data, loading, initialized }
    },
    setTokenDaysData: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.tokenDaysData[chainId] = { data, loading, initialized }
    },
    setPairDaysData: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.pairDaysData[chainId] = { data, loading, initialized }
    },
    setDayOldPairs: (state, action) => {
      const { data, chainId, loading, initialized } = action.payload
      state.dayOldPairs[chainId] = { data, loading, initialized }
    },
    setLoading: (state, action) => {
      const { stateType, chainId, loading } = action.payload
      state[stateType][chainId] = { ...state[stateType][chainId], loading }
    },
    setActiveChains: (state, action) => {
      if (action.payload !== null) {
        state.activeChains = action.payload
      }
    },
    setFavTokens: (state, action) => {
      if (action.payload !== null) {
        state.favTokens = action.payload
      }
    },
    setFavPairs: (state, action) => {
      if (action.payload !== null) {
        state.favPairs = action.payload
      }
    },
  },
})

// Actions
export const {
  setPairs,
  setTransactions,
  setNativePrice,
  setDaysData,
  setTokens,
  setBlock,
  setCurrentDayFactories,
  setDayOldFactories,
  setChartData,
  setDayOldTokens,
  setTokenDaysData,
  setPairDaysData,
  setDayOldPairs,
  setLoading,
  setActiveChains,
  setFavTokens,
  setFavPairs,
} = infoSlice.actions

// Thunks
export const fetchPairs =
  (chainId: ChainId, amount: number, block: string, token: string, pair: string) => async (dispatch) => {
    const data = await getInfoPairs(chainId, amount, block, token, pair)
    if (block === '0') {
      //Block 0 means current day data
      dispatch(setPairs({ data, chainId, loading: false, initialized: true }))
    } else {
      dispatch(setDayOldPairs({ data, chainId, loading: false, initialized: true }))
    }
  }

export const fetchTransactions = (chainId: ChainId, amount: number, token: string) => async (dispatch) => {
  const data = await getTransactions(chainId, amount, token)
  dispatch(setTransactions({ data, chainId, loading: false, initialized: true }))
}

export const fetchNativePrice = (chainId: ChainId) => async (dispatch) => {
  const data = await getNativePrices(chainId)
  dispatch(setNativePrice({ data, chainId, loading: false, initialized: true }))
}

export const fetchDaysData = (chainId: ChainId, oneDayBack: number) => async (dispatch) => {
  const data = await getDaysData(chainId, oneDayBack)
  dispatch(setDaysData({ data, chainId, loading: false, initialized: true }))
}

export const fetchTokens = (chainId: ChainId, amount: number, block: string, token: string) => async (dispatch) => {
  const data = await getTokens(chainId, amount, block, token)
  if (block === '0') {
    //Block 0 means current day data
    dispatch(setTokens({ data, chainId, loading: false, initialized: true }))
  } else {
    dispatch(setDayOldTokens({ data, chainId, loading: false, initialized: true }))
  }
}

export const fetchBlock = (chainId: ChainId, startTimestamp: number, currentTimestamp: number) => async (dispatch) => {
  const data = await getBlocks(chainId, startTimestamp, currentTimestamp)
  dispatch(setBlock({ data, chainId, loading: false, initialized: true }))
}

export const fetchUniswapFactories = (chainId: ChainId, block: string) => async (dispatch) => {
  const data = await getUniswapFactories(chainId, block)
  if (block === '0') {
    //Block 0 means current day data
    dispatch(setCurrentDayFactories({ data, chainId, loading: false, initialized: true }))
  } else {
    dispatch(setDayOldFactories({ data, chainId, loading: false, initialized: true }))
  }
}

export const fetchChartData = (chainId: ChainId, amount: number) => async (dispatch) => {
  const data = await getChartData(chainId, amount)
  dispatch(setChartData({ data, chainId, loading: false, initialized: true }))
}

export const fetchActiveChains = () => async (dispatch) => {
  const data = JSON.parse(localStorage.getItem('infoActiveChains'))
  dispatch(setActiveChains(data))
}

export const fetchFavTokens = () => async (dispatch) => {
  const data = JSON.parse(localStorage.getItem('infoFavTokens'))
  dispatch(setFavTokens(data))
}

export const fetchFavPairs = () => async (dispatch) => {
  const data = JSON.parse(localStorage.getItem('infoFavPairs'))
  dispatch(setFavPairs(data))
}

export const fetchTokenDaysData = (chainId: ChainId, address: string, amount: number) => async (dispatch) => {
  const data = await getTokenDaysData(chainId, address, amount)
  dispatch(setTokenDaysData({ data, chainId, loading: false, initialized: true }))
}

export const fetchPairDaysData = (chainId: ChainId, address: string, amount: number) => async (dispatch) => {
  const data = await getPairDaysData(chainId, address, amount)
  dispatch(setPairDaysData({ data, chainId, loading: false, initialized: true }))
}

export const updateActiveChains = (chainId: number, data: number[]) => (dispatch) => {
  let current = data.map((x) => x)

  if (current === null) {
    current = []
    for (let i = 0; i < MAINNET_CHAINS_INFOPAGE.length; i++) {
      if (MAINNET_CHAINS_INFOPAGE[i] !== chainId) {
        current.push(MAINNET_CHAINS_INFOPAGE[i])
      }
    }
  } else {
    const index = current.indexOf(chainId, 0)

    if (index > -1) {
      current.splice(index, 1)
      //If this makes active Chains = 0 then add all
      if (current.length === 0) current = MAINNET_CHAINS_INFOPAGE
    } else {
      current.push(chainId)
    }
  }

  localStorage.setItem('infoActiveChains', JSON.stringify(current))
  dispatch(setActiveChains(current))
}

export const updateFavTokens = (token: string, data: string[]) => (dispatch) => {
  let currentFavs = data.map((x) => x)
  if (currentFavs === null) currentFavs = []

  const index = currentFavs.indexOf(token, 0)
  if (index > -1) {
    currentFavs.splice(index, 1)
  } else {
    currentFavs.push(token)
  }

  localStorage.setItem('infoFavTokens', JSON.stringify(currentFavs))
  dispatch(setFavTokens(currentFavs))
}

export const updateFavPairs = (pair: string, data: string[]) => (dispatch) => {
  let currentFavs = data.map((x) => x)
  if (currentFavs === null) currentFavs = []

  const index = currentFavs.indexOf(pair, 0)
  if (index > -1) {
    currentFavs.splice(index, 1)
  } else {
    currentFavs.push(pair)
  }

  localStorage.setItem('infoFavPairs', JSON.stringify(currentFavs))
  dispatch(setFavPairs(currentFavs))
}

export default infoSlice.reducer
