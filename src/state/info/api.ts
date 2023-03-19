import {
  blocksQuery,
  graphQuery,
  nativePricesQuery,
  pairsQuery,
  tokenDaysDataQuery,
  tokensQuery,
  transactionsQuery,
  uniswapFactoriesQuery,
  daysDataQuery,
  pairDaysDataQuery,
} from './queries'
import { ChainId } from '@ape.swap/sdk'
import { INFO_PAGE_CHAIN_PARAMS } from 'config/constants/chains'
import axiosRetry from 'axios-retry'
import axios from 'axios'
import { Block, DaysData, NativePrice, Pairs, Token, TokenDaysData, Transactions } from './types'

export const getInfoPairs = async (
  chainId: ChainId,
  amount: number,
  block: string,
  token: string,
  pair: string,
): Promise<Pairs[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      graphAddress,
      JSON.stringify(pairsQuery(amount, block, token, pair)),
    )
    const { data } = responseData
    if (status === 500) {
      return []
    }
    if (token === '') {
      return data.pairs.map((x) => ({ ...x, chainId }))
    } else {
      return data.pairs.map((x) => ({ ...x, chainId })).concat(data.pairs1.map((x) => ({ ...x, chainId })))
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getTransactions = async (chainId: ChainId, amount: number, token: string): Promise<Transactions[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      graphAddress,
      JSON.stringify(transactionsQuery(amount, token)),
    )
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.transactions.map((x) => ({ ...x, chainId }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getNativePrices = async (chainId: ChainId): Promise<NativePrice> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(nativePricesQuery))
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.bundles.map((x) => ({ ...x, chainId }))[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getDaysData = async (chainId: ChainId, oneDayBack: number): Promise<DaysData[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(daysDataQuery(oneDayBack)))
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.uniswapDayDatas
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getBlocks = async (chainId: ChainId, startTimestamp: number, currentTimestamp: number): Promise<Block> => {
  const { blockGraph } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      blockGraph,
      JSON.stringify(blocksQuery(startTimestamp, currentTimestamp)),
    )
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.blocks[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getChartData = async (chainId: ChainId, amount: number): Promise<any> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(graphQuery(amount)))
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.uniswapDayDatas.map((x) => ({ ...x, chainId }))
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getUniswapFactories = async (chainId: ChainId, block: string): Promise<any> => {
  const { graphAddress, id } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      graphAddress,
      JSON.stringify(uniswapFactoriesQuery(id, block)),
    )
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.uniswapFactories.map((x) => ({ ...x, chainId }))[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getTokens = async (chainId: ChainId, amount: number, block: string, token: string): Promise<Token[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      graphAddress,
      JSON.stringify(tokensQuery(amount, block, token)),
    )
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.tokens.map((x) => ({ ...x, chainId }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getTokenDaysData = async (chainId: ChainId, address: string, amount: number): Promise<TokenDaysData[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      graphAddress,
      JSON.stringify(tokenDaysDataQuery(address, amount)),
    )
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.tokenDayDatas.map((x) => ({ ...x, chainId }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getPairDaysData = async (chainId: ChainId, address: string, amount: number): Promise<TokenDaysData[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      graphAddress,
      JSON.stringify(pairDaysDataQuery(address, amount)),
    )
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.pairDayDatas.map((x) => ({ ...x, chainId }))
  } catch (error) {
    console.error(error)
    return []
  }
}
