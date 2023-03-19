/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { orderBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useFetchActiveChains, useFetchInfoTransactions } from 'state/info/hooks'
import ReactPaginate from 'react-paginate'
import Rows from './Rows'
import styled from 'styled-components'
import { Swaps } from 'state/info/types'
import useIsMobile from '../../../../hooks/useIsMobile'
import { RangeSelectorsWrapper } from '../styles'
import SectionHeader from '../SectionHeader'

interface TransactionProps {
  token?: string
  token2?: string
  headerText: string
  moreLink?: string
  chain?: number
  amount?: number
  pageSize?: number
  filter?: string
}

const Transactions: React.FC<TransactionProps> = (props) => {
  const mobile = useIsMobile()
  const { token, token2, headerText, moreLink, chain, amount, pageSize } = props

  const [pageCount, setPageCount] = useState(0)
  const [dataOffset, setDataOffset] = useState(0)
  const transactions = useFetchInfoTransactions(amount || 100, token || '', chain ? chain : null)
  const [transactionType, setTransactionType] = useState('all')
  const ROWS_PER_PAGE = pageSize ? pageSize : 10
  const [activeChains] = useFetchActiveChains()

  let flattenedSwaps = Object.values(transactions).flatMap((row) =>
    row.initialized
      ? row.data?.flatMap(({ swaps, chainId }) =>
          swaps.map((swap) => {
            return { ...swap, chainId }
          }),
        )
      : [],
  ) as Swaps[]

  let flattenedMints = Object.values(transactions).flatMap((row) =>
    row.initialized
      ? row.data?.flatMap(({ mints, chainId }) =>
          mints.map((mint) => {
            return { ...mint, chainId }
          }),
        )
      : [],
  ) as Swaps[]

  let flattenedBurns = Object.values(transactions).flatMap((row) =>
    row.initialized
      ? row.data?.flatMap(({ burns, chainId }) =>
          burns.map((burn) => {
            return { ...burn, chainId }
          }),
        )
      : [],
  ) as Swaps[]

  //Token
  if (token && token !== '') {
    flattenedSwaps = flattenedSwaps.filter((x) => x.pair.token0.id === token || x.pair.token1.id === token)
    flattenedMints = flattenedMints.filter((x) => x.pair.token0.id === token || x.pair.token1.id === token)
    flattenedBurns = flattenedBurns.filter((x) => x.pair.token0.id === token || x.pair.token1.id === token)
  }

  //Pair
  if (token && token !== '' && token2 && token2 !== '') {
    flattenedSwaps = flattenedSwaps.filter(
      (x) =>
        (x.pair.token0.id === token && x.pair.token1.id === token2) ||
        (x.pair.token0.id === token2 && x.pair.token1.id === token),
    )
    flattenedMints = flattenedMints.filter(
      (x) =>
        (x.pair.token0.id === token && x.pair.token1.id === token2) ||
        (x.pair.token0.id === token2 && x.pair.token1.id === token),
    )
    flattenedBurns = flattenedBurns.filter(
      (x) =>
        (x.pair.token0.id === token && x.pair.token1.id === token2) ||
        (x.pair.token0.id === token2 && x.pair.token1.id === token),
    )
  }

  const getTransactions = useMemo(() => {
    if (transactionType === 'all') {
      return flattenedSwaps.concat(flattenedMints).concat(flattenedBurns)
    } else if (transactionType === 'swaps') {
      return flattenedSwaps
    } else if (transactionType === 'mints') {
      return flattenedMints
    }
    return flattenedBurns
  }, [flattenedSwaps, flattenedMints, flattenedBurns, transactionType])

  const sortedTransactions = useMemo(
    () =>
      orderBy(
        getTransactions.filter((x) => activeChains === null || activeChains.includes(x.chainId)),
        ({ transaction }) => parseFloat(transaction.timestamp),
        'desc',
      ),
    [activeChains, getTransactions],
  )?.slice(0, amount || 100)

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ROWS_PER_PAGE) % sortedTransactions.length
    setDataOffset(newOffset)
  }
  useEffect(() => {
    setPageCount(Math.ceil(sortedTransactions.length / ROWS_PER_PAGE))
  }, [sortedTransactions.length, dataOffset, ROWS_PER_PAGE])

  return (
    <Flex sx={{ flexDirection: 'column', width: `${mobile ? '95vw' : '100%'}` }}>
      <SectionHeader title={headerText} link={moreLink} />
      <Flex
        sx={{
          width: '100%',
          background: 'white2',
          flexDirection: 'column',
          padding: '30px 10px 20px 10px',
          borderRadius: '10px',
          mt: '10px',
        }}
      >
        <RangeSelectorsWrapper className="transctionSelector">
          <ul>
            <li className={transactionType === 'all' ? 'active' : ''} onClick={() => setTransactionType('all')}>
              <Text size="14px" weight={700}>
                All
              </Text>
            </li>
            <li className={transactionType === 'swaps' ? 'active' : ''} onClick={() => setTransactionType('swaps')}>
              <Text size="14px" weight={700}>
                Swaps
              </Text>
            </li>
            <li className={transactionType === 'mints' ? 'active' : ''} onClick={() => setTransactionType('mints')}>
              <Text size="14px" weight={700}>
                Adds
              </Text>
            </li>
            <li className={transactionType === 'burns' ? 'active' : ''} onClick={() => setTransactionType('burns')}>
              <Text size="14px" weight={700}>
                Removes
              </Text>
            </li>
          </ul>
        </RangeSelectorsWrapper>
        {sortedTransactions && (
          <>
            <Rows transactions={sortedTransactions.slice(dataOffset, dataOffset + ROWS_PER_PAGE)} />
            <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {/* <Pagination
                previousLabel="<"
                nextLabel=">"
                pageCount={pageCount}
                renderOnZeroPageCount={null}
                onPageChange={handlePageClick}
              /> */}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Transactions

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
