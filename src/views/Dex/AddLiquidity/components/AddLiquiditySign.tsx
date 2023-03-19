import { Flex, Text } from '@ape.swap/uikit'
import React from 'react'
import { styles } from './styles'

const AddLiquiditySign: React.FC = () => (
  <Flex sx={{ ...styles.swapSwitchContainer }}>
    <Flex sx={{ ...styles.swapSwitchButton }}>
      <Text weight={700} size="20px" color="primaryBright" sx={{ lineHeight: '0px' }}>
        +
      </Text>
    </Flex>
  </Flex>
)

export default React.memo(AddLiquiditySign)
