/** @jsxImportSource theme-ui */
import React from 'react'
import { Svg } from '@ape.swap/uikit'
import { IconButton, useModal } from '@ape.swap/uikit'
import RoiCalculatorModal from './RoiCalculatorModal'
import styles from './styles'

export interface CalcButtonProps {
  label?: string
  rewardTokenName?: string
  rewardTokenPrice?: number
  apr?: number
  lpApr?: number
  apy?: number
  lpAddress?: string
  tokenAddress?: string
  quoteTokenAddress?: string
  isLp?: boolean
  liquidityUrl?: string
  lpPrice?: number
  lpCurr1?: string
  lpCurr2?: string
}

const CalcButton: React.FC<CalcButtonProps> = (props) => {
  const { apr } = props
  const [onPresentCalcModal] = useModal(<RoiCalculatorModal {...props} />)

  return (
    <IconButton variant="transparent" onClick={onPresentCalcModal} disabled={!apr} sx={styles.apyButton}>
      <Svg icon="calculator" color="yellow" />
    </IconButton>
  )
}

export default React.memo(CalcButton)
