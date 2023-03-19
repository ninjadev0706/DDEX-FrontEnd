/** @jsxImportSource theme-ui */
import { Flex } from '@ape.swap/uikit'
import React, { useState } from 'react'
import { useFetchInfoBlock, useFetchInfoNativePrice } from 'state/info/hooks'
import TrendingTokens from './components/TrendingTokens/TrendingTokens'
import Tokens from './components/Tokens'
import Pairs from './components/Pairs'
import Transactions from './components/Transactions'
import Overview from './components/Overview'
import NetworkSelector from './components/NetworkSelector'
import useIsMobile from '../../hooks/useIsMobile'
import Showcases from './components/Showcases'

const InfoPage = () => {
  useFetchInfoBlock()
  useFetchInfoNativePrice()
  const mobile = useIsMobile()

  const [filter, setFilter] = useState('')

  function onFilter(event) {
    setFilter(event.target.value)
  }

  return (
    <Flex sx={{ width: '100%', justifyContent: 'center' }}>
      <Flex
        sx={{
          height: 'fit-content',
          width: 'fit-content',
          maxWidth: '1200px',
          alignItems: 'center',
          flexDirection: 'column',
          margin: '40px 0px',
        }}
      >
        <NetworkSelector onFilter={onFilter} />
        <Overview />
        <TrendingTokens />
        {mobile && <Showcases />}
        <Tokens headerText="Top Tokens" moreLink="/info/tokens" filter={filter} />
        <Pairs headerText="Top Pairs" moreLink="/info/pairs" filter={filter} />
        <Transactions headerText="Recent Transactions" moreLink="/info/transactions" />
      </Flex>
    </Flex>
  )
}

export default InfoPage
