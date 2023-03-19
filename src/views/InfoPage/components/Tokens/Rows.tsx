/** @jsxImportSource theme-ui */
import { ChainId } from '@ape.swap/sdk'
import { Flex, Link, Svg, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { CHAIN_PARAMS } from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'
import useIsMobile from 'hooks/useIsMobile'
import React from 'react'
import CountUp from 'react-countup'
import { useFetchFavTokens, useFetchInfoNativePrice, useFetchInfoTokensData } from 'state/info/hooks'
import { Token } from 'state/info/types'
import { Grid } from 'theme-ui'

const Rows = ({ tokens, activeIndex }: { tokens: Token[]; activeIndex: number }) => {
  const { t } = useTranslation()
  const nativePrice = useFetchInfoNativePrice()
  const mobile = useIsMobile()
  const dayOldTokens = useFetchInfoTokensData(300)
  const [favs, toggleFav] = useFetchFavTokens()

  const get24HourVolume = (chainId: ChainId, id: string) => {
    try {
      const volume = dayOldTokens[chainId]?.data.find(({ id: curId }) => curId === id).tradeVolumeUSD
      return parseFloat(volume)
    } catch {
      return 0
    }
  }

  const isFav = (token: string) => {
    return favs !== null && favs.filter((x) => x === token).length > 0
  }

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
        columns={[
          `${mobile ? '.5fr' : '.25fr'} ${mobile ? '.5fr' : '.25fr'}  ${
            mobile ? '1.5fr' : '2.75fr'
          } 1.25fr 1.5fr 1.5fr`,
        ]}
        sx={{ minHeight: '40px', alignItems: 'center', minWidth: '450px' }}
      >
        <Text></Text>
        <Text pl={3}>#</Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Token Name')}
        </Text>{' '}
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Price')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Liquidity')}
        </Text>
        <Text size="14px" weight={700} sx={{ alignSelf: 'center' }}>
          {t('Volume (24hs)')}
        </Text>
        <span />
      </Grid>
      <Flex sx={{ flexDirection: 'column' }}>
        {tokens.map(({ derivedETH, id, name, symbol, totalLiquidity, tradeVolumeUSD, chainId }, index) => {
          const currentNativePrice = parseFloat(nativePrice[chainId]?.data?.ethPrice ?? '0')
          const currentAssetPrice = currentNativePrice * parseFloat(derivedETH)
          const currentAssetLiquidity = parseFloat(totalLiquidity) * currentNativePrice * parseFloat(derivedETH)
          return (
            <Grid
              key={id}
              gap="0px"
              columns={[
                `${mobile ? '.5fr' : '.25fr'} ${mobile ? '.5fr' : '.25fr'}  ${
                  mobile ? '1.5fr' : '2.75fr'
                } 1.25fr 1.5fr 1.5fr`,
              ]}
              sx={{
                background: index % 2 === 0 ? 'white3' : 'white2',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '450px',
              }}
            >
              <Flex pl={6} onClick={() => toggleFav(id)} sx={{ cursor: 'pointer' }}>
                <Svg icon="Fav" color={isFav(id) === true ? 'yellow' : 'gray'} />
              </Flex>
              <Flex>
                <Text size="14px" weight={400} pl={4}>
                  {index + 1 + activeIndex}
                </Text>
              </Flex>
              <Flex sx={{ alignItems: 'center' }}>
                <ServiceTokenDisplay token1={symbol} size={20} />
                <Flex
                  sx={{
                    marginLeft: '-7px',
                    marginTop: '-12px',
                  }}
                >
                  <ServiceTokenDisplay token1={CHAIN_PARAMS[chainId].nativeCurrency.symbol} size={12} />
                </Flex>
                <Text size="14px" weight={400} ml="10px">
                  <Link href={`/info/token/${chainId}/${id}`}>{mobile ? symbol : `${name} (${symbol})`}</Link>
                </Text>
              </Flex>
              <Flex>
                <Text size="14px" weight={400}>
                  $
                  {/* <CountUp start={currentAssetPrice} end={currentAssetPrice} decimals={3} duration={0} separator="," /> */}
                </Text>
              </Flex>
              <Flex>
                <Text size="14px" weight={400}>
                  $
                  {/* <CountUp start={currentAssetLiquidity} end={currentAssetLiquidity} duration={0} separator="," />{' '} */}
                </Text>
              </Flex>
              <Flex>
                {' '}
                <Text size="14px" weight={400}>
                  $
                  {/* <CountUp
                    start={parseFloat(tradeVolumeUSD) - get24HourVolume(chainId, id)}
                    end={parseFloat(tradeVolumeUSD) - get24HourVolume(chainId, id)}
                    duration={0}
                    separator=","
                  />{' '} */}
                </Text>
              </Flex>
            </Grid>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default React.memo(Rows)
