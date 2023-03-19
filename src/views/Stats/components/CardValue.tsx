import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from '@apeswapfinance/uikit'

interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  prefix?: string
  suffix?: string
  fontFamily?: string
  fontWeight?: number
  color?: string
  width?: string
  maxWidth?: string
  enableCountUp?: boolean
}

const getDecimals = (value: number) => {
  if (value === 0 || value > 1e5) return 0
  if (value < 1) return 4
  return 2
}

const format = (value: number, decimals?: number) => {
  if (!decimals) decimals = getDecimals(value)

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = '40px',
  prefix,
  suffix,
  fontFamily,
  fontWeight,
  color,
  width,
  maxWidth,
  enableCountUp,
}) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals: decimals || getDecimals(value),
  })

  const updateValue = useRef(update)

  useEffect(() => {
    if (enableCountUp) updateValue.current(value)
  }, [value, updateValue, enableCountUp])

  return (
    <Text
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      style={{ width: `${width}`, maxWidth: `${maxWidth}` }}
    >
      {prefix}
      {enableCountUp ? countUp : format(value, decimals)} {suffix}
    </Text>
  )
}

export default CardValue
