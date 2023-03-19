import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import {
  updateUserStakedBalance,
  updateUserBalance,
  updateNfaStakingUserBalance,
  updateUserNfaStakingStakedBalance,
} from 'state/actions'
import { stake, sousStake, nfaStake, miniChefStake, jungleStake, stakeMasterChefV2 } from 'utils/callHelpers'
import track from 'utils/track'
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
import { ChainId } from '@ape.swap/sdk'

const useStake = (pid: number, v2Flag: boolean, lpValue: number) => {
  const { chainId } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const masterChefContractV2 = useMasterChefV2Contract()

  const handleStake = useCallback(
    async (amount: string) => {
      const trxHash = (await v2Flag)
        ? stakeMasterChefV2(masterChefContractV2, pid, amount)
        : stake(masterChefContract, pid, amount)
      track({
        event: 'farm',
        chain: chainId,
        data: {
          cat: 'stake',
          amount,
          pid,
          usdAmount: parseFloat(amount) * lpValue,
        },
      })
      return trxHash
    },
    [masterChefContract, masterChefContractV2, v2Flag, pid, lpValue, chainId],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, tokenValue: number) => {
  const dispatch = useDispatch()
  const { account, chainId } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)
  const masterChefContractV2 = useMasterChefV2Contract()

  const handleStake = useCallback(
    async (amount: string) => {
      let trxHash
      if (sousId === 0) {
        trxHash = await stakeMasterChefV2(masterChefContractV2, 0, amount)
      } else if (sousId === 999) {
        trxHash = await stake(masterChefContract, 0, amount)
      } else {
        trxHash = await sousStake(sousChefContract, amount)
      }

      track({
        event: 'pool',
        chain: 56,
        data: {
          cat: 'stake',
          amount,
          pid: sousId,
          usdAmount: parseFloat(amount) * tokenValue,
        },
      })

      dispatch(updateUserStakedBalance(chainId, sousId, account))
      dispatch(updateUserBalance(chainId, sousId, account))
      return trxHash
    },
    [account, dispatch, masterChefContract, sousChefContract, sousId, masterChefContractV2, tokenValue, chainId],
  )

  return { onStake: handleStake }
}

export const useJungleStake = (jungleId, lpValue: number) => {
  const jungleChefContract = useJungleChef(jungleId)

  const handleStake = useCallback(
    async (amount: string, chainId: ChainId) => {
      const trxHash = await jungleStake(jungleChefContract, amount)

      track({
        event: 'jungle_farm',
        chain: chainId,
        data: {
          cat: 'stake',
          amount,
          pid: jungleId,
          usdAmount: parseFloat(amount) * lpValue,
        },
      })

      return trxHash
    },
    [jungleChefContract, jungleId, lpValue],
  )

  return { onStake: handleStake }
}

export const useNfaStake = (sousId) => {
  const dispatch = useDispatch()
  // TODO switch to useActiveWeb3React. useWeb3React is legacy hook and useActiveWeb3React should be used going forward
  const { account } = useWeb3React()
  const chainId = useNetworkChainId()
  const nfaStakeChefContract = useNfaStakingChef(sousId)

  const handleStake = useCallback(
    async (ids: number[]) => {
      await nfaStake(nfaStakeChefContract, ids)
      dispatch(updateUserNfaStakingStakedBalance(chainId, sousId, account))
      dispatch(updateNfaStakingUserBalance(chainId, sousId, account))
      track({
        event: 'nfa',
        chain: chainId,
        data: {
          cat: 'stake',
          ids,
          pid: sousId,
        },
      })
    },
    [account, dispatch, nfaStakeChefContract, sousId, chainId],
  )

  return { onStake: handleStake }
}

export const useDualFarmStake = (pid: number) => {
  const dispatch = useDispatch()
  // TODO switch to useActiveWeb3React. useWeb3React is legacy hook and useActiveWeb3React should be used going forward
  const { account, chainId } = useWeb3React()
  const miniChefContract = useMiniChefContract()
  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await miniChefStake(miniChefContract, pid, amount, account)
      dispatch(updateDualFarmUserStakedBalances(chainId, pid, account))
      dispatch(updateDualFarmUserEarnings(chainId, pid, account))
      dispatch(updateDualFarmUserTokenBalances(chainId, pid, account))
      track({
        event: 'dualFarm',
        chain: chainId,
        data: {
          cat: 'stake',
          amount,
          pid,
        },
      })
      console.info(txHash)
      return txHash
    },
    [account, dispatch, miniChefContract, pid, chainId],
  )

  return { onStake: handleStake }
}

export default useStake
