/** @jsxImportSource theme-ui */
import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Flex } from '@ape.swap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import { useBlock } from 'state/block/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePollJungleFarms, useJungleFarms, useJungleFarmTags, useJungleFarmOrderings } from 'state/jungleFarms/hooks'
import Banner from 'components/Banner'
import { JungleFarm } from 'state/types'
import DisplayJungleFarms from './components/DisplayJungleFarms'
import HarvestAll from './components/Actions/HarvestAll'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useSetZapOutputList } from 'state/zap/hooks'
import useCurrentTime from 'hooks/useTimer'
import ListView404 from 'components/ListView404'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import { BannerTypes } from 'components/Banner/types'
import { styles } from './styles'
import ListViewLayout from 'components/ListViewV2/ListViewLayout'
import ListViewMenu from '../../components/ListViewV2/ListViewMenu/ListViewMenu'
import { SORT_OPTIONS } from './constants'

const NUMBER_OF_FARMS_VISIBLE = 10

const JungleFarms: React.FC = () => {
  usePollJungleFarms()
  const { chainId } = useActiveWeb3React()
  const [stakedOnly, setStakedOnly] = useState(false)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('all')
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const allJungleFarms = useJungleFarms(account)
  const { t } = useTranslation()
  const { currentBlock } = useBlock()
  const { search } = window.location
  const params = new URLSearchParams(search)
  const urlSearchedFarm = parseInt(params.get('id'))
  const isActive = !pathname.includes('history')
  const isJungleFarms = pathname.includes('jungle-farms')
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { jungleFarmTags } = useJungleFarmTags(chainId)
  const { jungleFarmOrderings } = useJungleFarmOrderings(chainId)
  const currentTime = useCurrentTime()
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  useEffect(() => {
    const showMoreJungleFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible((farmsCurrentlyVisible) => farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreJungleFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const currJungleFarms = allJungleFarms.map((farm) => {
    return {
      ...farm,
      isFinished:
        farm.isFinished || farm.rewardsPerSecond ? currentTime / 1000 > farm.endBlock : currentBlock > farm.endBlock,
    }
  })

  const farmsWithHarvestAvailable = currJungleFarms.filter((farm) =>
    farm.userData ? farm.userData.pendingReward > new BigNumber(0) : null,
  )
  const harvestJungleIds = farmsWithHarvestAvailable.map((farm) => {
    return farm.jungleId
  })

  const [finishedJungleFarms, openFarms] = partition(currJungleFarms, (farm) => farm.isFinished)

  const stakedOnlyFarms = openFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  const stakedInactiveFarms = finishedJungleFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const sortJungleFarms = (farmsToSort: JungleFarm[]) => {
    switch (sortOption) {
      case 'apr':
        return orderBy(farmsToSort, (farm: JungleFarm) => farm.apr, 'desc')
      case 'liquidity':
        return orderBy(
          farmsToSort,
          (farm: JungleFarm) => getBalanceNumber(farm.totalStaked) * farm.stakingToken.price,
          'desc',
        )
      case 'earned':
        return orderBy(
          farmsToSort,
          (farm: JungleFarm) => {
            if (!farm.userData || !farm.rewardToken?.price) {
              return 0
            }
            return getBalanceNumber(farm.userData.pendingReward) * farm.rewardToken?.price
          },
          'desc',
        )
      case 'hot':
        return jungleFarmTags
          ? orderBy(
              farmsToSort,
              (farm: JungleFarm) =>
                jungleFarmTags?.find((tag) => tag.pid === farm.jungleId && tag.text.toLowerCase() === 'hot'),
              'asc',
            )
          : farmsToSort
      case 'new':
        return jungleFarmTags
          ? orderBy(
              farmsToSort,
              (farm: JungleFarm) =>
                jungleFarmTags?.find((tag) => tag.pid === farm.jungleId && tag.text.toLowerCase() === 'new'),
              'asc',
            )
          : farmsToSort
      default:
        return jungleFarmOrderings
          ? orderBy(
              farmsToSort,
              (farm: JungleFarm) => jungleFarmOrderings?.find((ordering) => ordering.pid === farm.jungleId)?.order,
              'asc',
            )
          : farmsToSort
    }
  }

  const renderJungleFarms = () => {
    let chosenJungleFarms = isActive ? openFarms : finishedJungleFarms
    if (urlSearchedFarm) {
      const farmCheck =
        openFarms?.find((farm) => {
          return farm.jungleId === urlSearchedFarm
        }) !== undefined
      if (farmCheck) {
        chosenJungleFarms = [
          openFarms?.find((farm) => {
            return farm.jungleId === urlSearchedFarm
          }),
          ...openFarms?.filter((farm) => {
            return farm.jungleId !== urlSearchedFarm
          }),
        ]
      }
    }

    if (stakedOnly) {
      chosenJungleFarms = isActive ? stakedOnlyFarms : stakedInactiveFarms
    }
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      chosenJungleFarms = chosenJungleFarms.filter((farm) => farm.tokenName.toLowerCase().includes(lowercaseQuery))
    }

    return sortJungleFarms(chosenJungleFarms).slice(0, numberOfFarmsVisible)
  }

  // Set zap output list to match dual farms
  useSetZapOutputList(
    openFarms?.map((farm) => {
      return {
        currencyIdA: farm?.lpTokens.token.address[chainId],
        currencyIdB: farm?.lpTokens.quoteToken.address[chainId],
      }
    }),
  )

  return (
    <Flex sx={styles.farmContainer}>
      <ListViewLayout>
        <Banner
          banner={`${chainId}-jungle-farms` as BannerTypes}
          title={chainId === 40 ? t('Telos Farms') : t('Jungle Farms')}
          link={`?modal=tutorial`}
          listViewBreak
          maxWidth={1130}
        />
        <Flex sx={styles.farmContent}>
          <Flex sx={{ my: '20px' }}>
            <ListViewMenu
              query={searchQuery}
              onHandleQueryChange={handleChangeQuery}
              setSortOption={setSortOption}
              sortOption={sortOption}
              sortOptions={SORT_OPTIONS}
              checkboxLabel="Staked"
              showOnlyCheckbox={stakedOnly}
              setShowOnlyCheckbox={setStakedOnly}
              toogleLabels={['ACTIVE', 'INACTIVE']}
              actionButton={<HarvestAll jungleIds={harvestJungleIds} disabled={harvestJungleIds.length === 0} />}
              showMonkeyImage
            />
          </Flex>
          {isJungleFarms ? (
            !AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.JUNGLE_FARMS].includes(chainId) ? (
              <Flex mt="20px">
                <ListView404 product={LIST_VIEW_PRODUCTS.JUNGLE_FARMS} />
              </Flex>
            ) : (
              <DisplayJungleFarms
                jungleFarms={renderJungleFarms()}
                openId={urlSearchedFarm}
                jungleFarmTags={jungleFarmTags}
              />
            )
          ) : !AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.FARMS].includes(chainId) ? (
            <Flex mt="20px">
              <ListView404 product={LIST_VIEW_PRODUCTS.FARMS} />
            </Flex>
          ) : (
            <DisplayJungleFarms
              jungleFarms={renderJungleFarms()}
              openId={urlSearchedFarm}
              jungleFarmTags={jungleFarmTags}
            />
          )}
          <div ref={loadMoreRef} />
        </Flex>
      </ListViewLayout>
    </Flex>
  )
}

export default React.memo(JungleFarms)
