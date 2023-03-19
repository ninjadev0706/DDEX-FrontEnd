import styled from 'styled-components'
import { Button, ArrowDropUpIcon, Flex } from '@apeswapfinance/uikit'

export const StyledButton = styled(Button)<{ buttonSize?: string }>`
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  width: 100%;
  min-width: ${({ buttonSize }) => buttonSize || '145px'};
  max-width: ${({ buttonSize }) => buttonSize || '145px'};
  height: 44px;
`

export const ClaimButton = styled(Button)<{ margin?: string; buttonSize?: string }>`
  border-radius: 10px;
  font-weight: 700;
  width: 100%;
  margin: ${({ margin }) => margin || 0};
  max-width: ${({ buttonSize }) => buttonSize || '100%'};
`

export const NextArrow = styled(ArrowDropUpIcon)`
  transform: rotate(90deg);
`

export const Container = styled(Flex)`
  position: relative;
  flex-direction: column;
`
