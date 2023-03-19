import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { State } from 'state/types'
import { fetchLpTokenPrices } from '.'

export const useFetchLpTokenPrices = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { chainId } = useActiveWeb3React()
  const farms = useSelector((state: State) => state.farms.data)
  const v2Farms = useSelector((state: State) => state.farmsV2.data)
  useEffect(() => {
    dispatch(fetchLpTokenPrices(chainId, [...farms, ...v2Farms]))
  }, [dispatch, farms, v2Farms, slowRefresh, chainId])
}
