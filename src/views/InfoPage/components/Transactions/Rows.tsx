/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { CHAIN_PARAMS } from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'
import useCurrentTime from 'hooks/useTimer'
import React from 'react'
import CountUp from 'react-countup'
import { Swaps } from 'state/info/types'
import { Grid } from 'theme-ui'
import getTimePeriods from 'utils/getTimePeriods'
import { StyledLink } from '../styles'

const Rows = ({ transactions }: { transactions: Swaps[] }) => {
  const { t } = useTranslation()
  const currentTime = useCurrentTime()

  return (
    <Flex
      sx={{
        width: '100%',
        maxWidth: '1200px',
        flexDirection: 'column',
        overflowX: 'scroll',
        overflowY: 'hidden',
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Grid
        gap="0px"
        columns={[`.05fr 3.5fr 1.5fr 2fr 2fr  1.5fr 2fr`]}
        sx={{ minHeight: '40px', alignItems: 'center', minWidth: '850px' }}
      >
        <span />
        <Text size="14px" weight={700} sx={{ alignSelf: 'center', zIndex: '999' }}></Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center', backgroundColor: 'white2', zIndex: '999' }}>
          {t('Total Value')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center', backgroundColor: 'white2', zIndex: '999' }}>
          {t('Token 1')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center', backgroundColor: 'white2', zIndex: '999' }}>
          {t('Token 2')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center', backgroundColor: 'white2', zIndex: '999' }}>
          {t('Address')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center', backgroundColor: 'white2', zIndex: '999' }}>
          {t('Time')}
        </Text>
      </Grid>
      <Flex sx={{ flexDirection: 'column' }}>
        {transactions.map(
          (
            {
              amount0In,
              amount0Out,
              amount1In,
              amount1Out,
              amount0,
              amount1,
              amountUSD,
              pair,
              to,
              transaction,
              chainId,
              sender,
            },
            index,
          ) => {
            const { id, timestamp } = transaction
            const { token0, token1 } = pair
            const tranType = parseFloat(amount0In) > 0 || parseFloat(amount0Out) > 0 ? 'Swap' : to ? 'Add' : 'Remove'
            const address = tranType !== 'Remove' ? to : sender
            const token0Amount =
              parseFloat(amount0In) > 0 || parseFloat(amount0Out) > 0
                ? Math.abs(parseFloat(amount0In) - parseFloat(amount0Out))
                : parseFloat(amount0)
            const token1Amount =
              parseFloat(amount1In) > 0 || parseFloat(amount1Out) > 0
                ? Math.abs(parseFloat(amount1In) - parseFloat(amount1Out))
                : parseFloat(amount1)
            const transactionTime = getTimePeriods(currentTime / 1000 - parseFloat(timestamp))
            const timeToDisplay = () => {
              if (transactionTime.days > 0) {
                return transactionTime.days === 1
                  ? transactionTime.days + ' day ago'
                  : transactionTime.days + ' days ago'
              }
              if (transactionTime.minutes > 0) {
                return transactionTime.minutes === 1
                  ? transactionTime.minutes + ' minute ago'
                  : transactionTime.minutes + ' minutes ago'
              }
              if (transactionTime.seconds > 0) {
                return transactionTime.seconds.toFixed(0) + ' seconds ago'
              }
              return 'Just now'
            }
            return (
              <Grid
                key={`${token0.id}-${id}-${to}-${amount0In}-${token1.id}`}
                gap="0px"
                columns={[`.05fr  3.5fr 1.5fr 2fr 2fr 1.5fr 2fr`]}
                sx={{
                  background: index % 2 === 0 ? 'white3' : 'white2',
                  height: '40px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '850px',
                }}
              >
                <span />
                <Flex sx={{ alignItems: 'center' }}>
                  <ServiceTokenDisplay token1={CHAIN_PARAMS[chainId]?.nativeCurrency.symbol} size={20} />
                  <Text size="14px" weight={400} ml="10px">
                    {tranType} {`${token0.symbol} ${tranType === 'Swap' ? '>' : 'and'} ${token1.symbol}`}
                  </Text>
                </Flex>
                <Flex>
                  {' '}
                  <Text size="14px" weight={400}>
                    $
                    {/* <CountUp
                      start={parseFloat(amountUSD)}
                      end={parseFloat(amountUSD)}
                      duration={0}
                      decimals={2}
                      separator=","
                    /> */}
                  </Text>
                </Flex>
                <Flex>
                  {' '}
                  <Text size="14px" weight={400}>
                    {/* <CountUp
                      start={token0Amount}
                      end={token0Amount}
                      duration={0}
                      decimals={token0Amount?.toLocaleString()?.length > 5 ? 5 : token0Amount?.toLocaleString()?.length}
                      separator=","
                    />{' '} */}
                    {token0.symbol}
                  </Text>
                </Flex>
                <Flex>
                  {' '}
                  <Text size="14px" weight={400}>
                    {/* <CountUp
                      start={token1Amount}
                      end={token1Amount}
                      decimals={token1Amount?.toLocaleString()?.length > 5 ? 5 : token1Amount?.toLocaleString()?.length}
                      duration={0}
                      separator=","
                    />{' '} */}
                    {token1.symbol}
                  </Text>
                </Flex>
                <Flex>
                  <Text size="14px" weight={400}>
                    {address && (
                      <StyledLink
                        href={`${CHAIN_PARAMS[chainId]?.blockExplorerUrls}/address/${address}`}
                        target="_blank"
                      >{`${address.slice(0, 4)}...${address.slice(address.length - 4, address.length)}`}</StyledLink>
                    )}
                  </Text>
                </Flex>
                <Flex>
                  {' '}
                  <Text size="14px" weight={400}>
                    {timeToDisplay()}
                  </Text>
                </Flex>
              </Grid>
            )
          },
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(Rows)
