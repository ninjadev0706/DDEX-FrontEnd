import { ChainId } from '@ape.swap/sdk'

interface PairToken {
  id: string
  name: string
  symbol: string
}
interface SwapToken {
  id: string
  symbol: string
}

interface SwapTransaction {
  id: string
  timestamp: string
}

export interface Pairs {
  id: string
  reserveUSD: string
  token0: PairToken
  token1: PairToken
  volumeUSD: string
  chainId: ChainId
}

export interface Swaps {
  amount0In: string
  amount0Out: string
  amount1In: string
  amount1Out: string
  amount0: string
  amount1: string
  amountUSD: string
  pair: { token0: SwapToken; token1: SwapToken }
  to: string
  sender: string
  transaction: SwapTransaction
  chainId: ChainId
  transactionType: string
}

export interface Transactions {
  mints: Swaps[]
  burns: Swaps[]
  swaps: Swaps[]
  chainId: ChainId
}

export interface NativePrice {
  id: string
  ethPrice: string
  chainId: ChainId
}

export interface DaysData {
  dailyVolumeETH: string
  dailyVolumeUSD: string
  date: number
  id: string
  totalLiquidityETH: string
  totalLiquidityUSD: string
  totalVolumeUSD: string
  txCount: string
  chainId: ChainId
}

export interface Token {
  derivedETH: string
  id: string
  name: string
  symbol: string
  totalLiquidity: string
  tradeVolumeUSD: string
  chainId: ChainId
}

export interface TokenDaysData {
  id: string
  token: {
    name: string
    symbol: string
  }
  date: number
  priceUSD: string
  totalLiquidityUSD: string
  dailyVolumeUSD: string
  dailyTxns: string
}

export interface PairDaysData {
  id: string
  dailyVolumeUSD: number
  reserveUSD: number
}

export interface Block {
  id: string
  number: string
  timestamp: string
  chainId: ChainId
}

export enum InfoStateTypes {
  PAIRS = 'pairs',
  TRANSACTIONS = 'transactions',
  NATIVE_PRICE = 'nativePrice',
  DAYS_DATA = 'daysData',
  TOKENS = 'tokens',
  BLOCK = 'block',
  CURRENTDAYFACTORIES = 'currentDayFactories',
  DAYOLDFACTORIES = 'dayOldFactories',
  CHARTDATA = 'chartData',
  TOKENSDAYOLD = 'tokensDayOld',
  TOKENDAYSDATA = 'tokenDaysData',
  DAYOLDPAIRS = 'dayOldPairs',
  PAIRDAYSDATA = 'pairDaysData',
}

export interface InfoState {
  pairs: Record<ChainId, { data: Pairs[]; loading: boolean; initialized: boolean }>
  transactions: Record<ChainId, { data: Transactions[]; loading: boolean; initialized: boolean }>
  nativePrice: Record<ChainId, { data: NativePrice; loading: boolean; initialized: boolean }>
  daysData: Record<ChainId, { data: DaysData[]; loading: boolean; initialized: boolean }>
  tokens: Record<ChainId, { data: Token[]; loading: boolean; initialized: boolean }>
  block: Record<ChainId, { data: Block; loading: boolean; initialized: boolean }>
  currentDayFactories: Record<ChainId, { data: Block; loading: boolean; initialized: boolean }>
  dayOldFactories: Record<ChainId, { data: Block; loading: boolean; initialized: boolean }>
  chartData: Record<ChainId, { data: Block; loading: boolean; initialized: boolean }>
  tokensDayOld: Record<ChainId, { data: Token[]; loading: boolean; initialized: boolean }>
  tokenDaysData: Record<ChainId, { data: TokenDaysData[]; loading: boolean; initialized: boolean }>
  pairDaysData: Record<ChainId, { data: PairDaysData[]; loading: boolean; initialized: boolean }>
  dayOldPairs: Record<ChainId, { data: TokenDaysData[]; loading: boolean; initialized: boolean }>
  activeChains: number[]
  favTokens: string[]
  favPairs: string[]
}
