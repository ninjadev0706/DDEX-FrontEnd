/** @jsxImportSource theme-ui */
import { Flex, Spinner } from '@ape.swap/uikit'
import React, { useMemo, useState } from 'react'
import { useFetchActiveChains, useFetchChartData } from '../../../../state/info/hooks'
import { INFO_PAGE_CHAIN_PARAMS } from 'config/constants/chains'
import { ChainId } from '@ape.swap/sdk'
import { RangeSelectorsWrapper } from '../styles'
import Figure from '../Figures/Figure'
import { map, groupBy } from 'lodash'
import ChartItem from './ChartItem'

interface ChartProps {
  chartType: string
  sevenDayVolume: (input: number) => void
  liquidity: number
}

type ChartData = {
  date?: string
  [ChainId.BSC]?: string
  [ChainId.TLOS]?: string
  [ChainId.MAINNET]?: string
  [ChainId.MATIC]?: string
  [ChainId.ARBITRUM]?: string
}

const Chart: React.FC<ChartProps> = (props) => {
  const { chartType, sevenDayVolume, liquidity } = props

  const [dataAmount, setDataAmount] = useState(chartType === 'liquidity' ? 30 : 7)

  const chartData = useFetchChartData(dataAmount)
  const [activeChains] = useFetchActiveChains()

  const flattenedChartData = Object.values(chartData).flatMap((item) => (item.initialized ? item.data : []))
  const groupedData = groupBy(flattenedChartData, (x) => (x ? x.date : ''))

  const mappedLiquidityData = useMemo(
    () =>
      map(groupedData, (x) => {
        const item: ChartData = {}
        item.date = x && x[0] ? x[0].date : ''
        for (let i = 0; i < x.length; i++) {
          if (!x || !x[i]) return

          if (activeChains === null || activeChains.includes(Number(x[i].chainId))) {
            item[x[i].chainId] = x[i].totalLiquidityUSD
          }
        }
        return item
      }),
    [groupedData, activeChains],
  )

  const mappedVolumeData = useMemo(
    () =>
      map(groupedData, (x) => {
        const item: ChartData = {}
        item.date = x && x[0] ? x[0].date : ''
        for (let i = 0; i < x.length; i++) {
          if (!x || !x[i]) return
          if (activeChains === null || activeChains.includes(Number(x[i].chainId))) {
            item[x[i].chainId] = x[i].dailyVolumeUSD
          }
        }
        return item
      }),
    [groupedData, activeChains],
  )

  const checkChartDataInitialized = useMemo(() => {
    let total = 0
    for (let i = 0; i < Object.keys(chartData).length; i++) {
      const chain = Object.keys(chartData)[i]
      total += chartData[chain].initialized === true && chartData[chain].loading === false ? 1 : 0
    }

    return total === Object.keys(chartData).length
  }, [chartData])

  const calculate7DayVolume = useMemo(() => {
    let total = 0

    mappedVolumeData.slice(0, 7).forEach((item: any) => {
      for (let i = 0; i < Object.keys(INFO_PAGE_CHAIN_PARAMS).length; i++) {
        total += item[Object.keys(INFO_PAGE_CHAIN_PARAMS)[i]] ? Number(item[Object.keys(INFO_PAGE_CHAIN_PARAMS)[i]]) : 0
      }
    })

    sevenDayVolume(total)

    return total
  }, [mappedVolumeData, sevenDayVolume])

  const UpdateChart = (amount: number) => {
    setDataAmount(amount)
  }

  return (
    <Flex
      sx={{
        width: '100%',
        minHeight: '402px',
        maxHeight: '402px',
        background: 'white2',
        borderRadius: '10px',
        padding: '20px',
        flexWrap: 'wrap',
      }}
    >
      {checkChartDataInitialized === true ? (
        <>
          {chartType === 'volume' ? (
            <Figure
              type="chart"
              label="Volume (7d)"
              icon="dollar"
              value={`$${Math.round((calculate7DayVolume * 100) / 100).toLocaleString()}`}
            />
          ) : (
            <Figure type="chart" label="Liquidty" icon="dollar" value={`$${Math.round(liquidity).toLocaleString()}`} />
          )}

          <RangeSelectorsWrapper>
            <ul>
              <li className={dataAmount === 7 ? 'active' : ''} onClick={() => UpdateChart(7)}>
                1W
              </li>
              <li className={dataAmount === 30 ? 'active' : ''} onClick={() => UpdateChart(30)}>
                1M
              </li>
              <li className={dataAmount === 365 ? 'active' : ''} onClick={() => UpdateChart(365)}>
                1Y
              </li>
              <li className={dataAmount === 999 ? 'active' : ''} onClick={() => UpdateChart(999)}>
                ALL
              </li>
            </ul>
          </RangeSelectorsWrapper>

          <ChartItem chartData={chartType === 'volume' ? mappedVolumeData : mappedLiquidityData} />
        </>
      ) : (
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '402px',
          }}
        >
          <Spinner size={250} />
        </Flex>
      )}
    </Flex>
  )
}

export default Chart
