import { Token } from 'config/constants/types'

export const vaultTokenDisplay = (token1: Token, token2: Token) => {
  let stakeLp = false
  let earnLp = false
  let tokenDisplay: { token1?: string; token2?: string; token3?: string; token4?: string } = {}
  if (!token1.lpToken && !token2.lpToken) {
    tokenDisplay = { token1: token1.symbol, token2: token2.symbol }
  }
  if (token1.lpToken && !token2.lpToken) {
    const [splitToken1, splitToken2] = token1.symbol.split('-')
    stakeLp = true
    tokenDisplay = { token1: splitToken1, token2: splitToken2, token3: token2.symbol }
  }
  if (token1.lpToken && token2.lpToken) {
    stakeLp = true
    earnLp = true
    const [splitToken1, splitToken2] = token1.symbol.split('-')
    const [splitToken3, splitToken4] = token2.symbol.split('-')
    tokenDisplay = { token1: splitToken1, token2: splitToken2, token3: splitToken3, token4: splitToken4 }
  }
  return { tokenDisplay, stakeLp, earnLp }
}
