import { ChainId } from '@ape.swap/sdk'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFarmLpAprs } from 'state/hooks'
import { useFetchLpTokenPrices } from 'state/lpPrices/hooks'
import { useFetchTokenPrices, useTokenPrices } from 'state/tokenPrices/hooks'
import { VaultsState, State, Vault } from 'state/types'
import { fetchVaultsV3PublicDataAsync, fetchVaultV3UserDataAsync } from '.'

// Vault data
export const usePollVaultsV3Data = (includeArchive = false) => {
  useFetchTokenPrices()
  useFetchLpTokenPrices()
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account, chainId } = useActiveWeb3React()
  const { tokenPrices } = useTokenPrices()
  const farmLpAprs = useFarmLpAprs()
  useEffect(() => {
    if (chainId === ChainId.BSC) {
      dispatch(fetchVaultsV3PublicDataAsync(chainId, tokenPrices, farmLpAprs))
    }
    if (account && chainId === ChainId.BSC) {
      dispatch(fetchVaultV3UserDataAsync(account, chainId))
    }
  }, [includeArchive, dispatch, slowRefresh, account, chainId, tokenPrices, farmLpAprs])
}

export const usePollVaultV3UserData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account, chainId } = useActiveWeb3React()
  useEffect(() => {
    if (account && chainId === ChainId.BSC) {
      dispatch(fetchVaultV3UserDataAsync(account, chainId))
    }
  }, [dispatch, slowRefresh, account, chainId])
}

// Vaults

export const useVaultsV3 = () => {
  const { loadVaultData, userDataLoaded, data }: VaultsState = useSelector((state: State) => state.vaultsV3)
  return { vaults: data, loadVaultData, userDataLoaded }
}

export const useVaultV3FromPid = (pid): Vault => {
  const vault = useSelector((state: State) => state.vaultsV3.data.find((v) => v.pid === pid))
  return vault
}

export const useVaultV3User = (pid) => {
  const vault = useVaultV3FromPid(pid)

  return {
    allowance: vault.userData ? new BigNumber(vault.userData.allowance) : new BigNumber(0),
    tokenBalance: vault.userData ? new BigNumber(vault.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: vault.userData ? new BigNumber(vault.userData.stakedBalance) : new BigNumber(0),
    stakedWantBalance: vault.userData ? new BigNumber(vault.userData.stakedWantBalance) : new BigNumber(0),
  }
}
