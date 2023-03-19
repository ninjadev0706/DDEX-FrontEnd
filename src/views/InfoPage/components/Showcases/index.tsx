/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'
import { ShowcaseWrapper, Bubble } from '../styles'
import SwiperProvider from 'contexts/SwiperProvider'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'
import { Flex, Text } from '@ape.swap/uikit'
import { useFetchHomepageServiceStats, useHomepageServiceStats } from '../../../../state/hooks'
import ServiceTokenDisplay from '../../../../components/ServiceTokenDisplay'
import useTheme from '../../../../hooks/useTheme'

const InfoShowcases = () => {
  const mobile = useIsMobile()
  const { isDark } = useTheme()
  const [activeSlide, setActiveSlide] = useState(0)
  const [swiper, setSwiper] = useState(null)
  useFetchHomepageServiceStats(true)
  const stats = useHomepageServiceStats()

  const showcases = [
    {
      id: 0,
      imgDay: '/images/info/farms-day.svg',
      imgNight: '/images/info/farms-day.svg',
      alt: 'Farms Spotlight',
      link: '/farms',
      title: 'Trending Farms',
      type: 'farmDetails',
    },
    {
      id: 1,
      imgDay: '/images/info/bills-day.svg',
      imgNight: '/images/info/bills-night.svg',
      alt: 'Maximizers Spotlight',
      link: '/treasury-bills',
      title: 'Trending Bills',
      type: 'billDetails',
    },
  ]

  const updateSlide = (index) => {
    swiper.slideTo(index)
    setActiveSlide(index)
  }

  return (
    <>
      {mobile === false ? (
        showcases.map((showcase, index) => {
          return (
            <ShowcaseWrapper key={showcase.id} background={isDark ? showcase.imgNight : showcase.imgDay}>
              <Text weight={700} sx={{ color: '#FFFFFF' }}>
                {showcase.title}
              </Text>
              {stats !== null &&
                stats[showcase.type].slice(0, 2).map((stat) => {
                  return (
                    <Flex className="showcaseItem" key={showcase.type === 'billDetails' ? stat.billAddress : stat.id}>
                      <Flex sx={{ minWidth: '100px' }}>
                        <ServiceTokenDisplay
                          token1={
                            (showcase.type === 'billDetails' ? stat.lpTokenName : stat.stakeToken.name).split('-')[0]
                          }
                          token2={
                            (showcase.type === 'billDetails' ? stat.lpTokenName : stat.stakeToken.name).split('-')[1]
                          }
                          token3={showcase.type === 'billDetails' ? stat.earnTokenName : stat.rewardToken.name}
                          stakeLp={true}
                          size={25}
                          tokensMargin={-10}
                        />
                      </Flex>
                      <Flex sx={{ flexWrap: 'wrap' }}>
                        <Flex sx={{ flex: '0 0 100%' }}>
                          <Text sx={{ color: '#4d4040' }}>
                            {showcase.type === 'billDetails' ? stat.lpTokenName : stat.stakeToken.name}
                          </Text>
                        </Flex>
                        <Flex sx={{ flex: '0 0 100%', marginTop: '-5px' }}>
                          <Text sx={{ color: '#4d4040' }} weight={400} size="14px">
                            {showcase.type === 'billDetails'
                              ? `Discount: ${stat.discount.toFixed(2).toLocaleString()}%`
                              : `APR: ${(stat.apr * 100).toFixed(2).toLocaleString()}%`}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  )
                })}
              <div className="showcaseLink">
                <a href={showcase.link}>
                  <Text sx={{ color: '#FFFFFF' }}>See More</Text>
                </a>
              </div>
            </ShowcaseWrapper>
          )
        })
      ) : (
        <Flex
          sx={{
            width: '95vw',
            height: 'fit-content',
            mt: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <SwiperProvider>
            <Swiper
              id="serviceSwiper"
              initialSlide={0}
              spaceBetween={0}
              slidesPerView="auto"
              loopedSlides={2}
              loop={false}
              centeredSlides
              resizeObserver
              lazy
              onSwiper={setSwiper}
              style={{ maxWidth: '100%' }}
            >
              {showcases.map((showcase, index) => {
                return (
                  <SwiperSlide style={{ maxWidth: '100%', minWidth: '100%' }} key={showcase.id}>
                    <ShowcaseWrapper key={showcase.id} background={isDark ? showcase.imgNight : showcase.imgDay}>
                      <Text weight={700} sx={{ color: '#FFFFFF' }}>
                        {showcase.title}
                      </Text>
                      {stats !== null &&
                        stats[showcase.type].slice(0, 2).map((stat) => {
                          return (
                            <Flex
                              className="showcaseItem"
                              key={showcase.type === 'billDetails' ? stat.billAddress : stat.id}
                            >
                              <Flex sx={{ minWidth: '100px' }}>
                                <ServiceTokenDisplay
                                  token1={
                                    (showcase.type === 'billDetails' ? stat.lpTokenName : stat.stakeToken.name).split(
                                      '-',
                                    )[0]
                                  }
                                  token2={
                                    (showcase.type === 'billDetails' ? stat.lpTokenName : stat.stakeToken.name).split(
                                      '-',
                                    )[1]
                                  }
                                  token3={showcase.type === 'billDetails' ? stat.earnTokenName : stat.rewardToken.name}
                                  stakeLp={true}
                                  size={25}
                                  tokensMargin={-10}
                                />
                              </Flex>
                              <Flex sx={{ flexWrap: 'wrap' }}>
                                <Flex sx={{ flex: '0 0 100%' }}>
                                  <Text sx={{ color: '#4d4040' }}>
                                    {showcase.type === 'billDetails' ? stat.lpTokenName : stat.stakeToken.name}
                                  </Text>
                                </Flex>
                                <Flex sx={{ flex: '0 0 100%', marginTop: '-5px' }}>
                                  <Text sx={{ color: '#4d4040' }} weight={400} size="14px">
                                    {showcase.type === 'billDetails'
                                      ? `Discount: ${stat.discount.toFixed(2).toLocaleString()}%`
                                      : `APR: ${(stat.apr * 100).toFixed(2).toLocaleString()}%`}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Flex>
                          )
                        })}
                      <div className="showcaseLink">
                        <a href={showcase.link}>
                          <Text sx={{ color: '#FFFFFF' }}>See More</Text>
                        </a>
                      </div>
                    </ShowcaseWrapper>
                  </SwiperSlide>
                )
              })}
            </Swiper>
            <Flex sx={{ width: '100%', mt: '10px' }} justifyContent="center" alignContent="center">
              {showcases.map((showcase, index) => {
                return <Bubble isActive={index === activeSlide} onClick={() => updateSlide(index)} key={index} />
              })}
            </Flex>
          </SwiperProvider>
        </Flex>
      )}
    </>
  )
}

export default InfoShowcases
