/** @jsxImportSource theme-ui */
import { Flex } from '@ape.swap/uikit'
import React, { useState } from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'
import Figures from '../Figures'
import Chart from '../Chart'

const Overview = () => {
  const mobile = useIsMobile()
  const [chartType, setChartType] = useState('liquidity')
  const [sevenDayVolume, setSevenDayVolume] = useState(0)
  const [liquidity, setLiquidity] = useState(0)

  function switchChart() {
    setChartType(chartType === 'liquidity' ? 'volume' : 'liquidity')
  }

  return (
    <Flex
      sx={{
        gap: '20px',
        width: `${mobile ? '95vw' : '100%'}`,
        maxWidth: '1200px',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Figures switchChart={switchChart} sevenDayVolume={sevenDayVolume} liquidity={setLiquidity} />
      <Flex
        sx={{
          minHeight: '402px',
          height: '100%',
          background: 'white2',
          borderRadius: '10px',
          flex: `1 0 ${mobile ? '100%' : '40%'}`,
        }}
      >
        <Chart chartType={chartType} sevenDayVolume={setSevenDayVolume} liquidity={liquidity}></Chart>
      </Flex>
    </Flex>
  )
}

export default Overview
