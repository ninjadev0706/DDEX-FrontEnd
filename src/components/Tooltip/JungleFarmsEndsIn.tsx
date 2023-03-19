/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, Text } from '@ape.swap/uikit'
import { JungleFarm } from 'state/types'
import { useBlock } from 'state/block/hooks'
import useCurrentTime from 'hooks/useTimer'
import getTimePeriods from 'utils/getTimePeriods'
import { BSC_BLOCK_TIME } from 'config'
import { styles } from './styles'

const JungleFarmsEndsIn: React.FC<{ farm: JungleFarm }> = ({ farm }) => {
  const { currentBlock } = useBlock()
  const currentTime = useCurrentTime()
  const timeUntilStart = farm?.rewardsPerSecond
    ? getTimePeriods(Math.max(farm?.startBlock - currentTime / 1000, 0), true)
    : getTimePeriods(Math.max(farm?.startBlock - currentBlock, 0) * BSC_BLOCK_TIME, true)
  const timeUntilEnd = farm?.rewardsPerSecond
    ? getTimePeriods(Math.max(farm?.endBlock - currentTime / 1000, 0), true)
    : getTimePeriods(Math.max(farm?.endBlock - currentBlock, 0) * BSC_BLOCK_TIME, true)

  return (
    <Flex sx={{ mt: '5px' }}>
      {farm?.endBlock > 0 && farm?.rewardToken?.symbol !== 'BANANA' && (
        <Flex sx={styles.infoRow}>
          {farm?.rewardsPerSecond ? (
            <Text sx={styles.titleText}>{farm?.startBlock > currentTime / 1000 ? 'Starts in' : 'Ends in'}:</Text>
          ) : (
            <Text sx={styles.titleText}>{farm?.startBlock > currentBlock ? 'Starts in' : 'Ends in'}:</Text>
          )}
          {farm?.rewardsPerSecond ? (
            <Text sx={styles.contentText}>
              {farm?.startBlock > currentTime / 1000
                ? `${timeUntilStart.days}d, ${timeUntilStart.hours}h, ${timeUntilStart.minutes}m`
                : `${timeUntilEnd.days}d, ${timeUntilEnd.hours}h, ${timeUntilEnd.minutes}m`}
            </Text>
          ) : (
            <Text sx={styles.contentText}>
              {farm?.startBlock > currentBlock
                ? `${timeUntilStart.days}d, ${timeUntilStart.hours}h, ${timeUntilStart.minutes}m`
                : `${timeUntilEnd.days}d, ${timeUntilEnd.hours}h, ${timeUntilEnd.minutes}m`}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  )
}

export default JungleFarmsEndsIn
