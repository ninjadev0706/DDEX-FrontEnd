/** @jsxImportSource theme-ui */
import { Flex, Svg } from '@ape.swap/uikit'
import React from 'react'
import { styles } from './styles'

const SwapSwitchButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Flex sx={styles.swapSwitchButton} onClick={onClick}>
    <Svg icon="swapArrows" width="13px" color="primaryBright" />
  </Flex>
)

export default React.memo(SwapSwitchButton)
