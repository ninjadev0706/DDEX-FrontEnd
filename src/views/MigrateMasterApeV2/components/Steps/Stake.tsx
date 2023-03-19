/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { wrappedToNative } from 'utils'
import React from 'react'
import StatusIcons from '../StatusIcons'
import useStakeAll from '../../hooks/useStakeAll'
import useIsMobile from 'hooks/useIsMobile'
import { Link } from 'react-router-dom'
import { useMigrateMaximizer, useMigrateStatus } from 'state/masterApeMigration/hooks'
import { MasterApeV2ProductsInterface, MigrateStatus } from 'state/masterApeMigration/types'
const Stake: React.FC<{ apeswapWalletLps: MasterApeV2ProductsInterface[]; allStepsComplete: boolean }> = ({
  apeswapWalletLps,
  allStepsComplete,
}) => {
  const migrateLpStatus = useMigrateStatus()
  const migrateMaximizers = useMigrateMaximizer()
  const isMobile = useIsMobile()
  const handleStakeAll = useStakeAll()
  const { t } = useTranslation()

  // Filter LPs that have been approved
  const filteredLpsForStake = apeswapWalletLps?.filter(
    ({ id }) => migrateLpStatus?.find((status) => status.id === id)?.status.approveStake === MigrateStatus.COMPLETE,
  )

  const listView = filteredLpsForStake?.map(({ walletBalance, id, singleStakeAsset, farm, vault }) => {
    const { token0, token1 } = migrateMaximizers && vault ? vault : farm
    const status = migrateLpStatus?.find((status) => status.id === id)
    return {
      beforeTokenContent: <StatusIcons id={id} migrateLpStatus={migrateLpStatus} />,
      tokens: singleStakeAsset ? { token1: token0.symbol } : { token1: token0.symbol, token2: token1.symbol },
      backgroundColor: 'white3',
      expandedContentSize: 70,
      titleContainerWidth: 350,
      stakeLp: true,
      title: singleStakeAsset ? token0.symbol : `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      noEarnToken: true,
      forMigrationList: true,
      id: id,
      cardContent: !isMobile ? (
        <>
          <ListViewContent title={t('Wallet')} value={walletBalance?.slice(0, 8) || '0'} ml={20} />
          <ListViewContent title={t('Staked')} value="0" ml={20} />
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
          <ListViewContent title={t('Wallet')} value={walletBalance?.slice(0, 8) || '0'} ml={20} />
          <ListViewContent title={t('Staked')} value="0" ml={20} />
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Text size="22px" weight={700} mb="15px">
        {!allStepsComplete ? t('Stake') : t('Completed!')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {!allStepsComplete
          ? t('Stake all tokens using the MasterApe v2 smart contracts')
          : t('Migration completed! Thank you.')}
      </Text>
      {!allStepsComplete ? (
        <Button
          mb="20px"
          onClick={() => handleStakeAll(filteredLpsForStake)}
          disabled={filteredLpsForStake?.length === 0}
        >
          {t('Stake All')} ({filteredLpsForStake.length})
        </Button>
      ) : (
        <Button mb="20px" as={Link} to={'/farms'}>
          {t('Go to Farms')}
        </Button>
      )}
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(Stake)
