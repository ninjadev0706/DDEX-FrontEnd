/** @jsxImportSource theme-ui */
import { Flex, Text, Button, Spinner, Svg } from '@ape.swap/uikit'
import React, { useState } from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'
import Transactions from '../../components/Transactions'
import {
  useFetchInfoBlock,
  useFetchInfoPairDaysData,
  useFetchInfoPairs,
  useFetchFavPairs,
} from '../../../../state/info/hooks'
import { useParams } from 'react-router-dom'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { useHistory } from 'react-router-dom'
import LineChart from 'views/InfoPage/components/LineChart'
import { RangeSelectorsWrapper } from '../../components/styles'
import CountUp from 'react-countup'
import useActiveWeb3React from '../../../../hooks/useActiveWeb3React'

const PairPage = () => {
  const history = useHistory()
  const [favs, toggleFav] = useFetchFavPairs()

  const { chain, pairId } = useParams<{ chain: string; pairId: string }>()
  const { chainId } = useActiveWeb3React()

  const [chartInfo, setChartInfo] = useState({ type: 'Volume', xField: 'date', yField: 'dailyVolumeUSD' })

  const UpdateChartType = (type: string, xField: string, yField: string) => {
    setChartInfo({ type: type, xField: xField, yField: yField })
  }

  useFetchInfoBlock()
  const [dataAmount, setDataAmount] = useState(30)
  const pairData = useFetchInfoPairs(20, 0, '', pairId, Number(chain))
  const pairDayOldData = useFetchInfoPairs(20, 1, '', pairId, Number(chain))
  const pairDaysData = useFetchInfoPairDaysData(Number(chain), pairId, dataAmount)

  const mobile = useIsMobile()

  const isFav = (token: string) => {
    return favs !== null && favs.filter((x) => x === token).length > 0
  }

  function percentageDifferenceText(previousValue: number, currentValue: number) {
    const value = ((currentValue - previousValue) / previousValue) * 100
    return (
      <Text fontSize="12px" color={value < 0 ? 'error' : 'success'} mt={0} mb={20}>
        {/* <CountUp end={value} decimals={2} duration={1.5} />% */}
      </Text>
    )
  }

  return (
    <Flex sx={{ width: '100%', justifyContent: 'center' }}>
      <Flex
        sx={{
          height: 'fit-content',
          width: '95vw',
          maxWidth: '1200px',
          alignItems: 'center',
          flexDirection: 'column',
          margin: '40px 0px',
        }}
      >
        <Flex
          sx={{
            width: '100%',
            justifyContext: 'flex-start',
          }}
          mb={20}
        >
          <Flex sx={{ width: '50%' }}>
            <a href="/info/pairs">&lt; All Pairs</a>
          </Flex>
          <Flex
            pl={6}
            onClick={() => toggleFav(pairId)}
            sx={{
              cursor: 'pointer',
              justifyContent: 'flex-end',
              width: `${mobile ? '100%' : '50%'}`,
            }}
          >
            <Svg icon="Fav" color={isFav(pairId) === true ? 'yellow' : 'gray'} />
          </Flex>
        </Flex>

        {pairData[chain].data !== null && typeof pairData[chain].data[0] !== 'undefined' && (
          <Flex
            sx={{
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <Flex
              sx={{
                width: `${mobile ? '100%' : '50%'}`,
                flexWrap: 'wrap',
              }}
            >
              <Flex sx={{ width: '100%' }}>
                <ServiceTokenDisplay
                  token1={pairData[chain].data[0].token0.symbol}
                  token2={pairData[chain].data[0].token1.symbol}
                  noEarnToken
                  size={25}
                  tokensMargin={-10}
                />
                <Text margin="2px 10px 0px 10px" weight={700} size="20px">
                  {pairData[chain].data[0].token0.symbol} - {pairData[chain].data[0].token1.symbol}
                </Text>
              </Flex>
              <Flex sx={{ width: '100%' }}>
                <Flex
                  sx={{
                    background: 'white2',
                    borderRadius: '10px',
                    padding: '10px 15px',
                    marginTop: '15px',
                    marginRight: '15px',
                  }}
                >
                  <Text weight={500} size="12px">
                    1 {pairData[chain].data[0].token0.symbol} ={' '}
                    {Number(pairData[chain].data[0].token1Price).toFixed(3).toLocaleString()}{' '}
                    {pairData[chain].data[0].token1.symbol}
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    background: 'white2',
                    borderRadius: '10px',
                    padding: '10px 15px',
                    marginTop: '15px',
                  }}
                >
                  <Text weight={500} size="12px">
                    1 {pairData[chain].data[0].token1.symbol} ={' '}
                    {Number(pairData[chain].data[0].token0Price).toFixed(3).toLocaleString()}{' '}
                    {pairData[chain].data[0].token0.symbol}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              sx={{
                width: `${mobile ? '100%' : '50%'}`,
                justifyContent: `${mobile ? 'flex-start' : 'flex-end'}`,
                marginTop: `${mobile ? '15px' : '0px'}`,
              }}
            >
              <Button
                sx={{ height: '44px' }}
                disabled={Number(chain) === chainId ? false : true}
                onClick={() =>
                  history.push(
                    `/add-liquidity/${pairData[chain].data[0].token0.id}/${pairData[chain].data[0].token1.id}`,
                  )
                }
              >
                Add Liquidity
              </Button>
              <Button
                sx={{ height: '44px' }}
                disabled={Number(chain) === chainId ? false : true}
                onClick={() => history.push('/swap')}
                ml={20}
              >
                Trade
              </Button>
            </Flex>
          </Flex>
        )}

        <Flex
          sx={{
            gap: '20px',
            width: `${mobile ? '95vw' : '100%'}`,
            maxWidth: '1200px',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Flex
            sx={{
              width: `${mobile ? '100%' : '300px'}`,
              height: '440px',
              background: 'white2',
              flexDirection: 'column',
              padding: '20px',
              borderRadius: '10px',
              mt: '20px',
            }}
          >
            {pairData[chain].data !== null &&
            pairData[chain].data[0] &&
            typeof pairData[chain].data[0] !== 'undefined' &&
            pairDayOldData[chain].data !== null &&
            pairDayOldData[chain].data[0] &&
            typeof pairDayOldData[chain].data[0] !== 'undefined' &&
            pairDaysData[chain].data !== null &&
            typeof pairDaysData[chain].data[0] !== 'undefined' ? (
              <>
                <Flex
                  sx={{
                    background: 'white3',
                    padding: '10px',
                    flexDirection: 'column',
                    borderRadius: '10px',
                  }}
                  mb={20}
                >
                  <Text margin="0px 10px 10px 0px" weight={500} size="16px" opacity={0.6}>
                    Total Tokens Locked
                  </Text>
                  <Flex sx={{ width: '100%' }} mb={5}>
                    <Flex sx={{ flex: 1 }}>
                      <ServiceTokenDisplay token1={pairData[chain].data[0].token0.symbol} size={20} />
                      <Text margin="1px 0px 0px 10px" weight={500} size="16px">
                        {pairData[chain].data[0].token0.symbol}
                      </Text>
                    </Flex>
                    <Flex
                      sx={{
                        alignItems: 'flex-end',
                        flex: 1,
                      }}
                    >
                      <Text margin="1px 0px 0px 10px" weight={500} size="16px">
                        {(Math.round(pairData[chain].data[0].reserve0 * 100) / 100).toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex sx={{ width: '100%' }}>
                    <Flex sx={{ flex: 1 }}>
                      <ServiceTokenDisplay token1={pairData[chain].data[0].token1.symbol} size={20} />
                      <Text margin="1px 0px 0px 10px" weight={500} size="16px">
                        {pairData[chain].data[0].token1.symbol}
                      </Text>
                    </Flex>
                    <Flex
                      sx={{
                        alignItems: 'flex-end',
                        flex: 1,
                      }}
                    >
                      <Text margin="1px 0px 0px 10px" weight={500} size="16px">
                        {(Math.round(pairData[chain].data[0].reserve1 * 100) / 100).toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>

                <Text margin="0px 10px 0px 0px" weight={500} size="16px" opacity={0.6}>
                  Total Liquidity
                </Text>
                <Text margin="5px 10px 5px 0px" weight={700} size="25px">
                  $
                  {(Math.round(pairData[chain].data[0].reserveUSD * 100) / 100).toLocaleString('en-US', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                    useGrouping: true,
                    notation: 'compact',
                    compactDisplay: 'short',
                  })}
                </Text>
                {percentageDifferenceText(pairDayOldData[chain].data[0].reserveUSD, pairData[chain].data[0].reserveUSD)}
                <Text margin="0px 10px 0px 0px" weight={500} size="16px" opacity={0.6}>
                  24h Trading Vol
                </Text>
                <Text margin="5px 10px 20px 0px" weight={700} size="25px">
                  $
                  {(
                    Math.round((pairData[chain].data[0].volumeUSD - pairDayOldData[chain].data[0].volumeUSD) * 100) /
                    100
                  ).toLocaleString('en-US', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                    useGrouping: true,
                    notation: 'compact',
                    compactDisplay: 'short',
                  })}
                </Text>
                <Text margin="0px 10px 0px 0px" weight={500} size="16px" opacity={0.6}>
                  24h Fees
                </Text>
                <Text margin="5px 10px 20px 0px" weight={700} size="25px">
                  $
                  {Math.round(
                    ((pairData[chain].data[0].volumeUSD - pairDayOldData[chain].data[0].volumeUSD) * 0.002 * 100) / 100,
                  ).toLocaleString('en-US', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                    useGrouping: true,
                    notation: 'compact',
                    compactDisplay: 'short',
                  })}
                </Text>
              </>
            ) : (
              <Flex
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '440px',
                }}
              >
                <Spinner size={250} />
              </Flex>
            )}
          </Flex>
          <Flex
            sx={{
              flex: '1',
              height: '440px',
              background: 'white2',
              flexDirection: 'column',
              padding: '10px',
              borderRadius: '10px',
              mt: '20px',
            }}
          >
            {pairDaysData[chain].data !== null && typeof pairDaysData[chain].data[0] !== 'undefined' ? (
              <>
                <Flex>
                  <Flex sx={{ width: '50%' }}>
                    <RangeSelectorsWrapper>
                      <ul>
                        <li
                          className={chartInfo.type.toLowerCase() === 'volume' ? 'active' : ''}
                          onClick={() => UpdateChartType('Volume', 'date', 'dailyVolumeUSD')}
                        >
                          Volume
                        </li>
                        <li
                          className={chartInfo.type.toLowerCase() === 'liquidity' ? 'active' : ''}
                          onClick={() => UpdateChartType('Liquidity', 'date', 'reserveUSD')}
                        >
                          Liquidity
                        </li>
                      </ul>
                    </RangeSelectorsWrapper>
                  </Flex>
                  <Flex sx={{ width: '50%', justifyContent: 'right' }} mr={5}>
                    <RangeSelectorsWrapper>
                      <ul>
                        <li className={dataAmount === 7 && 'active'} onClick={() => setDataAmount(7)}>
                          1W
                        </li>
                        <li className={dataAmount === 30 && 'active'} onClick={() => setDataAmount(30)}>
                          1M
                        </li>
                        <li className={dataAmount === 365 && 'active'} onClick={() => setDataAmount(365)}>
                          1Y
                        </li>
                        <li className={dataAmount === 999 && 'active'} onClick={() => setDataAmount(999)}>
                          ALL
                        </li>
                      </ul>
                    </RangeSelectorsWrapper>
                  </Flex>
                </Flex>
                <LineChart
                  data={pairDaysData[chain].data}
                  xField={chartInfo.xField}
                  yField={chartInfo.yField}
                  type={chartInfo.type}
                />
              </>
            ) : (
              <Flex
                sx={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '440px',
                }}
              >
                <Spinner size={250} />
              </Flex>
            )}
          </Flex>
        </Flex>
        {pairData[chain].data !== null && typeof pairData[chain].data[0] !== 'undefined' && (
          <Transactions
            headerText="Transactions"
            token={pairData[chain].data[0].token0.id}
            token2={pairData[chain].data[0].token1.id}
            amount={1000}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default PairPage
