import { Pair, SmartRouter, Token, TokenAmount } from '@ape.swap/sdk'
import BigNumber from 'bignumber.js'
import { ERC20_ABI } from 'config/abi/erc20'
import { Erc20, MigratorBalanceChecker } from 'config/abi/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useCallback, useMemo } from 'react'
import { Farm, Vault } from 'state/types'
import { getContract } from 'utils'
import { getMigratorBalanceCheckerAddress } from 'utils/addressHelper'
import migratorBalanceChecker from 'config/abi/migratorBalanceChecker.json'
import { ApeswapWalletLpInterface, MigrateLpStatus, MigrateStatus, MigrationCompleteLog } from './types'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { CHEF_ADDRESSES } from 'config/constants/chains'
import { filterCurrentFarms, useUpdateApproveStakeStatus, useUpdateStatusId } from './utils'
import { PairState, usePairs } from 'hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'

/**
 * Hook to use handleMaximizerApprovalToggle callback which checks the allowance for each farm/vault and status state
 * @param farms List of ApeSwap farms
 * @param vaults List of ApeSwap vaults
 * @param lpStatus List of Migrate LPs status
 * @param setLpStatus Action to set the Migrate Lp Status state
 * @param setMigrateMaximizers Action to set the migrate maximizer flag state
 */
export const useHandleMaximizerApprovalToggle = (
  farms: Farm[],
  vaults: Vault[],
  lpStatus: MigrateLpStatus[],
  setLpStatus: React.Dispatch<React.SetStateAction<MigrateLpStatus[]>>,
  setMigrateMaximizers: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { chainId } = useActiveWeb3React()
  const handleMaximizerApprovalToggle = useCallback(
    (apeswapLps, migrateMaximizers) => {
      const updatedMigrateLpStatus = lpStatus
      setMigrateMaximizers(migrateMaximizers)
      apeswapLps.forEach(({ pair, id }) => {
        const matchedVault = vaults.find(
          (vault) => vault.stakeToken.address[chainId].toLowerCase() === pair.liquidityToken.address.toLowerCase(),
        )
        const matchedFarm = farms.find(
          (farm) => farm.lpAddresses[chainId].toLowerCase() === pair.liquidityToken.address.toLowerCase(),
        )
        const migrateVaultAvailable = migrateMaximizers && matchedVault
        const lpToUpdateIndex = lpStatus.findIndex((migrateLp) => migrateLp.id === id)
        const lpToUpdate = {
          ...lpStatus[lpToUpdateIndex],
          status: {
            ...lpStatus[lpToUpdateIndex].status,
            approveStake: migrateVaultAvailable
              ? new BigNumber(matchedVault?.userData?.allowance).gt(0)
                ? MigrateStatus.COMPLETE
                : MigrateStatus.INCOMPLETE
              : new BigNumber(matchedFarm?.userData?.allowance).gt(0)
              ? MigrateStatus.COMPLETE
              : MigrateStatus.INCOMPLETE,
          },
        }
        updatedMigrateLpStatus[lpToUpdateIndex] = lpToUpdate
      })
      setLpStatus([...updatedMigrateLpStatus])
    },
    [vaults, farms, lpStatus, chainId, setLpStatus, setMigrateMaximizers],
  )
  return handleMaximizerApprovalToggle
}

/**
 * Hook to set a callback to update the users ApeSwap LP balances after compelting a migrate
 * @param apeswapLpBalances List of ApeSwap LP balances
 * @param lpStatus List of Migrate LPs status
 * @param liquidityTokens List of Pair and PairStates
 * @param setLpStatus Action to set the Migrate LP Status state
 * @param setApeswapLpBalances Action to set the ApeSwap LP Balances
 */
