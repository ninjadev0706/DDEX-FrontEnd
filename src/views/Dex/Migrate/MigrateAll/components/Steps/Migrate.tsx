/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { wrappedToNative } from 'utils'
import React from 'react'
import { Pair, TokenAmount } from '@ape.swap/sdk'
import StatusIcons from '../StatusIcons'
import { useMigrateAll } from '../../provider'
import useMigrateAllLps from '../../hooks/useMigrateAll'
import useIsMobile from 'hooks/useIsMobile'
import { MigrateStatus } from '../../provider/types'

const Migrate: React.FC<{ migrateList: MigrateResult[]; apeswapWalletLps: { pair: Pair; balance: TokenAmount }[] }> = ({
  migrateList,
  apeswapWalletLps,
}) => {
  const { t } = useTranslation()
  const { migrateLpStatus } = useMigrateAll()
  const isMobile = useIsMobile()
  const handleMigrateAll = useMigrateAllLps()
  const filteredLps = migrateList?.filter(
    (lp) =>
      migrateLpStatus?.find((status) => status.lpAddress === lp.lpAddress)?.status.approveMigrate ===
      MigrateStatus.COMPLETE,
  )
  const listView = filteredLps?.map((migrate) => {
    const { token0, token1, lpAddress, walletBalance, id } = migrate
    const status = migrateLpStatus?.find((status) => status.id === id)
    const matchedApeLps = apeswapWalletLps?.find(
      ({ pair }) => pair.token0.address === token0.address && pair.token1.address === token1.address,
    )
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
          <ListViewContent title={t('Ape LP')} value={matchedApeLps?.balance?.toSignificant(6) || '0'} ml={20} />
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} width={250} />
        </>
      ) : (
        <Flex sx={{ width: '100%', height: '32.5px', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Text size="11px" weight={500} sx={{ lineHeight: '13px' }}>
            <span>Status:</span> {status?.statusText || ''}
            {/* <span sx={{ opacity: '.7' }}>Status:</span> {status?.statusText || ''} */}
          </Text>
        </Flex>
      ),
      expandedContent: isMobile && (
        <>
          <ListViewContent title={t('LP To Maigrate')} value={formattedWalletBalance} ml={20} />
          <ListViewContent title={t('Ape LP')} value={matchedApeLps?.balance?.toSignificant(6) || '0'} ml={20} />
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Text size="22px" weight={700} mb="15px">
        {t('Migrate All LPs')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t(
          'Migrate all of your newly unstaked LPs from other protocols over to ApeSwap. By default, slippage is set to 5%',
        )}
      </Text>
      <Button mb="20px" onClick={() => handleMigrateAll(migrateList)}>
        Migrate All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(Migrate)
