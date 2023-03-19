import { Currency, CurrencyAmount, JSBI, Pair, Percent, SmartRouter, TokenAmount } from '@ape.swap/sdk'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { usePair } from 'hooks/usePairs'
import { useTranslation } from 'contexts/Localization'
import useTotalSupply from 'hooks/useTotalSupply'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useTokenBalances } from '../wallet/hooks'
import { Field, typeInput, setMigrator, MigratorZap } from './actions'
import { useLastZapMigratorRouter, useUserSlippageTolerance } from 'state/user/hooks'
import { calculateSlippageAmount } from 'utils'
import { useMultipleContractSingleData, useSingleCallResult } from 'lib/hooks/multicall'
import { useMigratorBalanceCheckerContract } from 'hooks/useContract'
import { CHEF_ADDRESSES } from 'config/constants/chains'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { Interface } from '@ethersproject/abi'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import BigNumber from 'bignumber.js'
import { getLpUsdPrice } from '../../utils/getTokenUsdPrice'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export function useZapMigratorState(): AppState['zapMigrator'] {
  return useSelector<AppState, AppState['zapMigrator']>((state) => state.zapMigrator)
}

export function useDerivedZapMigratorInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  pair?: Pair | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: CurrencyAmount
    [Field.CURRENCY_B]?: CurrencyAmount
  }
  zapMigrate: MigratorZap
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { independentField, typedValue, smartRouter } = useZapMigratorState()
  const [zapMigratorRouter] = useLastZapMigratorRouter()
  const [allowedSlippage] = useUserSlippageTolerance(true)

  // pair + totalsupply
  const [, pair] = usePair(currencyA, currencyB, smartRouter || zapMigratorRouter)
  const { t } = useTranslation()

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pair?.liquidityToken])
  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  const [tokenA, tokenB] = [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken,
  }

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw)
      : undefined
  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw)
      : undefined
  const liquidityValues: { [Field.CURRENCY_A]?: TokenAmount; [Field.CURRENCY_B]?: TokenAmount } = {
    [Field.CURRENCY_A]: liquidityValueA,
    [Field.CURRENCY_B]: liquidityValueB,
  }

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }
  // user specified a specific amount of liquidity tokens
  else if (independentField === Field.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken)
      if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
        percentToRemove = new Percent(independentAmount.raw, userLiquidity.raw)
      }
    }
  }
  // user specified a specific amount of token a or b
  else if (tokens[independentField]) {
    const independentAmount = tryParseAmount(typedValue, tokens[independentField])
    const liquidityValue = liquidityValues[independentField]
    if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
      percentToRemove = new Percent(independentAmount.raw, liquidityValue.raw)
    }
  }

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
        ? new TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
        : undefined,
    [Field.CURRENCY_A]:
      tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
        ? new TokenAmount(tokenA, percentToRemove.multiply(liquidityValueA.raw).quotient)
        : undefined,
    [Field.CURRENCY_B]:
      tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
        ? new TokenAmount(tokenB, percentToRemove.multiply(liquidityValueB.raw).quotient)
        : undefined,
  }

  // Get the min amount to remove

  const amountsMinRemove = {
    [Field.CURRENCY_A]: parsedAmounts?.CURRENCY_A
      ? calculateSlippageAmount(parsedAmounts.CURRENCY_A, allowedSlippage)[0]
      : '0',
    [Field.CURRENCY_B]: parsedAmounts?.CURRENCY_B
      ? calculateSlippageAmount(parsedAmounts.CURRENCY_B, allowedSlippage)[0]
      : '0',
  }

  // Get the min amount to add

  const amountsMinAdd = {
    [Field.CURRENCY_A]: parsedAmounts?.CURRENCY_A
      ? calculateSlippageAmount(
          new TokenAmount(parsedAmounts?.CURRENCY_A.token, amountsMinRemove[Field.CURRENCY_A]),
          allowedSlippage,
        )[0]
      : '0',
    [Field.CURRENCY_B]: parsedAmounts?.CURRENCY_B
      ? calculateSlippageAmount(
          new TokenAmount(parsedAmounts?.CURRENCY_B.token, amountsMinRemove[Field.CURRENCY_B]),
          allowedSlippage,
        )[0]
      : '0',
  }

  const zapMigrate = {
    chainId,
    zapLp: pair,
    amount: parsedAmounts?.LIQUIDITY?.raw.toString(),
    amountAMinRemove: amountsMinRemove[Field.CURRENCY_A]?.toString(),
    amountBMinRemove: amountsMinRemove[Field.CURRENCY_B]?.toString(),
    amountAMinAdd: amountsMinAdd[Field.CURRENCY_A]?.toString(),
    amountBMinAdd: amountsMinAdd[Field.CURRENCY_B]?.toString(),
  }

  let error: string | undefined
  if (!account) {
    error = t('Connect Wallet')
  }

  if (!parsedAmounts[Field.LIQUIDITY] || !parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? t('Enter an amount')
  }

  return { pair, parsedAmounts, zapMigrate, error }
}

export function useZapMigratorActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
  onUserSetMigrator: (pairAddress: string, smartRouter: SmartRouter) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch],
  )

  const onUserSetMigrator = useCallback(
    (pairAddress: string, smartRouter: SmartRouter) => {
      dispatch(setMigrator({ pairAddress, smartRouter }))
    },
    [dispatch],
  )

  return {
    onUserInput,
    onUserSetMigrator,
  }
}

// Need to generate a unique id for migrate results to keep track of the progress during migrate all as the LP address switches between protocols
// The id is only used to track migration status. It is not used in a single migration
export interface MigrateResult {
  id: number
  smartRouter: SmartRouter
  chefAddress: string
  lpAddress: string
  totalSupply: string
  token0: { address: string; symbol: string; decimals: number; reserves: number }
  token1: { address: string; symbol: string; decimals: number; reserves: number }
  pid: number
  walletBalance: string
  stakedBalance: string
  lpPrice?: number
}

