import React from 'react'
import { Svg, icons } from '@ape.swap/uikit'
import { Chain } from 'state/statsPage/types'

export const ChainIcon: React.FC<{ chain: Chain; width?: number }> = ({ chain, width }) => {
  const getIcon = () => {
    switch (chain) {
      case 40:
        return icons.TLOS_TOKEN

      case 56:
        return icons.BSC_TOKEN

      case 137:
        return icons.POLYGON_TOKEN
    }
  }

  return <Svg icon={getIcon()} width={width} />
}
