/** @jsxImportSource theme-ui */
import { Flex, Spinner } from '@ape.swap/uikit'
import React, { useState } from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'
import Figure from './Figure'
import { useFetchActiveChains, useFetchInfoUniswapFactories } from '../../../../state/info/hooks'
import Showcases from '../Showcases'
import SwiperProvider from 'contexts/SwiperProvider'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import { Bubble } from '../styles'

interface FiguresProps {
  switchChart: () => void
  sevenDayVolume: number
  liquidity: (input: number) => void
}

const Figures: React.FC<FiguresProps> = (props) => {
  const mobile = useIsMobile()
  const [swiper, setSwiper] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const [chart, setChart] = useState('liquidity')

  const currentDayData = useFetchInfoUniswapFactories(true)
  const dayOldData = useFetchInfoUniswapFactories()
  const [activeChains] = useFetchActiveChains()

  const updateSlide = (index) => {
    swiper.slideTo(index)
    setActiveSlide(index)
  }

  function checkDatasInitialized() {
    let total = 0
    for (let i = 0; i < Object.keys(currentDayData).length; i++) {
      const chain = Object.keys(currentDayData)[i]
      total += currentDayData[chain].initialized === true ? 1 : 0
    }
    for (let i = 0; i < Object.keys(dayOldData).length; i++) {
      const chain = Object.keys(dayOldData)[i]
      total += dayOldData[chain].initialized === true ? 1 : 0
    }

    if (total === Object.keys(currentDayData).length + Object.keys(dayOldData).length) {
      props.liquidity(calculateCurrentFigures('totalLiquidityUSD'))
    }
    return total === Object.keys(currentDayData).length + Object.keys(dayOldData).length
  }

  function calculateCurrentFigures(key: string) {
    let total = 0

    for (let i = 0; i < Object.keys(currentDayData).length; i++) {
      const chain = Object.keys(currentDayData)[i]
      if (activeChains === null || activeChains.includes(Number(chain))) {
        total += currentDayData[chain].data ? Number(currentDayData[chain].data[key]) : 0
      }
    }

    return total
  }

  function calculateOneDayFigures(key: string) {
    let total = 0
    for (let i = 0; i < Object.keys(dayOldData).length; i++) {
      const chain = Object.keys(dayOldData)[i]
      if (activeChains === null || activeChains.includes(Number(chain))) {
        total += dayOldData[chain].data ? Number(dayOldData[chain].data[key]) : 0
      }
    }

    return total
  }

  function calculateFees() {
    return (calculateCurrentFigures('totalVolumeUSD') - calculateOneDayFigures('totalVolumeUSD')) * 0.002
  }

  function updateChart(input: string) {
    setChart(input)
    props.switchChart()
  }

  return (
    <Flex
      sx={{
        maxWidth: '100%',
        minHeight: `${mobile ? ' 220px' : '402px'}`,
        height: '100%',
        background: 'white2',
        borderRadius: '10px',
        gap: '20px',
        padding: '20px',
        flex: `1 0 ${mobile ? '100%' : '40%'}`,
        flexWrap: 'wrap',
      }}
    >
      {checkDatasInitialized() === true ? (
        <>
          {!mobile ? (
            <>
              <Figure
                label="Liquidity"
                icon="dollar"
                clickable={true}
                value={`$${Math.round(calculateCurrentFigures('totalLiquidityUSD')).toLocaleString()}`}
                highlighted={chart === 'liquidity'}
                onClick={() => updateChart('liquidity')}
              />
              <Figure
                label="Volume (7d)"
                icon="dollar"
                clickable={true}
                value={`$${Math.round((props.sevenDayVolume * 100) / 100).toLocaleString()}`}
                highlighted={chart === 'volume'}
                onClick={() => updateChart('volume')}
              />
              <Figure
                label="Volume (24h)"
                icon="dollar"
                value={`$${Math.round(
                  calculateCurrentFigures('totalVolumeUSD') - calculateOneDayFigures('totalVolumeUSD'),
                ).toLocaleString()}`}
              />
              <Figure
                label="Transactions (24h)"
                icon="chart"
                value={(calculateCurrentFigures('txCount') - calculateOneDayFigures('txCount')).toLocaleString()}
              />
              <Figure
                label="Fees (24h)"
                icon="dollar"
                value={`$${(Math.round(calculateFees() * 100) / 100).toLocaleString()}`}
              />
              <Figure label="Pairs" icon="chart" value={calculateCurrentFigures('pairCount').toLocaleString()} />

              <Showcases />
            </>
          ) : (
            <SwiperProvider>
              <Swiper
                id="serviceSwiper"
                initialSlide={0}
                spaceBetween={20}
                slidesPerView="auto"
                loopedSlides={2}
                loop={false}
                centeredSlides
                resizeObserver
                lazy
                onSwiper={setSwiper}
                style={{ maxWidth: '100%', minWidth: '100%', height: '175px' }}
              >
                <SwiperSlide style={{ maxWidth: '100%', minWidth: '100%' }}>
                  <Figure
                    label="Liquidity"
                    icon="dollar"
                    clickable={true}
                    value={Math.round(calculateCurrentFigures('totalLiquidityUSD')).toLocaleString()}
                    highlighted={chart === 'liquidity'}
                    onClick={() => updateChart('liquidity')}
                  />
                  <Figure
                    label="Volume (7d)"
                    icon="dollar"
                    clickable={true}
                    value={Math.round((props.sevenDayVolume * 100) / 100).toLocaleString()}
                    highlighted={chart === 'volume'}
                    onClick={() => updateChart('volume')}
                  />
                  <Figure
                    label="Volume (24h)"
                    icon="dollar"
                    value={Math.round(
                      calculateCurrentFigures('totalVolumeUSD') - calculateOneDayFigures('totalVolumeUSD'),
                    ).toLocaleString()}
                  />
                </SwiperSlide>
                <SwiperSlide style={{ maxWidth: '100%', minWidth: '100%' }}>
                  <Figure
                    label="Transactions (24h)"
                    icon="chart"
                    value={(calculateCurrentFigures('txCount') - calculateOneDayFigures('txCount')).toLocaleString()}
                  />
                  <Figure
                    label="Fees (24h)"
                    icon="dollar"
                    value={(Math.round(calculateFees() * 100) / 100).toLocaleString()}
                  />

                  <Figure label="Pairs" icon="chart" value={calculateCurrentFigures('pairCount').toLocaleString()} />
                </SwiperSlide>
              </Swiper>
              <Flex sx={{ width: '100%', justifyContent: 'center' }}>
                <Bubble isActive={0 === activeSlide} onClick={() => updateSlide(0)} />
                <Bubble isActive={1 === activeSlide} onClick={() => updateSlide(1)} />
              </Flex>
            </SwiperProvider>
          )}
        </>
      ) : (
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: `${mobile ? ' 220px' : '362px'}`,
          }}
        >
          <Spinner size={250} />
        </Flex>
      )}
    </Flex>
  )
}

export default Figures
