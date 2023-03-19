/** @jsxImportSource theme-ui */
import { Flex } from '@ape.swap/uikit'
import React, { useCallback, useState } from 'react'
import { usePollBills, usePollUserBills } from 'state/bills/hooks'
import ListViewLayout from 'components/layout/ListViewLayout'
import Banner from 'components/Banner'
import { useTranslation } from 'contexts/Localization'
import UserBillsView from './components/UserBillsView'
import { BannerTypes } from 'components/Banner/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ListView404 from 'components/ListView404'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import FirstTimeCard from './components/FirstTimeCard/FirstTimeCard'
import BillsNav from './components/BillsNav'
import BillsListView from './components/BillsListView'
import { styles } from './styles'

export enum BillsView {
  AVAILABLE_BILLS = 'Available Bills',
  YOUR_BILLS = 'Your Bills',
}

const Bills: React.FC = () => {
  usePollBills()
  usePollUserBills()
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [billsView, setBillsView] = useState<string>(BillsView.AVAILABLE_BILLS)

  const handleBillsViewChange = useCallback((newBillsView: string) => {
    setBillsView(newBillsView)
  }, [])

  return (
    <>
      <Flex sx={styles.billsViewContainer}>
        <ListViewLayout>
          <Banner
            banner={`${chainId}-treasury-bills` as BannerTypes}
            title={t('Treasury Bills')}
            link="?modal=tutorial"
            listViewBreak
            maxWidth={1130}
            titleColor="primaryBright"
          />
          {!AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.BILLS].includes(chainId) ? (
            <Flex sx={{ mt: '20px' }}>
              <ListView404 product={LIST_VIEW_PRODUCTS.BILLS} />
            </Flex>
          ) : (
            <>
              <FirstTimeCard />
              <BillsNav billsView={billsView} setBillsView={handleBillsViewChange} />
              {billsView === BillsView.AVAILABLE_BILLS ? (
                <BillsListView />
              ) : (
                <UserBillsView handleBillsViewChange={handleBillsViewChange} />
              )}
            </>
          )}
        </ListViewLayout>
      </Flex>
    </>
  )
}

export default React.memo(Bills)
