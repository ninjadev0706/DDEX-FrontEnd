/** @jsxImportSource theme-ui */
import { Flex, Spinner, Text } from '@ape.swap/uikit'
import { orderBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useFetchActiveChains, useFetchFavPairs, useFetchInfoPairs } from 'state/info/hooks'
import ReactPaginate from 'react-paginate'
import Rows from './Rows'
import styled from 'styled-components'
import useIsMobile from '../../../../hooks/useIsMobile'
import SectionHeader from '../SectionHeader'
import TrendingTokens from '../TrendingTokens/TrendingTokens'
import MonkeyImage from '../../../Dex/Orders/components/OrderHistoryPanel/MonkeyImage'

interface PairsProps {
  token?: string
  headerText: string
  showFavs?: boolean
  moreLink?: string
  filter?: string
  chain?: number
  amount?: number
  pageSize?: number
}

const Pairs: React.FC<PairsProps> = (props) => {
  const mobile = useIsMobile()
  const [activeChains] = useFetchActiveChains()

  const { token, headerText, showFavs, moreLink, filter, chain, amount, pageSize } = props

  const [pageCount, setPageCount] = useState(0)
  const [favsPageCount, setFavsPageCount] = useState(0)
  const ROWS_PER_PAGE = pageSize ? pageSize : 10
  const [dataOffset, setDataOffset] = useState(0)
  const pairs = useFetchInfoPairs(amount || 200, 0, token || '', '', chain ? chain : null)
  const [favs] = useFetchFavPairs()

  let flattenedPairs = Object.values(pairs).flatMap((row) => (row.initialized ? row.data : []))

  if (filter && filter !== '') {
    flattenedPairs = flattenedPairs.filter(
      (x) =>
        x.token0.name.toLowerCase().includes(filter.toLowerCase()) ||
        x.token1.name.toLowerCase().includes(filter.toLowerCase()) ||
        x.token0.symbol.toLowerCase().includes(filter.toLowerCase()) ||
        x.token1.symbol.toLowerCase().includes(filter.toLowerCase()) ||
        x.token0.id.toLowerCase().includes(filter.toLowerCase()) ||
        x.token1.id.toLowerCase().includes(filter.toLowerCase()) ||
        x.id.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  const sortedPairs = useMemo(
    () =>
      orderBy(
        flattenedPairs.filter((x) => activeChains === null || activeChains.includes(x.chainId)),
        ({ volumeUSD }) => parseFloat(volumeUSD),
        'desc',
      ),
    [flattenedPairs, activeChains],
  )

  const favPairs = useMemo(() => sortedPairs.filter((x) => favs.includes(x.id)), [sortedPairs, favs])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ROWS_PER_PAGE) % sortedPairs.length
    setDataOffset(newOffset)
  }

  const handleFavsPageClick = (event) => {
    const newOffset = (event.selected * ROWS_PER_PAGE) % favPairs.length
    setDataOffset(newOffset)
  }

  useEffect(() => {
    setPageCount(Math.ceil(sortedPairs.length / ROWS_PER_PAGE))
    setFavsPageCount(Math.ceil(favPairs.length / ROWS_PER_PAGE))
  }, [sortedPairs.length, favPairs.length, dataOffset, ROWS_PER_PAGE])

  return (
    <Flex sx={{ flexDirection: 'column', width: `${mobile ? '95vw' : '100%'}` }}>
      {showFavs === true && (
        <>
          <SectionHeader title="Favorite Pairs" />
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
            {favPairs.length > 0 ? (
              <>
                <Rows pairs={favPairs.slice(dataOffset, dataOffset + ROWS_PER_PAGE)} activeIndex={dataOffset} />
                <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  {/* <Pagination
                    previousLabel="<"
                    nextLabel=">"
                    pageCount={favsPageCount}
                    renderOnZeroPageCount={null}
                    onPageChange={handleFavsPageClick}
                  /> */}
                </Flex>
              </>
            ) : (
              <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
                <MonkeyImage />

                <Text mt={10}>Your favorite pairs will appear here</Text>
              </Flex>
            )}
          </Flex>
          <TrendingTokens />
        </>
      )}
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
        {sortedPairs.length > 0 ? (
          <>
            <Rows pairs={sortedPairs.slice(dataOffset, dataOffset + ROWS_PER_PAGE)} activeIndex={dataOffset} />
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
        ) : filter && filter !== '' ? (
          <Text ml={10}>No results. Please try again</Text>
        ) : (
          <Flex
            sx={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner size={250} />
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default Pairs

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
