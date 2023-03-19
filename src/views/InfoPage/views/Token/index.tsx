/** @jsxImportSource theme-ui */
import { Flex, Text, Button, Spinner, Svg } from '@ape.swap/uikit'
import React, { useState } from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'
import Pairs from '../../components/Pairs'
import Transactions from '../../components/Transactions'
import {
  useFetchFavTokens,
  useFetchInfoBlock,
  useFetchInfoTokenDaysData,
  useFetchInfoTokensData,
} from '../../../../state/info/hooks'
import { useParams } from 'react-router-dom'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { useHistory } from 'react-router-dom'
import LineChart from 'views/InfoPage/components/LineChart'
import { RangeSelectorsWrapper } from '../../components/styles'
import CountUp from 'react-countup'
import useActiveWeb3React from '../../../../hooks/useActiveWeb3React'

const TokenPage = () => {
  const history = useHistory()
  const [favs, toggleFav] = useFetchFavTokens()

  const { chain, tokenId } = useParams<{ chain: string; tokenId: string }>()
  const { chainId } = useActiveWeb3React()

  const [chartInfo, setChartInfo] = useState({ type: 'Price', xField: 'date', yField: 'priceUSD' })

  const UpdateChartType = (type: string, xField: string, yField: string) => {
    setChartInfo({ type: type, xField: xField, yField: yField })
  }

  useFetchInfoBlock()
  const [dataAmount, setDataAmount] = useState(30)
  const tokenDaysData = useFetchInfoTokenDaysData(Number(chain), tokenId, dataAmount)
  const tokenData = useFetchInfoTokensData(1, true, tokenId, Number(chain))
  const tokenDayOldData = useFetchInfoTokensData(1, false, tokenId, Number(chain))
  const mobile = useIsMobile()

  const calculate7DayVolume = () => {
    let total = 0

    // This is to account for new data that isn't 7 days old yet
    const daysCount = tokenDaysData[chain].data.length > 6 ? 7 : tokenDaysData[chain].data.length

    for (let i = tokenDaysData[chain].data.length - daysCount; i < tokenDaysData[chain].data.length; i++) {
      total += Number(tokenDaysData[chain].data[i].dailyVolumeUSD)
    }

    return total
  }

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
            <a href="/info/tokens">&lt; All Tokens</a>
          </Flex>
          <Flex
            pl={6}
            onClick={() => toggleFav(tokenId)}
            sx={{
              cursor: 'pointer',
              justifyContent: 'flex-end',
              width: '50%',
            }}
          >
            <Svg icon="Fav" color={isFav(tokenId) === true ? 'yellow' : 'gray'} />
          </Flex>
        </Flex>

        {tokenDaysData[chain].data !== null && typeof tokenDaysData[chain].data[0] !== 'undefined' && (
          <>
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
                  <ServiceTokenDisplay token1={tokenDaysData[chain].data[0].token.symbol} size={25} />
                  <Text margin="2px 10px 0px 10px" weight={700} size="20px">
                    {tokenDaysData[chain].data[0].token.name}
                  </Text>
                  <Text margin="2px 10px 0px 0px" weight={400} size="20px" opacity={0.6}>
                    ({tokenDaysData[chain].data[0].token.symbol})
                  </Text>
                </Flex>
                <Flex sx={{ width: '100%' }}>
                  <Text margin="20px 10px 0px 10px" weight={700} size="35px">
                    ${(Math.round(tokenDaysData[chain].data[0].priceUSD * 100) / 100).toLocaleString()}
                  </Text>
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
                  disabled={Number(chain) === chainId ? false : true}
                  onClick={() => history.push(`/add-liquidity/ETH/${tokenId}`)}
                  sx={{ height: '44px' }}
                >
                  Add Liquidity
                </Button>
                <Button
                  disabled={Number(chain) === chainId ? false : true}
                  onClick={() => history.push('/swap')}
                  ml={20}
                  sx={{ height: '44px' }}
                >
                  Trade
                </Button>
              </Flex>
            </Flex>
          </>
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
              padding: '30px',
              borderRadius: '10px',
              mt: '20px',
            }}
          >
            {tokenDaysData[chain].data !== null &&
            typeof tokenDaysData[chain].data[0] !== 'undefined' &&
            tokenData[chain].data !== null &&
            typeof tokenData[chain].data[0] !== 'undefined' &&
            // tokenData[chain].data[0] !== [] &&
            tokenDayOldData[chain].data !== null &&
            typeof tokenDayOldData[chain].data[0] !== 'undefined' ? (
              <>
                <Text margin="0px 10px 0px 0px" weight={500} size="16px" opacity={0.6}>
                  Total Liquidity
                </Text>
                <Text margin="5px 10px 5px 0px" weight={700} size="25px">
                  $
                  {(
                    Math.round(tokenData[chain].data[0].totalLiquidity * tokenDaysData[chain].data[0].priceUSD * 100) /
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
                {percentageDifferenceText(
                  tokenDayOldData[chain].data[0].totalLiquidity,
                  tokenData[chain].data[0].totalLiquidity,
                )}
                <Text margin="0px 10px 0px 0px" weight={500} size="16px" opacity={0.6}>
                  24h Trading Vol
                </Text>
                <Text margin="5px 10px 30px 0px" weight={700} size="25px">
                  $
                  {(
                    Math.round(
                      (tokenData[chain].data[0].tradeVolumeUSD - tokenDayOldData[chain].data[0].tradeVolumeUSD) * 100,
                    ) / 100
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
                  7d Trading Vol
                </Text>
                <Text margin="5px 10px 30px 0px" weight={700} size="25px">
                  {`$${Math.round((calculate7DayVolume() * 100) / 100).toLocaleString('en-US', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                    useGrouping: true,
                    notation: 'compact',
                    compactDisplay: 'short',
                  })}`}
                </Text>
                <Text margin="0px 10px 0px 0px" weight={500} size="16px" opacity={0.6}>
                  24h Fees
                </Text>
                <Text margin="5px 10px 5px 0px" weight={700} size="25px">
                  $
                  {Math.round(
                    ((tokenData[chain].data[0].tradeVolumeUSD - tokenDayOldData[chain].data[0].tradeVolumeUSD) *
                      0.002 *
                      100) /
                      100,
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
              height: `${mobile ? '460px' : '440px'}`,
              background: 'white2',
              flexDirection: 'column',
              padding: '10px',
              borderRadius: '10px',
              mt: '20px',
            }}
          >
            {tokenDaysData[chain].data !== null && typeof tokenDaysData[chain].data[0] !== 'undefined' ? (
              <>
                <Flex>
                  <Flex sx={{ width: '50%' }}>
                    <RangeSelectorsWrapper>
                      <ul>
                        <li
                          className={chartInfo.type.toLowerCase() === 'price' ? 'active' : ''}
                          onClick={() => UpdateChartType('Price', 'date', 'priceUSD')}
                        >
                          Price
                        </li>
                        <li
                          className={chartInfo.type.toLowerCase() === 'volume' ? 'active' : ''}
                          onClick={() => UpdateChartType('Volume', 'date', 'dailyVolumeUSD')}
                        >
                          Volume
                        </li>
                        <li
                          className={chartInfo.type.toLowerCase() === 'liquidity' ? 'active' : ''}
                          onClick={() => UpdateChartType('Liquidity', 'date', 'totalLiquidityUSD')}
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
                  data={tokenDaysData[chain].data}
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
                  height: `${mobile ? '460px' : '440px'}`,
                }}
              >
                <Spinner size={250} />
              </Flex>
            )}
          </Flex>
        </Flex>

        {tokenDaysData[chain].data !== null && typeof tokenDaysData[chain].data[0] !== 'undefined' && (
          <Pairs
            token={tokenId}
            headerText={`${tokenDaysData[chain].data[0].token.symbol} Pairs`}
            chain={Number(chain)}
          />
        )}

        <Transactions headerText="Transactions" token={tokenId} chain={Number(chain)} amount={1000} />
      </Flex>
    </Flex>
  )
}

export default TokenPage
