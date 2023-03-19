import { MAINNET_CHAINS_INFOPAGE } from 'config/constants/chains'
import useRefresh from 'hooks/useRefresh'
import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { State } from 'state/types'
import {
  fetchActiveChains,
  fetchBlock,
  fetchChartData,
  fetchDaysData,
  fetchNativePrice,
  fetchPairs,
  fetchTokenDaysData,
  fetchTokens,
  fetchTransactions,
  fetchUniswapFactories,
  setLoading,
  updateActiveChains,
  fetchPairDaysData,
  fetchFavTokens,
  updateFavTokens,
  fetchFavPairs,
  updateFavPairs,
} from '.'
import { InfoStateTypes } from './types'

export const useFetchInfoPairs = (amount: number, days: number, token = '', pair = '', chain?: number) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const blocks = useSelector((state: State) => state.info.block)

  useEffect(() => {
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      if (chain && chainId !== chain) {
        return
      }
      if (days === 0) {
        dispatch(setLoading({ stateType: InfoStateTypes.PAIRS, chainId, loading: true }))
      } else {
        dispatch(setLoading({ stateType: InfoStateTypes.DAYOLDPAIRS, chainId, loading: true }))
      }

      if (blocks[chainId].initialized) {
        dispatch(fetchPairs(chainId, amount, days === 0 ? '0' : blocks[chainId].data?.number, token, pair))
      }
    })
  }, [slowRefresh, amount, blocks, days, token, pair, chain, dispatch])

  return useSelector((state: State) => (days === 0 ? state.info.pairs : state.info.dayOldPairs))
}

export const useFetchInfoTransactions = (amount: number, token = '', chain?: number) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      if (chain && chainId !== chain) {
        return
      }
      dispatch(setLoading({ stateType: InfoStateTypes.TRANSACTIONS, chainId, loading: true }))
      dispatch(fetchTransactions(chainId, amount, token))
    })
  }, [slowRefresh, amount, token, chain, dispatch])
  return useSelector((state: State) => state.info.transactions)
}

export const useFetchInfoTokenDaysData = (chain: number, address: string, amount = 30) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(setLoading({ stateType: InfoStateTypes.TOKENDAYSDATA, chain, loading: true }))
    dispatch(fetchTokenDaysData(chain, address, amount))
  }, [slowRefresh, chain, address, amount, dispatch])
  return useSelector((state: State) => state.info.tokenDaysData)
}

export const useFetchInfoPairDaysData = (chain: number, address: string, amount = 30) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(setLoading({ stateType: InfoStateTypes.PAIRDAYSDATA, chain, loading: true }))
    dispatch(fetchPairDaysData(chain, address, amount))
  }, [slowRefresh, chain, address, amount, dispatch])
  return useSelector((state: State) => state.info.pairDaysData)
}

export const useFetchInfoNativePrice = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      dispatch(setLoading({ stateType: InfoStateTypes.NATIVE_PRICE, chainId, loading: true }))
      dispatch(fetchNativePrice(chainId))
    })
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.info.nativePrice)
}

export const useFetchInfoDaysData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      dispatch(setLoading({ stateType: InfoStateTypes.DAYS_DATA, chainId, loading: true }))
      dispatch(fetchDaysData(chainId, 1))
    })
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.info.daysData)
}

export const useFetchInfoTokensData = (amount: number, current?: boolean, token = '', chain?: number) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  const blocks = useSelector((state: State) => state.info.block)
  useEffect(() => {
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      if (chain && chainId !== chain) {
        return
      }
      if (current === true) {
        dispatch(setLoading({ stateType: InfoStateTypes.TOKENS, chainId, loading: true }))
      } else {
        dispatch(setLoading({ stateType: InfoStateTypes.TOKENSDAYOLD, chainId, loading: true }))
      }

      if (blocks[chainId].initialized) {
        dispatch(fetchTokens(chainId, amount, current === true ? '0' : blocks[chainId].data?.number, token))
      }
    })
  }, [slowRefresh, blocks, amount, current, token, chain, dispatch])
  return useSelector((state: State) => (current === true ? state.info.tokens : state.info.tokensDayOld))
}

export const useFetchInfoBlock = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    const currentTime = Math.round(new Date().getTime() / 1000)
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      dispatch(setLoading({ stateType: InfoStateTypes.BLOCK, chainId, loading: true }))
      dispatch(fetchBlock(chainId, currentTime - 24 * 60 * 60, currentTime))
    })
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.info.block)
}

export const useFetchChartData = (amount: number) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      dispatch(setLoading({ stateType: InfoStateTypes.CHARTDATA, chainId, loading: true }))
      dispatch(fetchChartData(chainId, amount))
    })
  }, [dispatch, amount])
  return useSelector((state: State) => state.info.chartData)
}

export const useFetchActiveChains = (): [number[], (chainId: number) => void] => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchActiveChains())
  }, [dispatch])

  const activeChains = useSelector((state: State) => state.info.activeChains)
  const toggleChain = useCallback(
    (chainId: number) => {
      dispatch(updateActiveChains(chainId, activeChains))
    },
    [dispatch, activeChains],
  )

  return [activeChains, toggleChain]
}

export const useFetchFavTokens = (): [string[], (tokenId: string) => void] => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchFavTokens())
  }, [dispatch])

  const favTokens = useSelector((state: State) => state.info.favTokens)
  const toggleFav = useCallback(
    (tokenId: string) => {
      dispatch(updateFavTokens(tokenId, favTokens))
    },
    [dispatch, favTokens],
  )

  return [favTokens, toggleFav]
}

export const useFetchFavPairs = (): [string[], (tokenId: string) => void] => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchFavPairs())
  }, [dispatch])

  const favPairs = useSelector((state: State) => state.info.favPairs)
  const toggleFav = useCallback(
    (pairId: string) => {
      dispatch(updateFavPairs(pairId, favPairs))
    },
    [dispatch, favPairs],
  )

  return [favPairs, toggleFav]
}

export const useFetchInfoUniswapFactories = (current?: boolean) => {
  const dispatch = useAppDispatch()
  const blocks = useSelector((state: State) => state.info.block)
  useEffect(() => {
    MAINNET_CHAINS_INFOPAGE.forEach((chainId) => {
      if (current === true) {
        dispatch(setLoading({ stateType: InfoStateTypes.CURRENTDAYFACTORIES, chainId, loading: true }))
      } else {
        dispatch(setLoading({ stateType: InfoStateTypes.DAYOLDFACTORIES, chainId, loading: true }))
      }

      if (blocks[chainId].initialized) {
        dispatch(fetchUniswapFactories(chainId, current === true ? '0' : blocks[chainId].data?.number))
      }
    })
  }, [blocks, dispatch, current])

  return useSelector((state: State) => (current === true ? state.info.currentDayFactories : state.info.dayOldFactories))
}
