/** @jsxImportSource theme-ui */
import React from 'react'
import { Button, Flex, Spinner } from '@ape.swap/uikit'
import SwiperProvider from 'contexts/SwiperProvider'
import Banner from 'components/Banner'
import { useAuctions, useFetchAuctions } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import Positions from './components/Positions'
import History from './components/History'
import ListYourNfa from './components/Actions/ListYourNfa'
import { MoreInfoWrapper, styles } from './styles'
import ListViewLayout from '../../components/layout/ListViewLayout'
import useIsMobile from 'hooks/useIsMobile'

const Auction: React.FC = () => {
  useFetchAuctions()
  const { auctions } = useAuctions()
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  return (
    <SwiperProvider>
      <Flex sx={styles.mainContainer}>
        <ListViewLayout>
          <Banner
            banner="auction"
            link="https://apeswap.gitbook.io/apeswap-finance/product-and-features/collect/nfa-auction-house"
            title={t('Nfa Auction')}
            maxWidth={1130}
          />
          <Flex sx={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
            <MoreInfoWrapper>
              <Button size="sm" style={{ marginRight: '10px', height: '36px' }}>
                <a
                  href="https://apeswap.gitbook.io/apeswap-finance/product-information/non-fungible-apes-nfas/nfa-auction-house"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('HOW IT WORKS')}
                </a>
              </Button>
              <ListYourNfa />
            </MoreInfoWrapper>
          </Flex>
          {auctions ? (
            <Positions auctions={auctions} />
          ) : (
            <Flex sx={{ justifyContent: 'center' }}>
              <Spinner size={200} />
            </Flex>
          )}
          {!isMobile && <History />}
        </ListViewLayout>
      </Flex>
    </SwiperProvider>
  )
}

export default Auction
