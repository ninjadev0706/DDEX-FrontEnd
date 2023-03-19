/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import useCurrentTime from 'hooks/useTimer'
import React from 'react'
import { useMigrationTimes } from 'state/migrationTimer/hooks'
import getTimePeriods from 'utils/getTimePeriods'

const MigrateTimer = () => {
  const currentTime = useCurrentTime()
  const migrateTimes = useMigrationTimes()
  const { t } = useTranslation()
  const phase2 = getTimePeriods(migrateTimes.migrate_phase_2 - currentTime / 1000)

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        '@media screen and (min-width: 1130px)': { minWidth: '350px' },
      }}
    >
      <Text
        size="2.5vw"
        sx={{
          lineHeight: 4,
          '@media screen and (min-width: 1130px)': {
            fontSize: '20px',
            lineHeight: 5,
          },
        }}
      >
        {t('Time Until Migration')}
      </Text>
      <Text
        size="3.5vw"
        sx={{
          lineHeight: 0,
          width: 'fit-content',
          '@media screen and (min-width: 1130px)': {
            fontSize: '45px',
          },
        }}
      >
        {phase2.seconds < 0
          ? 'Migration Live!'
          : `${phase2?.days}d ${phase2?.hours}h ${phase2?.minutes}m ${phase2?.seconds.toFixed(0)}s`}
      </Text>
    </Flex>
  )
}

export default MigrateTimer
