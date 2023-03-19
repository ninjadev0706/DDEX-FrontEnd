/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, Text } from '@ape.swap/uikit'
import { Pool } from 'state/types'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import getTimePeriods from 'utils/getTimePeriods'
import { BSC_BLOCK_TIME } from 'config'
import { useTranslation } from 'contexts/Localization'
import { styles } from './styles'

const PoolsEndsIn: React.FC<{ pool: Pool }> = ({ pool }) => {
  const currentBlock = useBlockNumber()
  const { t } = useTranslation()
  const timeUntilStart = getTimePeriods(Math.max(pool?.startBlock - currentBlock, 0) * BSC_BLOCK_TIME, true)
  const timeUntilEnd = getTimePeriods(Math.max(pool?.endBlock - currentBlock, 0) * BSC_BLOCK_TIME, true)
  return (
    <Flex sx={{ mt: '5px' }}>
      {pool?.endBlock > 0 && pool?.rewardToken?.symbol !== 'BANANA' && (
        <Flex sx={styles.infoRow}>
          <Text sx={styles.titleText}>{pool?.startBlock > currentBlock ? t('Starts in') : t('Ends in')}:</Text>
          <Text sx={styles.contentText}>
            {pool?.startBlock > currentBlock
              ? `${timeUntilStart.days}d, ${timeUntilStart.hours}h, ${timeUntilStart.minutes}m`
              : `${timeUntilEnd.days}d, ${timeUntilEnd.hours}h, ${timeUntilEnd.minutes}m`}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default React.memo(PoolsEndsIn)
