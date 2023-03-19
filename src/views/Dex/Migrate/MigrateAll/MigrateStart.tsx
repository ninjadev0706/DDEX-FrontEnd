/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxImportSource theme-ui */
import { Button, Flex, Text, useModal } from '@ape.swap/uikit'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoadingYourMigration from './components/LoadingYourMigration'
import MigrateProgress from './components/MigrateProgress'
import Steps from './components/Steps'
import SuccessfulMigrationModal from './components/SuccessfulMigrationModal'
import { useMigrateAll } from './provider'
import { MigrateStatus } from './provider/types'

const MigrateStart: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { migrationLoading, migrationCompleteLog, migrateLpStatus } = useMigrateAll()
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
      {account ? (
        migrationLoading ? (
          <LoadingYourMigration />
        ) : migrateLpStatus.length !== 0 ? (
          <MigrateProgress>
            <Steps />
          </MigrateProgress>
        ) : (
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Text size="26px" weight={700}>
              You have nothing to migrate
            </Text>
            <Button to="/swap" as={Link} mt="20px">
              Return Back To Swap
            </Button>
          </Flex>
        )
      ) : (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <UnlockButton />
        </Flex>
      )}
    </>
  )
}

export default React.memo(MigrateStart)
