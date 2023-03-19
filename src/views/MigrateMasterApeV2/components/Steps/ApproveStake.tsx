/** @jsxImportSource theme-ui */
import { Button, Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { wrappedToNative } from 'utils'
import React from 'react'
import { Switch } from 'theme-ui'
import StatusIcons from '../StatusIcons'
import useStakeApproveAll from '../../hooks/useStakeApproveAll'
import useIsMobile from 'hooks/useIsMobile'
import { useMigrateMaximizer, useMigrateStatus } from 'state/masterApeMigration/hooks'
import { MasterApeV2ProductsInterface, MigrateStatus } from 'state/masterApeMigration/types'
import { useAppDispatch } from 'state'
import { setToggleMaximizer } from 'state/masterApeMigration/reducer'

const ApproveStake: React.FC<{ apeswapWalletLps: MasterApeV2ProductsInterface[] }> = ({ apeswapWalletLps }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const dispatch = useAppDispatch()
  const migrateMaximizers = useMigrateMaximizer()
  const migrateLpStatus = useMigrateStatus()
  const handleApproveAll = useStakeApproveAll()

  // Filter LPs that have been approved
  const filteredLpsForStake = apeswapWalletLps?.filter(
    ({ id }) => migrateLpStatus?.find((status) => status.id === id)?.status.approveStake !== MigrateStatus.COMPLETE,
  )
  const listView = filteredLpsForStake?.map(({ walletBalance, lp, farm, vault, id, singleStakeAsset }) => {
    const { token0, token1 } = migrateMaximizers && vault ? vault : farm
    const status = migrateLpStatus?.find((status) => status.id === id)
    return {
      beforeTokenContent: <StatusIcons id={id} migrateLpStatus={migrateLpStatus} />,
      tokens: singleStakeAsset ? { token1: token0.symbol } : { token1: token0.symbol, token2: token1.symbol },
      titleContainerWidth: 350,
      stakeLp: true,
      backgroundColor: 'white3',
      title: singleStakeAsset ? token0.symbol : `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      expandedContentSize: 70,
      noEarnToken: true,
      forMigrationList: true,
      id: id,
      cardContent: !isMobile ? (
        <>
          <ListViewContent title={t('Wallet')} value={walletBalance.slice(0, 8) || '0'} ml={20} />
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
          <ListViewContent title={t('Wallet')} value={walletBalance.slice(0, 8) || '0'} ml={20} />
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
        {t('Approve')}
      </Text>
      <Text size="12px" weight={500} mb="5px">
        {t('Approve the MasterApe v2 smart contracts')}
      </Text>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-around',
          mb: '15px',
          width: 'fit-content',
        }}
      >
        <Text size="14px" weight={500} mr="5px">
          {t('Migrate to maximizers?')}
        </Text>
        <TooltipBubble
          placement="topRight"
          body={t('Migrate to Maximizer Vaults as long as your assets have a corresponding Vault')}
          transformTip="translate(9%, 0%)"
          width="250px"
        >
          <Svg icon="question" width="15px" />
        </TooltipBubble>
        <Flex sx={{ ml: '10px' }}>
          <Switch
            sx={{
              borderRadius: '8px',
              backgroundColor: 'white4',
              'input:checked ~ &': {
                backgroundColor: 'yellow',
              },
            }}
            checked={migrateMaximizers}
            onChange={() => dispatch(setToggleMaximizer(migrateMaximizers))}
          />
        </Flex>
      </Flex>
      <Button
        disabled={filteredLpsForStake?.length === 0}
        mb="20px"
        onClick={() => handleApproveAll(filteredLpsForStake)}
      >
        {t('Approve All')} ({filteredLpsForStake?.length})
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(ApproveStake)
