import React, { useState } from 'react'
import { Flex, Text } from '@apeswapfinance/uikit'
import useIsMobile from 'hooks/useIsMobile'

import ListView from '../ListView'
import { ExtendedListViewProps } from '../ListView/types'
import { ChainIcon } from 'views/Stats/components/ChainIcon'

import { Chain } from 'state/statsPage/types'
import { AnimatedArrow, ChainDisplay } from '../../styles'

interface ProductChainListProps {
  chain: Chain
  listViews: ExtendedListViewProps[]
}

const ProductChainList: React.FC<ProductChainListProps> = ({ chain, listViews }) => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(true)

  const toogle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <ChainDisplay onClick={toogle}>
        <Flex alignItems="center">
          <ChainIcon chain={chain} width={22} />
          <Text
            fontWeight={500}
            marginLeft={isMobile ? '10px' : '12px'}
            textTransform="uppercase"
            fontSize={isMobile ? '12px' : '16px'}
          >
            {chain === 40 && 'Telos Chain'}
            {chain === 56 && 'BNB Chain'}
            {chain === 137 && 'Polygon Chain'}
          </Text>
        </Flex>
        <AnimatedArrow height={8} isOpen={isOpen} />
      </ChainDisplay>
      <ListView listViews={listViews} isOpen={isOpen} />
    </>
  )
}

export default React.memo(ProductChainList)
