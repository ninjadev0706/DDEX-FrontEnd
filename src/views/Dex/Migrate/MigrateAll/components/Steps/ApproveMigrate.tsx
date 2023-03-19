/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { wrappedToNative } from 'utils'
import React from 'react'
import StatusIcons from '../StatusIcons'
import { useMigrateAll } from '../../provider'
import useMigrateApproveAll from '../../hooks/useMigrateApproveAll'
import useIsMobile from 'hooks/useIsMobile'
import { MigrateStatus } from '../../provider/types'

const ApproveMigrate: React.FC<{
  migrateList: MigrateResult[]
}> = ({ migrateList }) => {
  const { t } = useTranslation()
  const { migrateLpStatus } = useMigrateAll()
  const isMobile = useIsMobile()
  const handleApproveAll = useMigrateApproveAll()
  const filteredLps = migrateList?.filter(
    (lp) =>
      migrateLpStatus?.find((status) => status.lpAddress === lp.lpAddress)?.status.approveMigrate !==
      MigrateStatus.COMPLETE,
  )
  const listView = filteredLps?.map((migrate) => {
    const { token0, token1, lpAddress, walletBalance, id } = migrate
    const status = migrateLpStatus?.find((status) => status.id === id)
    const formattedWalletBalance = walletBalance?.substring(0, 8)
    return {
      beforeTokenContent: <StatusIcons id={id} />,
      tokens: { token1: token0.symbol, token2: token1.symbol },
      titleContainerWidth: 350,
      expandedContentSize: 70,
      backgroundColor: 'white3',
      stakeLp: true,
      title: `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      noEarnToken: true,
      forMigrationList: true,
      id: lpAddress,
      cardContent: !isMobile ? (
        <>
          <ListViewContent title={t('LP To Maigrate')} value={formattedWalletBalance} ml={20} />
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} width={300} />
        </>
      ) : (
        <Flex sx={{ width: '100%', height: '30px', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
          <Text size="11px" weight={500}>
            <span>Status:</span> {status?.statusText || ''}
            {/* <span sx={{ opacity: '.7' }}>Status:</span> {status?.statusText || ''} */}
          </Text>
        </Flex>
      ),
      expandedContent: isMobile && (
        <>
          <ListViewContent title={t('LP To Maigrate')} value={formattedWalletBalance} ml={20} />
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Text size="22px" weight={700} mb="15px">
        {t('Approve All LPs to Migrate')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t('Approve the migration contract to allow ApeSwap to zap your LPs into ApeSwap LPs.')}
      </Text>
      <Button mb="20px" onClick={() => handleApproveAll(filteredLps)}>
        Approve All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(ApproveMigrate)
