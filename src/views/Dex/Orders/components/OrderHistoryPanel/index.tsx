/** @jsxImportSource theme-ui */
import { Order } from '@autonomylabs/limit-stop-orders'
import React, { useEffect, useState } from 'react'
// import ReactPaginate from 'react-paginate'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { Flex, Tabs, Tab } from '@ape.swap/uikit'
import { dexStyles } from 'views/Dex/styles'
import useAutonomyOrdersLib from '../../../../../hooks/useAutonomyOrdersLib'
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React'
import { useTranslation } from '../../../../../contexts/Localization'
import OrderRows from './OrderRows'

const ORDERS_PER_PAGE = 5

const OrderHistoryPanel: React.FC = () => {
  const [viewType, setViewType] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrders, setCurrentOrders] = useState<Order[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [orderOffset, setOrderOffset] = useState(0)
  const { t } = useTranslation()

  const autonomyOrdersLib = useAutonomyOrdersLib()
  const { account } = useActiveWeb3React()

  const switchTab = (index) => setViewType(index)

  const { data } = useQuery(
    'orders',
    async () => {
      if (!account || !autonomyOrdersLib) {
        return []
      }
      const allOrders = await autonomyOrdersLib.getOrders(account)
      allOrders.sort((x, y) => Date.parse(y.time) - Date.parse(x.time))
      return allOrders
    },
    {
      refetchInterval: 4_000,
    },
  )

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ORDERS_PER_PAGE) % orders.length
    setOrderOffset(newOffset)
  }

  useEffect(() => {
    if (data?.length > 0) {
      setOrders(
        data.filter((order) =>
          viewType === 0 ? order.status === 'open' : order.status === 'executed' || order.status === 'cancelled',
        ),
      )
      setOrderOffset(0)
    }
  }, [data, viewType])

  useEffect(() => {
    const endOffset = orderOffset + ORDERS_PER_PAGE
    setCurrentOrders(orders.slice(orderOffset, endOffset))
    setPageCount(Math.ceil(orders.length / ORDERS_PER_PAGE))
  }, [orders, orderOffset])

  return (
    <Flex sx={{ ...dexStyles.dexContainer, marginTop: '10px' }}>
      <Flex sx={{ maxWidth: '100%', width: '420px' }} />
      <div>
      {/* <div sx={{ width: '100%' }}> */}
        <Tabs activeTab={viewType} size="md" variant="fullWidth">
          <Tab index={0} label={t('OPEN')} size="md" activeTab={viewType} variant="fullWidth" onClick={switchTab} />
          <Tab index={1} label={t('HISTORY')} variant="fullWidth" size="md" activeTab={viewType} onClick={switchTab} />
        </Tabs>
      </div>
      <Flex sx={{ flexDirection: 'column' }}>
        <OrderRows orders={currentOrders} />
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {/* <Pagination
            previousLabel="<"
            nextLabel=">"
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            onPageChange={handlePageClick}
          /> */}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(OrderHistoryPanel)

// const Pagination = styled(ReactPaginate).attrs({
//   activeClassName: 'active',
// })`
//   display: flex;
//   flex-direction: row;
//   list-style-type: none;
//   padding: 0.75rem 0;
//   li {
//     height: 32px;
//     width: 32px;
//     border-radius: 7px;
//     border: gray 1px solid;
//     cursor: pointer;
//     margin-right: 0.5rem;
//   }
//   li.previous,
//   li.next,
//   li.break {
//     border-color: transparent;
//   }
//   li.active {
//     background-color: #ffb300;
//     border-color: transparent;
//     color: white;
//   }
//   li.disabled a {
//     color: grey;
//   }
//   li.disable,
//   li.disabled a {
//     cursor: default;
//   }

//   li a {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 100%;
//     height: 100%;
//   }
// `
