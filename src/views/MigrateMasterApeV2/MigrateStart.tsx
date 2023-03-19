/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxImportSource theme-ui */
import { Button, Flex, Text, useModal } from '@ape.swap/uikit'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useIsMigrationLoading, useMigrateCompletionLog, useMigrateStatus } from 'state/masterApeMigration/hooks'
import { MigrateStatus } from 'state/masterApeMigration/types'
import LoadingYourMigration from './components/LoadingYourMigration'
import MigrateProgress from './components/MigrateProgress'
import Steps from './components/Steps'
import SuccessfulMigrationModal from './components/SuccessfulMigrationModal'

const MigrateStart: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const migrationCompleteLog = useMigrateCompletionLog()
  const { allDataLoaded: migrationLoaded } = useIsMigrationLoading()
  const migrateLpStatus = useMigrateStatus()
  const allStepsComplete =
    migrateLpStatus?.flatMap((item) =>
      Object.entries(item.status).filter(([, status]) => {
        return status !== MigrateStatus.COMPLETE
      }),
    ).length === 0

  const [onPresentSuccessfulMigrationModal] = useModal(
    <SuccessfulMigrationModal migrationCompleteLog={migrationCompleteLog} />,
    true,
    true,
    'SuccessfulMigrationModal',
  )
  useEffect(() => {
    if (allStepsComplete && migrationCompleteLog.length > 0) {
      onPresentSuccessfulMigrationModal()
    }
  }, [allStepsComplete, migrationCompleteLog.length])
  return (
    <>
      <MigrateProgress>
        {account ? (
          !migrationLoaded ? (
            <LoadingYourMigration />
          ) : migrateLpStatus.length !== 0 ? (
            <Steps allStepsComplete={allStepsComplete} />
          ) : (
            <Flex sx={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
              <Text size="26px" weight={700}>
                {t('You have nothing to migrate')}
              </Text>
              <Button to="/" as={Link} mt="20px">
                {t('Return To Home')}
              </Button>
            </Flex>
          )
        ) : (
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <UnlockButton />
          </Flex>
        )}
      </MigrateProgress>
    </>
  )
}

export default React.memo(MigrateStart)
