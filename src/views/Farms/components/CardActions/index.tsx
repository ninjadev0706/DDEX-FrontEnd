/** @jsxImportSource theme-ui */
import React from 'react'
import BigNumber from 'bignumber.js'
import StakeAction from './StakeActions'
import { Flex } from '@ape.swap/uikit'
import { styles } from '../styles'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'

interface CardActionProps {
  allowance: string
  stakingTokenBalance: string
  stakedBalance: string
  lpValueUsd: number
  stakeLpAddress: string
  pid: number
  v2Flag: boolean
}

const CardActions: React.FC<CardActionProps> = ({
  allowance,
  stakingTokenBalance,
  stakedBalance,
  lpValueUsd,
  stakeLpAddress,
  pid,
  v2Flag,
}) => {
  const rawStakedBalance = getBalanceNumber(new BigNumber(stakedBalance))
  const { t } = useTranslation()
  const userStakedBalanceUsd = `$${(getBalanceNumber(new BigNumber(stakedBalance || 0)) * lpValueUsd).toFixed(2)}`

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
        <StakeAction
          stakedBalance={stakedBalance}
          stakingTokenBalance={stakingTokenBalance}
          lpValueUsd={lpValueUsd}
          pid={pid}
          allowance={allowance}
          stakeLpAddress={stakeLpAddress}
          v2Flag={v2Flag}
        />
      </Flex>
    </Flex>
  )
}

export default React.memo(CardActions)
