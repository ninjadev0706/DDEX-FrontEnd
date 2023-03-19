/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { wrappedToNative } from 'utils'
import { useMigrateAll } from '../../provider'
import useUnstakeAll from '../../hooks/useUnstakeAll'
import StatusIcons from '../StatusIcons'
import useIsMobile from 'hooks/useIsMobile'

const Unstake: React.FC<{ migrateList: MigrateResult[] }> = ({ migrateList }) => {
  const { t } = useTranslation()
  const { migrateLpStatus } = useMigrateAll()
  const handleUnstakeAll = useUnstakeAll()
  const isMobile = useIsMobile()
  const listView = migrateList?.map((migrate) => {
    const { token0, token1, lpAddress, stakedBalance, walletBalance, id } = migrate
    const status = migrateLpStatus?.find((status) => status.id === id)
    const formattedWalletBalance = walletBalance?.substring(0, 8)
    const formattedStakedBalanceBalance = stakedBalance?.substring(0, 8)

    return {
      beforeTokenContent: <StatusIcons id={id} />,
      tokens: { token1: token0.symbol, token2: token1.symbol },
      titleContainerWidth: 350,
      expandedContentSize: 70,
      stakeLp: true,
      backgroundColor: 'white3',
      title: `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      noEarnToken: true,
      forMigrationList: true,
      id: lpAddress,
      cardContent: !isMobile ? (
        <>
          <ListViewContent title={t('Staked')} value={formattedStakedBalanceBalance || '0'} ml={20} width={130} />
          <ListViewContent title={t('Wallet')} value={formattedWalletBalance || '0'} ml={20} width={170} />
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} width={225} />
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
          <ListViewContent title={t('Staked')} value={formattedStakedBalanceBalance || '0'} ml={20} />
          <ListViewContent title={t('Wallet')} value={formattedWalletBalance || '0'} ml={20} width={125} />
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Text size="22px" weight={700} mb="15px">
        {t('Unstake All LPs')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t('Unstake LPs currently held in other protocols to free them up for staking at ApeSwap.')}
      </Text>
      <Button mb="20px" onClick={() => handleUnstakeAll(migrateList)}>
        Unstake All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default Unstake
