/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { JungleFarm } from 'state/types'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { styles } from '../styles'
import StakeActions from './StakeActions'

interface StakeActionsProps {
  farm: JungleFarm
}

const Actions: React.FC<StakeActionsProps> = ({ farm }) => {
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(farm?.userData?.stakedBalance)
  const userStakedBalanceUsd = `$${(
    getBalanceNumber(farm?.userData?.stakedBalance || new BigNumber(0)) * farm?.stakingToken?.price
  ).toFixed(2)}`

  return (
    <Flex sx={styles.actionContainer}>
      <ListViewContent
        title={`${t('Staked')}`}
        value={
          rawStakedBalance > 0
            ? rawStakedBalance.toFixed(2) === '0.00'
              ? '> 0 LP'
              : `${rawStakedBalance.toFixed(2)} LP`
            : '0.00 LP'
        }
        value2={userStakedBalanceUsd}
        value2Secondary
        value2Direction="column"
        style={styles.columnView}
      />
      <Flex sx={styles.depositContainer}>
        <StakeActions farm={farm} />
      </Flex>
    </Flex>
  )
}

export default React.memo(Actions)
