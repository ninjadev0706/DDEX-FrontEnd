import { ChainId } from '@ape.swap/sdk'

export const MetamaskLinks = {
  [ChainId.BSC]: 'https://docs.bnbchain.org/docs/wallet/metamask/',
  [ChainId.MATIC]: 'https://wiki.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/',
  [ChainId.MAINNET]: 'https://metamask.io/faqs/',
  [ChainId.TLOS]: 'https://decentralizedcreator.com/add-telos-evm-network-to-metamask/',
  [ChainId.ARBITRUM]: 'https://academy.binance.com/en/articles/how-to-add-arbitrum-to-metamask',
}

export const routeNames: Record<
  | '/'
  | '/jungle-farms'
  | '/banana-farms'
  | '/farms'
  | '/swap'
  | '/pools'
  | '/maximizers'
  | '/add'
  | '/add-liquidity'
  | '/liquidity'
  | '/zap'
  | '/migrate'
  | '/find'
  | '/remove'
  | '/limit-orders'
  | '/iao'
  | '/gnana'
  | '/treasury-bills'
  | '/nft'
  | '/auction'
  | '/staking'
  | '/apestats'
  | '/protocol-dashboard'
  | '/the-migration',
  string
> = {
  '/': 'HOME',
  '/jungle-farms': 'JUNGLE_FARMS',
  '/banana-farms': 'FARMS',
  '/farms': 'FARMS',
  '/swap': 'SWAP',
  '/pools': 'POOLS',
  '/maximizers': 'MAXIMIZERS_VAULTS',
  '/add': 'ADD_LIQUIDITY',
  '/add-liquidity': 'ADD_LIQUIDITY',
  '/liquidity': 'LIQUIDITY',
  '/zap': 'LIQUIDITY',
  '/migrate': 'LIQUIDITY',
  '/find': 'LIQUIDITY',
  '/remove': 'LIQUIDITY',
  '/limit-orders': 'ORDERS',
  '/iao': 'IAO',
  '/gnana': 'GNANA',
  '/treasury-bills': 'TREASURY_BILL',
  '/nft': 'NFT',
  '/auction': 'AUCTION',
  '/staking': 'STAKING',
  '/apestats': 'APESTATS',
  '/protocol-dashboard': 'PROTOCOL_DASHBOARD',
  '/the-migration': 'THE_MIGRATION',
}

export enum Farms {
  BNB = 'bnb-chain-farms',
  Polygon = 'polygon-farms',
  Ethereum = '',
  Telos = 'telos-farms',
}

export const DOC_LINKS = {
  HOME: 'https://apeswap.gitbook.io/apeswap-finance/welcome/master',
  JUNGLE_FARMS: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake/farms/',
  FARMS: `https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake/farms/`,
  SWAP: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/swap',
  POOLS: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake/pools',
  MAXIMIZERS_VAULTS: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake/vaults',
  ADD_LIQUIDITY:
    'https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/liquidity/how-to-add-liquidity',
  LIQUIDITY: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/liquidity',
  ORDERS: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/limit-orders',
  IAO: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/raise/initial-ape-offerings-iaos',
  GNANA: 'https://apeswap.gitbook.io/apeswap-finance/welcome/apeswap-tokens/gnana',
  TREASURY_BILL: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/raise/treasury-bills',
  NFT: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/collect/non-fungible-apes-nfas',
  AUCTION:
    'https://apeswap.gitbook.io/apeswap-finance/product-and-features/collect/non-fungible-apes-nfas/nfa-auction-house',
  STAKING: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake',
  APESTATS: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/apestats',
  PROTOCOL_DASHBOARD: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/protocol-dashboard',
  THE_MIGRATION: 'https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake/hard-cap-migration-masterapev2',
}
