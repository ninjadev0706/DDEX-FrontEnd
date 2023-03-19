/** @jsxImportSource theme-ui */
import { Flex } from '@ape.swap/uikit'
import React, { useState } from 'react'
import Transactions from '../../components/Transactions'
import TrendingTokens from '../../components/TrendingTokens/TrendingTokens'
import { useFetchInfoBlock } from '../../../../state/info/hooks'
import NetworkSelector from '../../components/NetworkSelector'

const TransactionsPage = () => {
  useFetchInfoBlock()

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
        <TrendingTokens />
        <Transactions headerText="All Transactions" amount={1000} pageSize={20} filter={filter} />
      </Flex>
    </Flex>
  )
}

export default TransactionsPage
