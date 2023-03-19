/** @jsxImportSource theme-ui */
import React from 'react'
import StakeAction from './StakeActions'
import { DualFarm } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { Flex } from '@ape.swap/uikit'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { styles } from '../styles'

interface CardActionProps {
  lpValueUsd: number
  farm: DualFarm
}

const CardActions: React.FC<CardActionProps> = ({ lpValueUsd, farm }) => {
  const stakedBalance = farm?.userData?.stakedBalance?.toString()
  const rawStakedBalance = getBalanceNumber(new BigNumber(stakedBalance))
  const userStakedBalanceUsd = `$${(getBalanceNumber(new BigNumber(stakedBalance || 0)) * lpValueUsd).toFixed(2)}`
  const { t } = useTranslation()

  return (
    <Flex sx={styles.actionContainer}>
      <ListViewContent
        title={t('Staked')}
        value={`${rawStakedBalance ? rawStakedBalance.toFixed(6) : '0.000'} LP`}
        value2={userStakedBalanceUsd}
        value2Secondary
        value2Direction="column"
        style={styles.columnView}
      />
      <Flex sx={styles.depositContainer}>
        <StakeAction lpValueUsd={lpValueUsd} farm={farm} />
      </Flex>
    </Flex>
  )
}

export default React.memo(CardActions)
