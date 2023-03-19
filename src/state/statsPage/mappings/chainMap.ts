import { supportedChains } from '.'
import { Chain } from '../types'

const emptyObjectCallback = <T>() => ({} as T)

export const chainMap = <T>(initialValueCallback: (chain: Chain) => T = emptyObjectCallback) =>
  supportedChains.reduce((acc, chain) => ({ ...acc, [chain]: initialValueCallback(chain) }), {}) as {
    [chain in Chain]: T
  }
