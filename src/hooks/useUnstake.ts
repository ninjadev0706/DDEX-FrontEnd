import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import masterChefAbi from 'config/abi/masterchef.json'
import {
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
  updateUserNfaStakingStakedBalance,
  updateNfaStakingUserBalance,
  updateUserNfaStakingPendingReward,
} from 'state/actions'
import track from 'utils/track'
import {
  unstake,
  sousUnstake,
  sousEmegencyWithdraw,
  nfaUnstake,
  miniChefUnstake,
  jungleUnstake,
  unstakeMasterChefV2,
} from 'utils/callHelpers'
import {
  updateDualFarmUserEarnings,
  updateDualFarmUserStakedBalances,
  updateDualFarmUserTokenBalances,
} from 'state/dualFarms'
import { useNetworkChainId } from 'state/hooks'
import {
  useJungleChef,
  useMasterchef,
  useMasterChefV2Contract,
  useMiniChefContract,
  useNfaStakingChef,
  useSousChef,
} from './useContract'
import useActiveWeb3React from './useActiveWeb3React'
import { Contract } from 'ethers'
import { Masterchef } from 'config/abi/types'
import { getProviderOrSigner } from 'utils'
import { CHEF_ADDRESSES } from 'config/constants/chains'

const useUnstake = (pid: number, v2Flag: boolean) => {
  const { chainId } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const masterChefContractV2 = useMasterChefV2Contract()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const trxHash = (await v2Flag)
        ? unstakeMasterChefV2(masterChefContractV2, pid, amount)
        : unstake(masterChefContract, pid, amount)
      track({
        event: 'farm',
        chain: chainId,
        data: {
          cat: 'unstake',
          amount,
          pid,
        },
      })
      return trxHash
    },
    [masterChefContract, masterChefContractV2, v2Flag, pid, chainId],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch()
  const { account, chainId } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const masterChefContractV2 = useMasterChefV2Contract()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      let trxHash
      if (sousId === 0) {
        trxHash = await unstakeMasterChefV2(masterChefContractV2, 0, amount)
      } else if (sousId === 999) {
        trxHash = await unstake(masterChefContract, 0, amount)
      } else {
        trxHash = await sousUnstake(sousChefContract, amount)
      }
      dispatch(updateUserStakedBalance(chainId, sousId, account))
      dispatch(updateUserBalance(chainId, sousId, account))
      dispatch(updateUserPendingReward(chainId, sousId, account))
      track({
        event: 'pool',
        chain: chainId,
        data: {
          cat: 'unstake',
          amount,
          sousId,
        },
      })
      return trxHash
    },
    [account, dispatch, masterChefContract, masterChefContractV2, sousChefContract, sousId, chainId],
  )

  return { onUnstake: handleUnstake }
}

export const useJungleUnstake = (jungleId) => {
  const { chainId } = useActiveWeb3React()
  const jungleChefContract = useJungleChef(jungleId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const trxHash = await jungleUnstake(jungleChefContract, amount)

      track({
        event: 'jungle_farm',
        chain: chainId,
        data: {
          cat: 'unstake',
          amount,
          jungleId,
        },
      })
      return trxHash
    },
    [jungleChefContract, jungleId, chainId],
  )

  return { onUnstake: handleUnstake }
}

export const useSousEmergencyWithdraw = (sousId) => {
  const dispatch = useDispatch()
  // TODO switch to useActiveWeb3React. useWeb3React is legacy hook and useActiveWeb3React should be used going forward
  const { account, chainId } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const handleEmergencyWithdraw = useCallback(async () => {
    const txHash = await sousEmegencyWithdraw(sousChefContract)
    dispatch(updateUserStakedBalance(chainId, sousId, account))
    dispatch(updateUserBalance(chainId, sousId, account))
    dispatch(updateUserPendingReward(chainId, sousId, account))
    console.info(txHash)
  }, [account, dispatch, sousChefContract, sousId, chainId])
  return { onEmergencyWithdraw: handleEmergencyWithdraw }
}

export const useNfaUnstake = (sousId) => {
  const dispatch = useDispatch()
  // TODO switch to useActiveWeb3React. useWeb3React is legacy hook and useActiveWeb3React should be used going forward
  const { account } = useWeb3React()
  const chainId = useNetworkChainId()
  const nfaStakeChefContract = useNfaStakingChef(sousId)

  const handleUnstake = useCallback(
    async (ids: number[]) => {
      await nfaUnstake(nfaStakeChefContract, ids)
      dispatch(updateUserNfaStakingStakedBalance(chainId, sousId, account))
      dispatch(updateNfaStakingUserBalance(chainId, sousId, account))
      dispatch(updateUserNfaStakingPendingReward(chainId, sousId, account))
      track({
        event: 'nfa',
        chain: chainId,
        data: {
          cat: 'unstake',
          ids,
        },
      })
    },
    [account, dispatch, nfaStakeChefContract, sousId, chainId],
  )

  return { onUnstake: handleUnstake }
}

export const useMiniChefUnstake = (pid: number) => {
  const dispatch = useDispatch()
  // TODO switch to useActiveWeb3React. useWeb3React is legacy hook and useActiveWeb3React should be used going forward
  const { account, chainId } = useWeb3React()
  const miniChefContract = useMiniChefContract()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await miniChefUnstake(miniChefContract, pid, amount, account)
      dispatch(updateDualFarmUserEarnings(chainId, pid, account))
      dispatch(updateDualFarmUserStakedBalances(chainId, pid, account))
      dispatch(updateDualFarmUserTokenBalances(chainId, pid, account))
      return txHash
    },
    [account, dispatch, miniChefContract, pid, chainId],
  )

  return { onUnstake: handleUnstake }
}

export const useMigrateUnstake = (chefAddress: string, pid: number) => {
  const { chainId, library, account } = useActiveWeb3React()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const masterChefContract = new Contract(
        chefAddress,
        masterChefAbi,
        getProviderOrSigner(library, account),
      ) as Masterchef
      const trxHash = await unstake(masterChefContract, pid, amount)
      track({
        event: 'farm',
        chain: chainId,
        data: {
          platform: CHEF_ADDRESSES[chainId][chefAddress],
          cat: 'unstake',
          amount,
          pid,
        },
      })
      return trxHash
    },
    [chefAddress, pid, chainId, library, account],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
