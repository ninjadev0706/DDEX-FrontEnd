import { ChainId } from '@ape.swap/sdk'

const contracts = {
  banana: {
    [ChainId.BSC_TESTNET]: '0x4Fb99590cA95fc3255D9fA66a1cA46c43C34b09a',
    [ChainId.BSC]: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95',
    [ChainId.MATIC]: '0x5d47baba0d66083c52009271faf3f50dcc01023c',
    [ChainId.MAINNET]: '0x92df60c51c710a1b1c20e42d85e221f3a1bfc7f2',
    [ChainId.TLOS]: '0x667fd83e24ca1d935d36717d305d54fa0cac991c',
    [ChainId.ARBITRUM]: '0xd978f8489e1245568704407a479a71fcce2afe8f',
  },
  syrup: {
    [ChainId.BSC_TESTNET]: '0xAf1B22cBDbB502B2089885bcd230255f8B80243b',
    [ChainId.BSC]: '0x86Ef5e73EDB2Fea111909Fe35aFcC564572AcC06',
  },
  masterChef: {
    [ChainId.BSC_TESTNET]: '0xbbC5e1cD3BA8ED639b00927115e5f0e0040aA613',
    [ChainId.BSC]: '0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9',
  },
  masterChefV2: {
    [ChainId.BSC]: '0x71354AC3c695dfB1d3f595AfA5D4364e9e06339B',
  },
  sousChef: {
    [ChainId.BSC_TESTNET]: '0xAf1B22cBDbB502B2089885bcd230255f8B80243b',
    [ChainId.BSC]: '0x54aff400858Dcac39797a81894D9920f16972D1D',
  },
  nativeWrapped: {
    [ChainId.BSC_TESTNET]: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    [ChainId.MATIC]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    [ChainId.TLOS]: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
    [ChainId.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  lottery: {
    [ChainId.BSC_TESTNET]: '0xe42Ff4758C37ccC3A54004b176384477bbBe70D6',
    [ChainId.BSC]: '0x451bCf562A4d747da3455bBAFACe988d56dA6D83',
  },
  lotteryNFT: {
    [ChainId.BSC_TESTNET]: '0x02A8F0b67aB46C5D8d7D79396f237E593628E261',
    [ChainId.BSC]: '0x42020f11483279353ae4cEb1c6aab6aE98ca7f50',
  },
  mulltiCall: {
    [ChainId.BSC]: '0x38ce767d81de3940CFa5020B55af1A400ED4F657',
    [ChainId.BSC_TESTNET]: '0x67ADCB4dF3931b0C5Da724058ADC2174a9844412',
    [ChainId.MATIC]: '0x95028E5B8a734bb7E2071F96De89BABe75be9C8E',
    [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.TLOS]: '0xa1a283f10f578201a97a8f69d8c15828b778f04b',
    [ChainId.ARBITRUM]: '0x089d8780e1c0789d0ef786bf001bee52d8351cad',
  },
  mulltiCallV3: {
    [ChainId.BSC]: '0x47A307e3167820daf22a377D777371753758f59c',
    [ChainId.BSC_TESTNET]: '',
    [ChainId.MATIC]: '0x1F98415757620B543A52E61c46B32eB19261F984',
    [ChainId.MATIC_TESTNET]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
    [ChainId.MAINNET]: '0x1F98415757620B543A52E61c46B32eB19261F984',
    [ChainId.TLOS]: '0xf553b2be7aac670bcd812ba64a5025d9f5095ab5',
    [ChainId.ARBITRUM]: '0xC169b45E7A157Fe3fa248673576bcadcaFd8757B',
  },
  busd: {
    [ChainId.BSC_TESTNET]: '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee',
    [ChainId.BSC]: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  },
  wbnb: {
    [ChainId.BSC_TESTNET]: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  ust: {
    [ChainId.BSC]: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    [ChainId.BSC_TESTNET]: '',
  },
  usdt: {
    [ChainId.BSC]: '0x55d398326f99059ff775485246999027b3197955',
    [ChainId.BSC_TESTNET]: '',
  },
  bananaProfile: {
    [ChainId.BSC]: '0xDf4dBf6536201370F95e06A0F8a7a70fE40E388a',
    [ChainId.BSC_TESTNET]: '0xb57ab339831cd5154ef2ed721ceba734aa9047bd',
  },
  nonFungibleApes: {
    [ChainId.BSC]: '0x6afC012783e3a6eF8C5f05F8EeE2eDeF6a052Ec4',
    [ChainId.BSC_TESTNET]: '0x34e9f595c4e00bf3b9149224e3109c9311267620',
  },
  nonFungibleBananas: {
    [ChainId.BSC]: '0x9f707A412302a3aD64028A9F73f354725C992081',
  },
  rabbitMintingFarm: {
    [ChainId.BSC]: '0x1C99222F857C1d72234703eC5b9Ed88089Bd7091',
    [ChainId.BSC_TESTNET]: '0x8f4739a48883Fdd89b65DC245dD5774fC8f44a67',
  },
  eth: {
    [ChainId.BSC]: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    [ChainId.BSC_TESTNET]: '0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378',
  },
  claimRefund: {
    [ChainId.BSC]: '0xE7e53A7e9E3Cf6b840f167eF69519175c497e149',
    [ChainId.BSC_TESTNET]: '',
  },
  goldenBanana: {
    [ChainId.BSC]: '0xdDb3Bd8645775F59496c821E4F55A7eA6A6dc299',
    [ChainId.BSC_TESTNET]: '0x9407026d236DEAE22CC1F3c419A9e47CBfCFE9E5',
  },
  treasury: {
    [ChainId.BSC]: '0xec4b9d1fd8A3534E31fcE1636c7479BcD29213aE',
    [ChainId.BSC_TESTNET]: '0xbC5ed0829365a0d5bc3A4956A6A0549aE17f41Ab',
  },
  auction: {
    [ChainId.BSC]: '0xaeCB396Be7F19618Db4C44d8e2E8C908228515E9',
    [ChainId.BSC_TESTNET]: '0xe2782fb3f1c2506FA32484e728Bc42F578117dEC',
  },
  vaultApeV1: {
    [ChainId.BSC]: '0x5711a833C943AD1e8312A9c7E5403d48c717e1aa',
    [ChainId.MATIC]: '0x37ac7DE40A6fd71FD1559Aa00F154E8dcb72efdb',
  },
  vaultApeV2: {
    [ChainId.BSC]: '0x38f010F1005fC70239d6Bc2173896CA35D624e8d',
    [ChainId.BSC_TESTNET]: '0x29436C9fd14d9692012262Be4917712D4097D4B3',
    [ChainId.MATIC]: '',
  },
  vaultApeV3: {
    [ChainId.BSC]: '0xe5C27CD5981B727d25D37B155aBF9Aa152CEaDBe',
  },
  apePriceGetter: {
    [ChainId.BSC]: '0xBe87a01F5eC8b809C8c28946d08f50bDB6Def195',
    [ChainId.BSC_TESTNET]: '0xd722f9A2950E35Ab3EeD1d013c214671750A638B',
    [ChainId.MATIC]: '0x05D6C73D7de6E02B3f57677f849843c03320681c',
    [ChainId.MAINNET]: '0x5fbFd1955EeA2F62F1AfD6d6E92223Ae859F7887',
    [ChainId.TLOS]: '0x29392efed565c13a0901aeb88e32bf58eeb8a067',
    [ChainId.ARBITRUM]: '0x128c8F223544028DE9db9D8A377280Dcf8Df60B3',
  },
  miniApeV2: {
    [ChainId.BSC]: '',
    [ChainId.BSC_TESTNET]: '',
    [ChainId.MATIC]: '0x54aff400858Dcac39797a81894D9920f16972D1D',
  },
  iazoFactoryProxy: {
    [ChainId.BSC]: '0xD6C35D6551330a48Ed6d2e09b2BcBe38f6bA4C4a',
    [ChainId.BSC_TESTNET]: '0x9739500a967fEAA2Ba373F8978085675eEF331a8',
  },
  iazoExposer: {
    [ChainId.BSC]: '0xFdfb230bFa399EC32EA8e98c2E7E3CcD953C860A',
    [ChainId.BSC_TESTNET]: '0xe977E40f29f699F75db2A137Af0B3Db2152404b6',
  },
  iazoSettings: {
    [ChainId.BSC]: '0x624433b9C78dE84c8Dd3C9e906046017Bb03E3A6',
    [ChainId.BSC_TESTNET]: '0x22FaB17bF074f07Ee2708868282897E619103369',
  },
  babToken: {
    [ChainId.BSC]: '0x2b09d47d550061f995a3b5c6f0fd58005215d7c8',
    [ChainId.BSC_TESTNET]: '0x9e5235Fc9B7d55EaE71097491EAA149250b22746',
  },
  raffle: {
    [ChainId.BSC]: '0xE136585d860B53dc2fC7ef00c268c8A8351c69d3',
    [ChainId.BSC_TESTNET]: '0x954c20D203e46e1e947079D5c7a265aFc52F0Efc',
  },
  migratorBalanceChecker: {
    [ChainId.BSC]: '0x38de6a9D2FaD1bfb942749587509803C09FdfABa',
  },
}

export default contracts