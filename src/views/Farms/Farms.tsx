/** @jsxImportSource theme-ui */
import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Flex } from '@ape.swap/uikit'
import { useFetchFarmLpAprs } from 'state/hooks'
import { orderBy } from 'lodash'
import Banner from 'components/Banner'
import { useTranslation } from 'contexts/Localization'
import { Farm } from 'state/types'
import { useFarmOrderings, useFarms, usePollFarms } from 'state/farms/hooks'
import DisplayFarms from './components/DisplayFarms'
import { BLUE_CHIPS, NUMBER_OF_FARMS_VISIBLE, SORT_OPTIONS, STABLES } from './constants'
import HarvestAllAction from './components/CardActions/HarvestAllAction'
import { useSetZapOutputList } from 'state/zap/hooks'
import ListView404 from 'components/ListView404'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import { useFarmsV2, usePollFarmsV2 } from 'state/farmsV2/hooks'
import MigrationRequiredPopup from 'components/MigrationRequiredPopup'
import { styles } from './styles'
import ListViewLayout from '../../components/ListViewV2/ListViewLayout'
import ListViewMenu from '../../components/ListViewV2/ListViewMenu/ListViewMenu'

const Farms: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  usePollFarms()
  usePollFarmsV2()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const farmsLP = useFarmsV2(account)
  const legacyFarms = useFarms(account)
  const { search } = window.location
  const params = new URLSearchParams(search)
  const urlSearchedFarm = parseInt(params.get('pid'))
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('all')
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { farmOrderings } = useFarmOrderings(chainId)

  useEffect(() => {
    const showMoreFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible((farmsCurrentlyVisible) => farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const [stakedOnly, setStakedOnly] = useState(false)
  const isActive = !pathname.includes('history')

  const activeFarms = farmsLP?.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP?.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedOnlyInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const hasHarvestPids = [...activeFarms, ...inactiveFarms]
    .filter((farm) => farm.userData && new BigNumber(farm.userData.earnings).isGreaterThan(0))
    .map((filteredFarm) => {
      return filteredFarm.pid
    })

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const renderFarms = () => {
    let farms = isActive ? activeFarms : inactiveFarms

    if (urlSearchedFarm) {
      const farmCheck =
        activeFarms?.find((farm) => {
          return farm.pid === urlSearchedFarm
        }) !== undefined
      if (farmCheck) {
        farms = [
          activeFarms?.find((farm) => {
            return farm.pid === urlSearchedFarm
          }),
          ...activeFarms?.filter((farm) => {
            return farm.pid !== urlSearchedFarm
          }),
        ]
      }
    }

    if (stakedOnly) {
      farms = isActive ? stakedOnlyFarms : stakedOnlyInactiveFarms
    }

    if (query) {
      farms = farms.filter((farm) => {
        return farm.lpSymbol.toUpperCase().includes(query.toUpperCase())
      })
    }

    // TODO: Refactor this to be a helper function outside of this file
    switch (sortOption) {
      case 'all':
        return farmOrderings
          ? orderBy(
              farms,
              (farm: Farm) => farmOrderings.find((ordering) => ordering.pid === farm.pid)?.order,
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
      case 'stables':
        return farms
          .filter((farm) => STABLES.includes(farm.tokenSymbol) && STABLES.includes(farm.quoteTokenSymbol))
          .slice(0, numberOfFarmsVisible)
      case 'apr':
        return orderBy(farms, (farm) => parseFloat(farm.apy), 'desc').slice(0, numberOfFarmsVisible)
      case 'blueChips':
        return farms
          .filter((farm) => BLUE_CHIPS.includes(farm.tokenSymbol) || BLUE_CHIPS.includes(farm.quoteTokenSymbol))
          .slice(0, numberOfFarmsVisible)
      case 'liquidity':
        return orderBy(farms, (farm: Farm) => parseFloat(farm.totalLpStakedUsd), 'desc').slice(0, numberOfFarmsVisible)
      default:
        return farmOrderings
          ? orderBy(
              farms,
              (farm: Farm) => farmOrderings.find((ordering) => ordering.pid === farm.pid)?.order,
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
    }
  }

  const renderLegacyFarms = () => {
    let farms = legacyFarms

    if (stakedOnly) {
      farms = legacyFarms.filter((farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
    }

    if (query) {
      farms = legacyFarms.filter((farm) => {
        return farm.lpSymbol.toUpperCase().includes(query.toUpperCase())
      })
    }
    return farms.slice(1, numberOfFarmsVisible)
  }

  // Set zap output list to match farms
  useSetZapOutputList(
    activeFarms?.map((farm) => {
      return { currencyIdA: farm?.tokenAddresses[chainId], currencyIdB: farm?.quoteTokenAdresses[chainId] }
    }),
  )

  return (
    <Flex sx={styles.farmContainer}>
      <MigrationRequiredPopup v2Farms={farmsLP} farms={legacyFarms} vaults={[]} />
      <ListViewLayout>
        <Banner banner="banana-farms" link="?modal=tutorial" title={t('Banana Farms')} listViewBreak maxWidth={1130} />
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: '20px' }}>
          <ListViewMenu
            query={query}
            onHandleQueryChange={handleChangeQuery}
            setSortOption={setSortOption}
            sortOption={sortOption}
            checkboxLabel="Staked"
            showOnlyCheckbox={stakedOnly}
            setShowOnlyCheckbox={setStakedOnly}
            toogleLabels={['ACTIVE', 'INACTIVE']}
            sortOptions={SORT_OPTIONS}
            actionButton={
              <HarvestAllAction pids={hasHarvestPids} disabled={hasHarvestPids.length === 0} v2Flag={true} />
            }
            showMonkeyImage
          />
        </Flex>
        {!AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.FARMS].includes(chainId) ? (
          <Flex mt="20px">
            <ListView404 product={LIST_VIEW_PRODUCTS.FARMS} />
          </Flex>
        ) : (
          <>
            <Flex sx={{ mt: '20px' }}>
              <DisplayFarms farms={renderFarms()} openPid={urlSearchedFarm} farmTags={null} v2Flag={true} />
            </Flex>
            {!isActive && (
              <DisplayFarms farms={renderLegacyFarms()} openPid={urlSearchedFarm} farmTags={null} v2Flag={false} />
            )}
          </>
        )}
        <div ref={loadMoreRef} />
      </ListViewLayout>
    </Flex>
  )
}

export default React.memo(Farms)