export const useMigratorBalances = (
  blocksPerFetch = 1,
): {
  valid: boolean
  loading: boolean
  syncing: boolean
  results: MigrateResult[]
} => {
  const { account, chainId } = useActiveWeb3React()
  const migratorBalanceCheckerContract = useMigratorBalanceCheckerContract()
  // The default gasRequired is too small for this call so we have to up the limit.
  // default variables can be seen here https://github.com/Uniswap/redux-multicall/blob/96dde8853e4990d06735c29e1eb1a76f748c5258/src/constants.ts
  const options = { gasRequired: 100000000, blocksPerFetch }
  const callResult = useSingleCallResult(migratorBalanceCheckerContract, 'getBalance', [account], options)
  const { result, valid, loading: balanceLoading, syncing } = callResult
  // List of LP addresses with chef
  const loLpAddressesWithChef = useMemo(
    () =>
      result
        ? result.pBalances.flatMap((b) =>
            b.balances.map((item) => {
              return { address: item.lp, smartRouter: CHEF_ADDRESSES[chainId][b.stakingAddress] as SmartRouter }
            }),
          )
        : [],
    [chainId, result],
  )
  // List of LP addresses
  const loLpAddresses = useMemo(
    () => (result ? result.pBalances.flatMap((b) => b.balances.map((item) => item.lp)) : []),
    [result],
  )
  // List of Token addresses
  const loTokenAddresses = result
    ? result.pBalances.flatMap((b) => b.balances.flatMap((item) => [item.token0, item.token1]))
    : []

  // List of LP prices
  const [lpPrices, setPrices] = useState(null)
  const [lpPricesLoading, setLpPricesLoading] = useState(true)
  useMemo(() => {
    const fetchPrices = async () => {
      const prices = await Promise.all(
        loLpAddressesWithChef.map(async (lpAddress): Promise<number> => {
          return getLpUsdPrice(chainId, lpAddress.address, 18, lpAddress.smartRouter)
        }),
      )
      setPrices(
        loLpAddressesWithChef.map((lpAddress, i) => {
          return { address: lpAddress.address, price: prices[i] }
        }),
      )
    }
    // Waiting until loLpAddressesWithChef is filled to fetch prices
    if (valid && !balanceLoading) fetchPrices().then(() => setLpPricesLoading(false))
  }, [balanceLoading, chainId, loLpAddressesWithChef, valid])

  const lpCallResults = useMultipleContractSingleData(loLpAddresses, PAIR_INTERFACE, 'getReserves')
  const lpTotalSupply = useMultipleContractSingleData(loLpAddresses, PAIR_INTERFACE, 'totalSupply')
  const tokenSymbolResults = useMultipleContractSingleData(loTokenAddresses, PAIR_INTERFACE, 'symbol')
  const tokenDecimalResults = useMultipleContractSingleData(loTokenAddresses, PAIR_INTERFACE, 'decimals')

  const sortedReserves = loLpAddresses.map((address, i) => {
    return { address, value: lpCallResults[i]?.result }
  })
  const sortedTotalSupply = loLpAddresses.map((address, i) => {
    return { address, value: lpTotalSupply[i]?.result?.[0].toString() }
  })
  const sortedSymbols = loTokenAddresses.map((address, i) => {
    return { address, value: tokenSymbolResults[i]?.result?.[0] }
  })
  const sortedDecimals = loTokenAddresses.map((address, i) => {
    return { address, value: tokenDecimalResults[i]?.result?.[0] }
  })

  const balanceData = useMemo(() => {
    return result
      ? result.pBalances.flatMap((b, i) => {
          const chef = CHEF_ADDRESSES[chainId][b.stakingAddress] as SmartRouter
          return b.balances.map(([pid, lp, token0, token1, total, wallet, staked]) => {
            return {
              id: parseInt(lp),
              smartRouter: chef,
              chefAddress: b.stakingAddress,
              lpAddress: lp,
              totalSupply: getFullDisplayBalance(
                new BigNumber(sortedTotalSupply.find((item) => item.address === lp)?.value),
              ),
              token0: {
                address: token0,
                symbol: sortedSymbols.find((item) => item.address === token0)?.value,
                decimals: sortedDecimals.find((item) => item.address === token0)?.value,
                reserves: sortedReserves.find((item) => item.address === lp)?.value?.[0].toString(),
              },
              token1: {
                address: token1,
                symbol: sortedSymbols.find((item) => item.address === token1)?.value,
                decimals: sortedDecimals.find((item) => item.address === token1)?.value,
                reserves: sortedReserves.find((item) => item.address === lp)?.value?.[1].toString(),
              },
              pid: parseInt(pid.toString()),
              walletBalance: getFullDisplayBalance(new BigNumber(wallet.toString())),
              stakedBalance: getFullDisplayBalance(new BigNumber(staked.toString())),
              totalBalance: getFullDisplayBalance(new BigNumber(total.toString())),
              lpPrice: lpPrices?.find((lpPrice) => lpPrice.address === lp)?.price ?? 0,
            }
          })
        })
      : []
  }, [result, lpPrices, chainId, sortedTotalSupply, sortedSymbols, sortedDecimals, sortedReserves])

  return {
    valid,
    syncing,
    loading:
      balanceLoading ||
      lpCallResults[0]?.loading ||
      tokenSymbolResults[0]?.loading ||
      tokenDecimalResults[0]?.loading ||
      lpPricesLoading,
    results: balanceData,
  }
}
