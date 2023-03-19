/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { wrappedToNative } from 'utils'
import useUnstakeAll from '../../hooks/useUnstakeAll'
import StatusIcons from '../StatusIcons'
import useIsMobile from 'hooks/useIsMobile'
import { useMigrateStatus } from 'state/masterApeMigration/hooks'
import { MasterApeProductsInterface } from 'state/masterApeMigration/types'

const Unstake: React.FC<{ migrateList: MasterApeProductsInterface[] }> = ({ migrateList }) => {
  const { t } = useTranslation()
  const migrateLpStatus = useMigrateStatus()
  const handleUnstakeAll = useUnstakeAll()
  const isMobile = useIsMobile()
  const listView = migrateList?.map(({ token0, token1, id, stakedAmount, walletBalance, singleStakeAsset, pid }) => {
    const status = migrateLpStatus?.find((status) => status.id === id)
    const formattedWalletBalance = walletBalance?.substring(0, 8)
    const formattedStakedBalanceBalance = stakedAmount?.substring(0, 8)

    return {
      beforeTokenContent: <StatusIcons id={id} migrateLpStatus={migrateLpStatus} />,
      tokens: singleStakeAsset ? { token1: token0.symbol } : { token1: token0.symbol, token2: token1.symbol },
      titleContainerWidth: 350,
      expandedContentSize: 70,
      stakeLp: true,
      backgroundColor: 'white3',
      title: singleStakeAsset ? token0.symbol : `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      noEarnToken: true,
      forMigrationList: true,
      id: id,
      cardContent: !isMobile ? (
        <>
          <ListViewContent title={t('Staked')} value={formattedStakedBalanceBalance || '0'} ml={20} width={130} />
          <ListViewContent title={t('Wallet')} value={formattedWalletBalance || '0'} ml={20} width={170} />
          <ListViewContent title={t('Status')} value={status?.statusText || ''} ml={20} width={225} />
        </>
      ) : (
        <Flex sx={{ width: '100%', height: '30px', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
          <Text size="11px" weight={500}>
            {/* <span sx={{ opacity: '.7' }}>Status:</span> {status?.statusText || ''} */}
            <span>Status:</span> {status?.statusText || ''}
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
        {t('Unstake')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t('Unstake all tokens from the MasterApe v1 smart contracts')}
      </Text>
      <Button mb="20px" onClick={() => handleUnstakeAll(migrateList)} disabled={migrateList?.length === 0}>
        {t('Unstake All')} ({migrateList?.length})
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default Unstake
