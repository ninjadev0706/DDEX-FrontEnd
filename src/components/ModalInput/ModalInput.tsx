import React from 'react'
import styled from '@emotion/styled'
import { Text, Button, Input, InputProps, Flex } from '@apeswapfinance/uikit'
import { useTranslation } from '../../contexts/Localization'

interface ModalInputProps {
  max: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  displayDecimals?: number
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white3};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  border: none;
  width: 100%;
  font-weight: 800;
  background-color: ${({ theme }) => theme.colors.white3};
`

const StyledButton = styled(Button)`
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.primaryBright};
  font-weight: 500;
  font-size: 12px;
  padding: 3px 10px;
  height: 22px;
`

const ModalInput: React.FC<ModalInputProps> = ({ max, onChange, onSelectMax, value, inputTitle, displayDecimals }) => {
  const { t } = useTranslation()
  const isBalanceZero = max === '0' || !max

  const displayBalance = isBalanceZero ? '0' : parseFloat(max).toFixed(displayDecimals || 4)

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" alignItems="flex-end" pl="16px">
          <Text fontSize="14px" fontWeight={800}>
            {inputTitle}
          </Text>
          <Text fontSize="16px" fontWeight={500}>
            {t('Balance')}: {displayBalance.toLocaleString()}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mt="5px">
          <StyledInput onChange={onChange} placeholder="0" value={value} />
          <StyledButton size="sm" onClick={onSelectMax} ml="1px">
            {t('Max')}
          </StyledButton>
        </Flex>
      </StyledTokenInput>
    </div>
  )
}

export default ModalInput
