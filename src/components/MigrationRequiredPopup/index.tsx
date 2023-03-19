/** @jsxImportSource theme-ui */
import { Button, Flex, Svg, Text } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useIsMobile from 'hooks/useIsMobile'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMigrationPhase } from 'state/migrationTimer/hooks'
import { MigrationPhases } from 'state/migrationTimer/types'
import { CURRENT_MIGRATE_PATH } from 'components/Menu/chains/bscConfig'
import { useTranslation } from 'contexts/Localization'
import { Farm, Vault } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'

const MigrationRequiredPopup = ({
  v2Farms,
  farms,
  vaults,
  homepage,
  hasPositionsToMigrate,
}: {
  v2Farms: Farm[]
  farms: Farm[]
  vaults: Vault[]
  homepage?: boolean
  hasPositionsToMigrate?: boolean
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const currentPhase = useMigrationPhase()
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  // Filter out farms that do not exists on v2Farms
  const filteredFarms = farms?.filter(({ lpAddresses }) => {
    return v2Farms?.find(({ lpAddresses: lpAddressesV2 }) => {
      return lpAddressesV2[chainId]?.toLowerCase() === lpAddresses[chainId]?.toLowerCase()
    })
  })
  const filteredVaults = vaults?.filter(({ stakeToken }) => {
    return v2Farms?.find(({ lpAddresses }) => {
      return lpAddresses[chainId]?.toLowerCase() === stakeToken?.address[chainId]?.toLowerCase()
    })
  })

  const stakedVaults = filteredVaults.filter((product) => new BigNumber(product?.userData?.stakedBalance).gt(0))

  // Filter out dust left in vaults
  const filterV1Dust = stakedVaults.flatMap((vault) => {
    if (vault.pid === 22) {
      if (new BigNumber(getBalanceNumber(new BigNumber(vault.userData.stakedBalance))).gt(0.5)) {
        return vault
      } else {
        return []
      }
    }
    if (new BigNumber(getBalanceNumber(new BigNumber(vault.userData.stakedBalance)) * vault.stakeTokenPrice).gt(0.25)) {
      return vault
    } else {
      return []
    }
  })

  const userHasFarmOrVault =
    hasPositionsToMigrate ||
    [...filteredFarms, ...filterV1Dust].filter((product) => new BigNumber(product?.userData?.stakedBalance).gt(0))
      ?.length > 0

  const [open, setOpen] = useState(true)
  const onMigration = pathname.includes(CURRENT_MIGRATE_PATH)
  const notOnFarmsPoolsVaults =
    !pathname.includes('/pools') &&
    !pathname.includes('/farms') &&
    !pathname.includes('/maximizers') &&
    !pathname.includes(CURRENT_MIGRATE_PATH)

  const migrationReminder = JSON.parse(localStorage.getItem('migrationReminder') ?? 'true')

  return homepage ? (
    migrationReminder && notOnFarmsPoolsVaults && currentPhase === MigrationPhases.MIGRATE_PHASE_2 ? (
      <Flex
        sx={{
          position: 'fixed',
          flexDirection: 'column',
          padding: isMobile ? '10px' : '15px',
          maxWidth: '400px',
          alignSelf: 'center',
          top: 100,
          right: isMobile ? 'auto' : 50,
          margin: isMobile ? '0px 5px' : 'auto',
          background: 'white3',
          borderRadius: '10px',
          zIndex: 999,
        }}
        key="migrateReminder"
        id="migrateReminder"
      >
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Flex>
            <Svg icon="info" width={20} />
            <Text size="22px" weight={700} ml="10px">
              Migration Underway
            </Text>
          </Flex>
          <Text
            weight={500}
            size="20px"
            sx={{ cursor: 'pointer' }}
            onClick={() => localStorage.setItem('migrationReminder', 'false')}
          >
            x
          </Text>
        </Flex>
        <Flex sx={{ margin: '15px 0px', flexDirection: 'column', alignSelf: 'center' }}>
          <Text size="14px" weight={400} sx={{ lineHeight: 1.35 }}>
            Users staking on BNB Chain Yield Farms, BANANA Maximizers, and the BANANA-BANANA Staking Pool must migrate
            their staked tokens in order to continue earning rewards. All other chains and services are not affected.
          </Text>
          <br />
          <Text size="14px" weight={400} sx={{ lineHeight: 1.35 }}>
            {t('Please visit our Migration page to migrate your tokens or learn more.')}
          </Text>
        </Flex>
        <Flex>
          <Button fullWidth mr="5px" as={Link} to={CURRENT_MIGRATE_PATH} onClick={() => setOpen(false)}>
            {t('Migrate')}
          </Button>
          <a
            href="https://ape-swap.medium.com/apeswap-upgrades-contracts-to-implement-hard-cap-88de5e5f4c94"
            target="_blank"
            rel="noreferrer noopener"
            // sx={{ width: '100%' }}
          >
            <Button fullWidth ml="5px" sx={{ background: 'transparent', color: 'yellow' }}>
              {t('Learn More')}
            </Button>
          </a>
        </Flex>
      </Flex>
    ) : (
      <></>
    )
  ) : open && !onMigration && userHasFarmOrVault && currentPhase !== MigrationPhases.MIGRATE_PHASE_0 ? (
    <Flex
      sx={{
        position: 'fixed',
        flexDirection: 'column',
        padding: isMobile ? '10px' : '15px',
        maxWidth: '400px',
        alignSelf: 'center',
        top: 50,
        right: isMobile ? 'auto' : 50,
        margin: isMobile ? '0px 5px' : 'auto',
        background: 'white3',
        borderRadius: '10px',
        zIndex: 999,
      }}
      key="migrateNotice"
      id="migrateNotice"
    >
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Flex>
          <Svg icon="info" width={20} />
          <Text size="22px" weight={700} ml="10px">
            {currentPhase === MigrationPhases.MIGRATE_PHASE_2 ? 'Migration Required' : 'Migration Starting Soon'}
          </Text>
        </Flex>
        <Text weight={500} size="20px" sx={{ cursor: 'pointer' }} onClick={() => setOpen(false)}>
          x
        </Text>
      </Flex>
      <Flex sx={{ margin: '15px 0px', flexDirection: 'column', alignSelf: 'center' }}>
        <Text size="14px" weight={400} sx={{ lineHeight: 1.35 }}>
          {t(`In order to continue earning rewards on your staked tokens, you must migrate them to the new MasterApe v2
            contract. The current MasterApe v1 contract will no longer grant rewards as of January 26th, 22:00 UTC`)}
        </Text>
        <Text size="14px" weight={400} sx={{ lineHeight: 1.35 }}>
          {t('Please visit our Migration page to migrate your tokens or learn more.')}
        </Text>
      </Flex>
      <Flex>
        <Button fullWidth mr="5px" as={Link} to={CURRENT_MIGRATE_PATH} onClick={() => setOpen(false)}>
          {t('Migrate')}
        </Button>
        <a
          href="https://ape-swap.medium.com/apeswap-upgrades-contracts-to-implement-hard-cap-88de5e5f4c94"
          target="_blank"
          rel="noreferrer noopener"
          // sx={{ width: '100%' }}
        >
          <Button fullWidth ml="5px" sx={{ background: 'transparent', color: 'yellow' }}>
            {t('Learn More')}
          </Button>
        </a>
      </Flex>
    </Flex>
  ) : (
    <></>
  )
}

export default MigrationRequiredPopup
