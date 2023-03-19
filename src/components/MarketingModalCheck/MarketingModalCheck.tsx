import React, { useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { MarketingModal } from '@ape.swap/uikit'
import { LendingBodies } from 'components/MarketingModalContent/Lending/'
import CircularModal from 'components/CircularModal'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import MoonPayModal from 'views/Topup/MoonpayModal'
import GnanaModal from 'components/GnanaModal'
import NewsletterModal from 'components/NewsletterModal'
import SwiperProvider from 'contexts/SwiperProvider'
import QuestModal from '../MarketingModalContent/Quests/QuestModal'
import {
  MODAL_TYPE,
  SET_DEFAULT_MODAL_KEY,
  SHOW_DEFAULT_MODAL_KEY,
  SET_DEF_MOD_KEY,
  SHOW_DEF_MOD_KEY,
} from 'config/constants'
import { circularRoute } from 'utils'
import Tutorial from 'components/MarketingModalContent/Tutorial'

const MarketingModalCheck = () => {
  const { chainId } = useActiveWeb3React()
  const location = useLocation()
  const history = useHistory()
  const { t } = useTranslation()

  useMemo(() => {
    localStorage.removeItem(SHOW_DEFAULT_MODAL_KEY) // remove old key
    localStorage.removeItem(SET_DEFAULT_MODAL_KEY) // remove old key
    //const onHomepage = history.location.pathname === '/'
    const sdmk = localStorage.getItem(SET_DEF_MOD_KEY)
    //const isdm = localStorage.getItem(SHOW_DEF_MOD_KEY)

    // This needs to be fixed but I didnt want to reset users local storage keys
    // Basically first land users wont get the modal until they refresh so I added a showDefaultModalFlag variable
    const isDefaultModalSet = JSON.parse(sdmk)
    /*const isShowDefaultModal = JSON.parse(isdm)
    const showDefaultModalFlag = isShowDefaultModal || (!isShowDefaultModal && !isDefaultModalSet)*/

    if (!isDefaultModalSet) {
      localStorage.setItem(SHOW_DEF_MOD_KEY, JSON.stringify('SHOW'))
    }

    /*if (showDefaultModalFlag && onHomepage) {
      history.push({ search: '?modal=tutorial' })
    }*/
  }, [])

  const tutorial = location.search.includes('modal=tutorial')
  const lendingRoute = location.search.includes('modal=3')
  const telosQuestRoute = location.search.includes('modal=telos-quests')
  const moonpayRoute = location.search.includes('modal=moonpay')
  const getGnanaRoute = location.search.includes('modal=gnana')
  const buyRoute = circularRoute(chainId, location, 'modal=circular-buy')
  const sellRoute = circularRoute(chainId, location, 'modal=circular-sell')
  const phRoute = circularRoute(chainId, location, 'modal=circular-ph')
  const ghRoute = circularRoute(chainId, location, 'modal=circular-gh')
  const newsletterRoute = location.search.includes('modal=newsletter')

  const { LendingBody1, LendingBody2, LendingBody3, LendingBody4, LendingBody5 } = LendingBodies

  const onDismiss = () => {
    history.push({
      pathname: location.pathname,
    })
  }

  const lending = [
    <LendingBody1 key="lend1" />,
    <LendingBody2 key="lend2" />,
    <LendingBody3 key="lend3" />,
    <LendingBody4 key="lend4" />,
    <LendingBody5 key="lend5" />,
  ]

  return tutorial ? (
    <Tutorial location={location.pathname} onDismiss={onDismiss} />
  ) : lendingRoute ? (
    <MarketingModal
      title={t("Welcome to ApeSwap's Lending Network")}
      description={t('How does it work?')}
      onDismiss={onDismiss}
      startEarning={onDismiss}
      startEarningText={t('Start Earning')}
    >
      {lending}
    </MarketingModal>
  ) : moonpayRoute ? (
    <MoonPayModal onDismiss={onDismiss} />
  ) : getGnanaRoute ? (
    <GnanaModal onDismiss={onDismiss} />
  ) : buyRoute ? (
    <CircularModal actionType={MODAL_TYPE.BUYING} onDismiss={onDismiss} />
  ) : sellRoute ? (
    <CircularModal actionType={MODAL_TYPE.SELLING} onDismiss={onDismiss} />
  ) : phRoute ? (
    <CircularModal actionType={MODAL_TYPE.POOL_HARVEST} onDismiss={onDismiss} />
  ) : ghRoute ? (
    <CircularModal actionType={MODAL_TYPE.GENERAL_HARVEST} onDismiss={onDismiss} />
  ) : newsletterRoute ? (
    <NewsletterModal onDismiss={onDismiss} />
  ) : telosQuestRoute ? (
    <SwiperProvider>
      <QuestModal onDismiss={onDismiss} />
    </SwiperProvider>
  ) : null
}

export default React.memo(MarketingModalCheck)