export const useHandleUpdateOfApeswapLpBalance = (
  apeswapLpBalances: ApeswapWalletLpInterface[],
  lpStatus: MigrateLpStatus[],
  liquidityTokens: [PairState, Pair][],
  setLpStatus: React.Dispatch<React.SetStateAction<MigrateLpStatus[]>>,
  setApeswapLpBalances: React.Dispatch<React.SetStateAction<ApeswapWalletLpInterface[]>>,
) => {
  const { library, account, chainId } = useActiveWeb3React()
  const updateStatusId = useUpdateStatusId(lpStatus, setLpStatus)
  const updateApproveStakeStatus = useUpdateApproveStakeStatus(lpStatus, setLpStatus)
  const handleUpdateOfApeswapLpBalance = useCallback(
    async (id, token0, token1) => {
      let rawLpBalance = null
      const updatedApeswapLpBalances = apeswapLpBalances
      // We can set decimals to 18 since they arent used for getting the LP address
      const token0Obj = new Token(chainId, token0, 18)
      const token1Obj = new Token(chainId, token1, 18)
      const lpAddress = Pair.getAddress(token0Obj, token1Obj, SmartRouter.APE)
      // Check to see if the lp address already exists with a different id
      const checkIfApeLpExistsIndex = apeswapLpBalances.findIndex(
        (lp) => lp.pair.liquidityToken.address.toLowerCase() === lpAddress.toLowerCase(),
      )
      const lpContract = getContract(lpAddress, ERC20_ABI, library, account) as Erc20
      const newId = parseInt(lpAddress)
      try {
        rawLpBalance = await lpContract.balanceOf(account)
      } catch (e) {
        console.error(e)
      }
      const findPair = liquidityTokens.find(
        ([, pair]) => pair?.liquidityToken?.address.toLowerCase() === lpAddress.toLowerCase(),
      )?.[1]

      const tokenAmount = new TokenAmount(findPair?.liquidityToken, rawLpBalance ? rawLpBalance.toString() : 0)
      const apeLpToUpdate = { id: newId, pair: findPair, balance: tokenAmount }
      if (checkIfApeLpExistsIndex >= 0) {
        updatedApeswapLpBalances[checkIfApeLpExistsIndex] = apeLpToUpdate
      } else {
        updatedApeswapLpBalances.push(apeLpToUpdate)
      }

      updateStatusId(id, newId)
      updateApproveStakeStatus(apeLpToUpdate)
      setApeswapLpBalances(updatedApeswapLpBalances)
    },
    [
      chainId,
      library,
      account,
      liquidityTokens,
      apeswapLpBalances,
      updateStatusId,
      setApeswapLpBalances,
      updateApproveStakeStatus,
    ],
  )
  return handleUpdateOfApeswapLpBalance
}

/**
 * Hook to set a callback to update the users migrate balances
 * This is used after a migration action has been completed
 * @param farms List of ApeSwap farms
 * @param migrateLpBalances List of Migrate LPs balances
 * @param setMigrateWalletBalances Action to set the migrate wallet balances
 * @param setMigrateStakedBalances Action to set the migrate staked balances
 */
