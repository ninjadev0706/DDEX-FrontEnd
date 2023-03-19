/** @jsxImportSource theme-ui */
import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Flex } from '@ape.swap/uikit'
import { useFetchFarmLpAprs } from 'state/hooks'
import { useDualFarms, usePollDualFarms } from 'state/dualFarms/hooks'
import { useFarmOrderings, useFarmTags } from 'state/farms/hooks'
import { DualFarm } from 'state/types'
import { orderBy } from 'lodash'
import Banner from 'components/Banner'
import { useTranslation } from 'contexts/Localization'
import HarvestAllAction from './components/CardActions/HarvestAllAction'
import DisplayFarms from './components/DisplayFarms'
import { BLUE_CHIPS, NUMBER_OF_FARMS_VISIBLE, SORT_OPTIONS, STABLES } from '../Farms/constants'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useSetZapOutputList } from 'state/zap/hooks'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import ListView404 from 'components/ListView404'
import ListViewMenu from '../../components/ListViewV2/ListViewMenu/ListViewMenu'
import ListViewLayout from '../../components/ListViewV2/ListViewLayout'
import { styles } from './styles'

const { search } = window.location
const params = new URLSearchParams(search)

const urlSearchedFarm = parseInt(params.get('pid'))

const DualFarms: React.FC = () => {
  usePollDualFarms()
  const { account, chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  const { farmTags } = useFarmTags(chainId)
  const { farmOrderings } = useFarmOrderings(chainId)

  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [observerIsSet, setObserverIsSet] = useState(false)
  const farmsLP = useDualFarms(account)
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('all')

  const [stakedOnly, setStakedOnly] = useState(false)
  const isActive = !pathname.includes('history')

  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const stakedOnlyInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const hasHarvestPids = [...activeFarms, ...inactiveFarms]
    .filter(
      (farm) =>
        farm.userData &&
        new BigNumber(farm.userData.miniChefEarnings)
          .plus(new BigNumber(farm.userData.rewarderEarnings))
          .isGreaterThan(0),
    )
    .map((filteredFarm) => {
      return filteredFarm.pid
    })

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const loadMoreRef = useRef<HTMLDivElement>(null)

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

    if (query) {
      farms = farms.filter((farm) => {
        return `${farm?.stakeTokens?.token0?.symbol}-${farm?.stakeTokens?.token1?.symbol}`
          .toUpperCase()
          .includes(query.toUpperCase())
      })
    }

    if (stakedOnly) {
      farms = isActive ? stakedOnlyFarms : stakedOnlyInactiveFarms
    }

    switch (sortOption) {
      case 'all':
        return farmOrderings
          ? orderBy(
              farms,
              (farm: DualFarm) => farmOrderings.find((ordering) => ordering.pid === farm.pid)?.order,
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
      case 'stables':
        return farms
          .filter(
            (farm) =>
              STABLES.includes(farm.stakeTokens.token0.symbol) && STABLES.includes(farm.stakeTokens.token1.symbol),
          )
          .slice(0, numberOfFarmsVisible)
      case 'apr':
        return orderBy(farms, (farm) => parseFloat(farm.apy), 'desc').slice(0, numberOfFarmsVisible)
      case 'hot':
        return farmTags
          ? orderBy(
              farms,
              (farm: DualFarm) => farmTags?.find((tag) => tag.pid === farm.pid && tag.text.toLowerCase() === 'hot'),
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
      case 'new':
        return farmTags
          ? orderBy(
              farms,
              (farm: DualFarm) => farmTags?.find((tag) => tag.pid === farm.pid && tag.text.toLowerCase() === 'new'),
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
      case 'blueChips':
        return farms
          .filter(
            (farm) =>
              BLUE_CHIPS.includes(farm.stakeTokens.token0.symbol) ||
              BLUE_CHIPS.includes(farm.stakeTokens.token1.symbol),
          )
          .slice(0, numberOfFarmsVisible)
      case 'liquidity':
        return orderBy(farms, (farm: DualFarm) => parseFloat(farm.totalStaked), 'desc').slice(0, numberOfFarmsVisible)
      default:
        return farmOrderings
          ? orderBy(
              farms,
              (farm: DualFarm) => farmOrderings.find((ordering) => ordering.pid === farm.pid)?.order,
              'asc',
            ).slice(0, numberOfFarmsVisible)
          : farms.slice(0, numberOfFarmsVisible)
    }
  }

  // Set zap output list to match dual farms
  useSetZapOutputList(
    activeFarms?.map((farm) => {
      return {
        currencyIdA: farm?.stakeTokens.token0.address[chainId],
        currencyIdB: farm?.stakeTokens.token1.address[chainId],
      }
    }),
  )

  return (
    <Flex sx={styles.farmContainer}>
      <ListViewLayout>
        <Banner
          banner="polygon-farms"
          link="?modal=tutorial"
          title={t('Polygon Farms')}
          listViewBreak
          maxWidth={1130}
        />
        <Flex sx={styles.farmContent}>
          <Flex sx={{ my: '20px' }}>
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
              actionButton={<HarvestAllAction pids={hasHarvestPids} disabled={hasHarvestPids.length === 0} />}
              showMonkeyImage
            />
          </Flex>
          {!AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.FARMS].includes(chainId) ? (
            <ListView404 product={LIST_VIEW_PRODUCTS.FARMS} />
          ) : (
            <DisplayFarms farms={renderFarms()} openPid={urlSearchedFarm} dualFarmTags={farmTags} />
          )}
          <div ref={loadMoreRef} />
        </Flex>
      </ListViewLayout>
    </Flex>
  )
}

export default DualFarms
