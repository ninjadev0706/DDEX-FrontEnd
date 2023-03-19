import { ChainId } from '@ape.swap/sdk'
import { getMaticTokenLogoURL } from 'config/constants/maticTokenMapping'

const getTokenLogoURL = (symbol: string, address: string, chainId: ChainId) => {
  let imageURL
  if (chainId === ChainId.BSC) {
    if (address?.toLowerCase() === '0x55d398326f99059fF775485246999027B3197955'.toLowerCase()) {
      imageURL = 'https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/USDT.svg'
    } else {
      imageURL = `https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${address}/logo.png`
    }
  } else if (chainId === ChainId.MATIC) {
    imageURL = getMaticTokenLogoURL(address)
  } else if (chainId === ChainId.MAINNET) {
    imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  } else {
    imageURL = `https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${symbol?.toUpperCase()}.svg`
  }
  return imageURL
}

export default getTokenLogoURL