export const useHandleUpdateMigratorResults = (
  farms: Farm[],
  migrateLpBalances: MigrateResult[],
  setMigrateWalletBalances: React.Dispatch<React.SetStateAction<MigrateResult[]>>,
  setMigrateStakedBalances: React.Dispatch<React.SetStateAction<MigrateResult[]>>,
) => {
  const { chainId, library, account } = useActiveWeb3React()
  const handleUpdateMigratorResults = useCallback(async () => {
    let result = []
    const migratorAddress = getMigratorBalanceCheckerAddress(chainId)
    const migratorContract = getContract(
      migratorAddress,
      migratorBalanceChecker,
      library,
      account,
    ) as MigratorBalanceChecker
    try {
      result = await migratorContract.getBalance(account)
    } catch {
      console.warn('Something went wrong fetching migrate balances')
    }

    const balanceData = result.flatMap((b, i) => {
      const chef = CHEF_ADDRESSES[chainId][b.stakingAddress] as SmartRouter
      return b.balances.map(([pid, lp, token0, token1, total, wallet, staked]) => {
        return {
          id: migrateLpBalances.find((b) => b.lpAddress.toLowerCase() === lp.toLowerCase())?.id,
          smartRouter: chef,
          chefAddress: b.stakingAddress,
          lpAddress: lp,
          totalSupply: migrateLpBalances.find((b) => b.lpAddress.toLowerCase() === lp.toLowerCase())?.totalSupply,
          token0: {
            address: token0,
            symbol: migrateLpBalances.find((b) => b.token0.address.toLowerCase() === token0.toLowerCase())?.token0
              .symbol,
            decimals: null,
            reserves: migrateLpBalances.find(
              (b) =>
                b.token0.address.toLowerCase() === token0.toLowerCase() &&
                b.lpAddress.toLowerCase() === lp.toLowerCase(),
            )?.token0.reserves,
          },
          token1: {
            address: token1,
            symbol: migrateLpBalances.find((b) => b.token1.address.toLowerCase() === token1.toLowerCase())?.token1
              .symbol,
            decimals: null,
            reserves: migrateLpBalances.find(
              (b) =>
                b.token1.address.toLowerCase() === token1.toLowerCase() &&
                b.lpAddress.toLowerCase() === lp.toLowerCase(),
            )?.token1.reserves,
          },
          pid: parseInt(pid.toString()),
          walletBalance: getFullDisplayBalance(new BigNumber(wallet.toString())),
          stakedBalance: getFullDisplayBalance(new BigNumber(staked.toString())),
          totalBalance: getFullDisplayBalance(new BigNumber(total.toString())),
          lpPrice: migrateLpBalances.find((b) => b.lpAddress.toLowerCase() === lp.toLowerCase())?.lpPrice,
        }
      })
    })
    const updatedMigrateWalletBalances = balanceData.filter(
      (bal) => parseFloat(bal.walletBalance) > 0.0,
    ) as MigrateResult[]
    const updatedMigrateStakedBalances = balanceData.filter(
      (bal) => parseFloat(bal.stakedBalance) > 0.0,
    ) as MigrateResult[]

    // We need to filter the results to remove non farms
    setMigrateWalletBalances(filterCurrentFarms(farms, updatedMigrateWalletBalances, chainId))
    setMigrateStakedBalances(filterCurrentFarms(farms, updatedMigrateStakedBalances, chainId))
  }, [chainId, account, library, migrateLpBalances, farms, setMigrateWalletBalances, setMigrateStakedBalances])
  return handleUpdateMigratorResults
}

/**
 * Hook the set a callback to handle updating lp status state
 * @param lpStatus List of Migrate LP status
 * @param setLpStatus Action to set the state of LP Status
 */
export const useHandleUpdateMigrateLp = (
  lpStatus: MigrateLpStatus[],
  setLpStatus: React.Dispatch<React.SetStateAction<MigrateLpStatus[]>>,
) => {
  const handleUpdateMigrateLp = useCallback(
    (id, type, status, statusText) => {
      const updatedMigrateLpStatus = lpStatus
      const lpToUpdateIndex = lpStatus.findIndex((migrateLp) => migrateLp.id === id)
      const lpToUpdate = {
        ...lpStatus[lpToUpdateIndex],
        status: { ...lpStatus[lpToUpdateIndex].status, [type]: status },
        statusText: statusText,
      }
      updatedMigrateLpStatus[lpToUpdateIndex] = lpToUpdate
      setLpStatus([...updatedMigrateLpStatus])
    },
    [setLpStatus, lpStatus],
  )

  return handleUpdateMigrateLp
}

/**
 * Hook the set a callback to handle updating the migration completion state
 * @param setMigrationCompleteLog Action to add a completed migration to the completion state
 */
export const useHandleAddMigrationCompleteLog = (
  setMigrationCompleteLog: React.Dispatch<React.SetStateAction<MigrationCompleteLog[]>>,
) => {
  const handleAddMigrationCompleteLog = useCallback(
    (migrationLog: MigrationCompleteLog) => {
      setMigrationCompleteLog((prev) => [...prev, migrationLog])
    },
    [setMigrationCompleteLog],
  )

  return handleAddMigrationCompleteLog
}

/**
 * Hook to get the users ApeSwap LPs for the migration
 */
export const useLpBalances = () => {
  const { account } = useActiveWeb3React()
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )

  const allPairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

  const [v2PairsBalances, apeBalancesLoading] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
  const pairAndBalances = allV2PairsWithLiquidity.map((pair) => {
    return { id: parseInt(pair.liquidityToken.address), pair, balance: v2PairsBalances[pair.liquidityToken.address] }
  })

  return { allPairs, pairAndBalances, apeBalancesLoading }
}
