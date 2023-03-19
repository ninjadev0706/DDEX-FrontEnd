/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { wrappedToNative } from 'utils'
import React from 'react'
import { Switch } from 'theme-ui'
import StatusIcons from '../StatusIcons'
import { useMigrateAll } from '../../provider'
import useStakeApproveAll from '../../hooks/useStakeApproveAll'
import useIsMobile from 'hooks/useIsMobile'
import { ApeswapWalletLpInterface, MigrateStatus } from '../../provider/types'

const ApproveStake: React.FC<{ apeswapWalletLps: ApeswapWalletLpInterface[] }> = ({ apeswapWalletLps }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const { migrateLpStatus, migrateMaximizers, handleMaximizerApprovalToggle } = useMigrateAll()
  const handleApproveAll = useStakeApproveAll()

  // Filter LPs that have been approved
  const filteredLpsForStake = apeswapWalletLps?.filter(
    ({ id }) => migrateLpStatus?.find((status) => status.id === id)?.status.approveStake !== MigrateStatus.COMPLETE,
  )

  const listView = filteredLpsForStake?.map((apeLp) => {
    const { pair, balance, id } = apeLp
    const { token0, token1, liquidityToken } = pair
    const { address: lpAddress } = liquidityToken
    const status = migrateLpStatus?.find((status) => status.id === id)
    return {
      beforeTokenContent: <StatusIcons id={id} />,
      tokens: { token1: token0.symbol, token2: token1.symbol },
      titleContainerWidth: 350,
      stakeLp: true,
      backgroundColor: 'white3',
      title: `${wrappedToNative(token0.symbol)} - ${wrappedToNative(token1.symbol)}`,
      expandedContentSize: 70,
      noEarnToken: true,
      forMigrationList: true,
      id: lpAddress,
      cardContent: !isMobile ? (
        <>
          <ListViewContent title={t('Wallet')} value={balance?.toSignificant(6) || '0'} ml={20} />
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
          <ListViewContent title={t('Wallet')} value={balance?.toSignificant(6) || '0'} ml={20} />
          <ListViewContent title={t('Staked')} value="0" ml={20} />
        </>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Text size="22px" weight={700} mb="15px">
        {t('Approve All LPs')}
      </Text>
      <Text size="12px" weight={500} mb="15px">
        {t('Approve the contracts of the ApeSwap products that will accept your migrated LPs.')}
      </Text>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-around',
          mb: '15px',
          width: 'fit-content',
        }}
      >
        <Text size="14px" weight={500} mr="10px">
          {t('Migrate to maximizers?')}
        </Text>
        <Flex>
          <Switch
            sx={{
              borderRadius: '8px',
              backgroundColor: 'white4',
              'input:checked ~ &': {
                backgroundColor: 'yellow',
              },
            }}
            checked={migrateMaximizers}
            onChange={() => handleMaximizerApprovalToggle(apeswapWalletLps, !migrateMaximizers)}
          />
        </Flex>
      </Flex>
      <Button mb="20px" onClick={() => handleApproveAll(filteredLpsForStake)}>
        Approve All
      </Button>
      <ListView listViews={listView} />
    </Flex>
  )
}

export default React.memo(ApproveStake)
