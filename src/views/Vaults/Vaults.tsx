/** @jsxImportSource theme-ui */
import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Flex } from '@ape.swap/uikit'
import orderBy from 'lodash/orderBy'
import { useTranslation } from 'contexts/Localization'
import Banner from 'components/Banner'
import partition from 'lodash/partition'
import { useFetchFarmLpAprs } from 'state/hooks'
import { Vault } from 'state/types'
import DisplayVaults from './components/DisplayVaults'
import { useSetZapOutputList } from 'state/zap/hooks'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import ListView404 from 'components/ListView404'
import { usePollVaultsV3Data, usePollVaultV3UserData, useVaultsV3 } from 'state/vaultsV3/hooks'
import { usePollVaultsData, usePollVaultUserData, useVaults } from 'state/vaults/hooks'
import MigrationRequiredPopup from 'components/MigrationRequiredPopup'
import { useFarmsV2, usePollFarmsV2 } from 'state/farmsV2/hooks'
import ListViewLayout from '../../components/ListViewV2/ListViewLayout'
import ListViewMenu from '../../components/ListViewV2/ListViewMenu/ListViewMenu'
import { FILTER_OPTIONS, SORT_OPTIONS } from './constants'
import HarvestAll from './components/Actions/HarvestAll'
import { styles } from './styles'
import { BLUE_CHIPS } from '../Farms/constants'

const NUMBER_OF_VAULTS_VISIBLE = 12

const Vaults: React.FC = () => {
  const { chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  usePollVaultsData()
  usePollVaultUserData()
  usePollVaultsV3Data()
  usePollVaultV3UserData()
  usePollFarmsV2()
  const { t } = useTranslation()
  const [stakedOnly, setStakedOnly] = useState(false)
  const [filterOption, setFilterOption] = useState('all')
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const [numberOfVaultsVisible, setNumberOfVaultsVisible] = useState(NUMBER_OF_VAULTS_VISIBLE)
  const { pathname } = useLocation()
  const { search } = window.location
  const v2Farms = useFarmsV2(null)
  const { vaults: initVaults } = useVaultsV3()
  const { vaults: legacyVaults } = useVaults()

  const params = new URLSearchParams(search)
  const urlSearchedVault = parseInt(params.get('id'))
  const [allVaults, setAllVaults] = useState(initVaults)
  const isActive = !pathname.includes('history')
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  useEffect(() => {
    setAllVaults(initVaults)
  }, [initVaults])

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfVaultsVisible((vaultsCurrentlyVisible) => vaultsCurrentlyVisible + NUMBER_OF_VAULTS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const [inactiveVaults, activeVaults] = partition(allVaults, (vault) => vault.inactive)

  const stakedOnlyVaults = activeVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const vaultsHasRewards = stakedOnlyVaults.filter((vault) =>
    new BigNumber(vault.userData.pendingRewards).isGreaterThan(0),
  )
  const vaultPids = vaultsHasRewards?.map((vault) => {
    return vault?.pid
  })

  const stakedInactiveVaults = inactiveVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const sortVaults = (vaultsToSort: Vault[]) => {
    switch (sortOption) {
      case 'apy':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(vaultsToSort, (vault: Vault) => vault?.apy?.daily, 'desc')
      case 'totalStaked':
        return orderBy(vaultsToSort, (vault: Vault) => parseInt(vault?.totalStaked) * vault?.stakeTokenPrice, 'desc')
      default:
        return orderBy(vaultsToSort, (vault: Vault) => vault.platform, 'asc')
    }
  }

  const renderVaults = (): Vault[] => {
    let chosenVaults = isActive ? activeVaults : inactiveVaults

    if (urlSearchedVault) {
      const vaultCheck =
        activeVaults?.find((vault) => {
          return vault.id === urlSearchedVault
        }) !== undefined
      if (vaultCheck) {
        chosenVaults = [
          activeVaults?.find((vault) => {
            return vault.id === urlSearchedVault
          }),
          ...activeVaults?.filter((vault) => {
            return vault.id !== urlSearchedVault
          }),
        ]
      }
    }

    if (stakedOnly) {
      chosenVaults = isActive ? stakedOnlyVaults : stakedInactiveVaults
    }

    if (filterOption !== 'all') {
      switch (filterOption) {
        case 'banana':
          return chosenVaults.filter(
            (vault) =>
              vault?.token?.symbol?.toLowerCase() === 'banana' || vault?.quoteToken?.symbol?.toLowerCase() === 'banana',
          )
        case 'blueChips':
          return chosenVaults.filter(
            (vault) => BLUE_CHIPS.includes(vault?.token?.symbol) || BLUE_CHIPS.includes(vault?.quoteToken?.symbol),
          )
        default:
          return chosenVaults
      }
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      chosenVaults = chosenVaults.filter((vault) =>
        `${vault?.stakeToken?.symbol.toLowerCase()}-${vault?.rewardToken?.symbol.toLowerCase()}`.includes(
          lowercaseQuery,
        ),
      )
    }
    return sortVaults(chosenVaults).slice(0, numberOfVaultsVisible)
  }

  const renderLegacyVaults = (): Vault[] => {
    let chosenVaults = legacyVaults

    if (stakedOnly) {
      chosenVaults = chosenVaults.filter(
        (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
      )
    }

    if (filterOption !== 'all') {
      chosenVaults = chosenVaults.filter((vault) => vault.type === filterOption.toUpperCase())
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      chosenVaults = chosenVaults.filter((vault) =>
        `${vault?.stakeToken?.symbol.toLowerCase()}-${vault?.rewardToken?.symbol.toLowerCase()}`.includes(
          lowercaseQuery,
        ),
      )
    }
    return chosenVaults.slice(0, numberOfVaultsVisible)
  }

  useSetZapOutputList(
    activeVaults?.slice(1).map((vault) => {
      return { currencyIdA: vault?.token?.address[chainId], currencyIdB: vault?.quoteToken?.address[chainId] }
    }),
  )

  return (
    <Flex sx={styles.maxiContainer}>
      <MigrationRequiredPopup v2Farms={v2Farms} farms={[]} vaults={legacyVaults} />
      <ListViewLayout>
        <Banner
          title={t('BANANA Maximizers')}
          banner="banana-maximizers"
          link="?modal=tutorial"
          titleColor="primaryBright"
          maxWidth={1130}
        />
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', my: '20px' }}>
          <ListViewMenu
            query={searchQuery}
            onHandleQueryChange={handleChangeQuery}
            setSortOption={setSortOption}
            sortOption={sortOption}
            checkboxLabel="Staked"
            showOnlyCheckbox={stakedOnly}
            setShowOnlyCheckbox={setStakedOnly}
            setFilterOption={setFilterOption}
            filterOption={filterOption}
            toogleLabels={['ACTIVE', 'INACTIVE']}
            sortOptions={SORT_OPTIONS}
            filterOptions={FILTER_OPTIONS}
            actionButton={<HarvestAll pids={vaultPids} />}
          />
        </Flex>
        {!AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS.maximizers.includes(chainId) ? (
          <ListView404 product={LIST_VIEW_PRODUCTS.MAXIMIZERS} />
        ) : (
          <DisplayVaults
            vaults={isActive ? renderVaults() : [...renderVaults(), ...renderLegacyVaults()]}
            openId={urlSearchedVault}
          />
        )}
        <div ref={loadMoreRef} />
      </ListViewLayout>
    </Flex>
  )
}

export default Vaults
