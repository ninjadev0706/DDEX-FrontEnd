/** @jsxImportSource theme-ui */

import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import moment from 'moment/moment'
import { ChartWrapper, Section } from '../styles'
import { useFetchActiveChains } from '../../../../state/info/hooks'
import { INFO_PAGE_CHAIN_PARAMS } from '../../../../config/constants/chains'
import useTheme from '../../../../hooks/useTheme'

interface ChartItemProps {
  chartData: any
}

const ChartItem: React.FC<ChartItemProps> = (props) => {
  const { isDark } = useTheme()
  const [activeChains] = useFetchActiveChains()
  const { chartData } = props

  function getBarColor(bar: any) {
    const chain = INFO_PAGE_CHAIN_PARAMS[bar.id]
    return chain ? chain.color : '#000000'
  }

  function getChartTextColor() {
    return isDark ? '#FFFFFF' : '#333333'
  }

  function generateToolTip(data: any) {
    let total = 0
    for (let i = 0; i < activeChains.length; i++) {
      total += Number(data.data[activeChains[i]] ?? 0)
    }
    return (
      <Section className="smallSection">
        <div className="header">
          <div className="wrapper">
            Date: <div className="value">{moment.unix(Number(data.data.date)).format('MMM DD, YYYY').valueOf()}</div>
          </div>
          <div className="wrapper">
            Total: <div className="value">${Math.round(total).toLocaleString()}</div>
          </div>
        </div>
        <div className="body">
          {(activeChains === null || activeChains.includes(Number(1))) && (
            <div className="wrapper">
              <div className="indicator eth"></div>Ethereum:
              <div className="value">${Math.round(data.data[1] ?? 0).toLocaleString()}</div>
            </div>
          )}
          {(activeChains === null || activeChains.includes(Number(40))) && (
            <div className="wrapper">
              <div className="indicator telos"></div>Telos:
              <div className="value">${Math.round(data.data[40] ?? 0).toLocaleString()}</div>
            </div>
          )}
          {(activeChains === null || activeChains.includes(Number(56))) && (
            <div className="wrapper">
              <div className="indicator bnb"></div>BNB:
              <div className="value">${Math.round(data.data[56] ?? 0).toLocaleString()}</div>
            </div>
          )}
          {(activeChains === null || activeChains.includes(Number(137))) && (
            <div className="wrapper">
              <div className="indicator polygon"></div>Polygon:
              <div className="value">${Math.round(data.data[137] ?? 0).toLocaleString()}</div>
            </div>
          )}
          {(activeChains === null || activeChains.includes(Number(42161))) && (
            <div className="wrapper">
              <div className="indicator arbitrum"></div>Arbitrum:
              <div className="value">${Math.round(data.data[42161] ?? 0).toLocaleString()}</div>
            </div>
          )}
        </div>
      </Section>
    )
  }

  return (
    <ChartWrapper>
      <ResponsiveBar
        data={chartData}
        keys={['1', '137', '40', '56', '42161']}
        indexBy="date"
        groupMode="stacked"
        padding={0.3}
        renderWrapper={true}
        theme={{
          fontSize: 14,
          fontFamily: 'Poppins',
          textColor: getChartTextColor(),
        }}
        colors={getBarColor}
        axisBottom={{
          tickSize: 0,
          tickPadding: 15,
          tickRotation: 0,
          format: (x) => '',
        }}
        axisLeft={null}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        axisTop={null}
        enableLabel={false}
        enableGridX={false}
        enableGridY={false}
        animate={false}
        tooltip={(data) => generateToolTip(data)}
        margin={{ top: 0, right: 0, bottom: 25, left: 0 }}
      />
    </ChartWrapper>
  )
}

export default ChartItem
