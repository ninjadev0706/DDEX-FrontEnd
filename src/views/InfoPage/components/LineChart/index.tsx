/** @jsxImportSource theme-ui */
import { Flex, Spinner } from '@ape.swap/uikit'
import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { Section } from '../styles'
import moment from 'moment/moment'

interface LineChartProps {
  data?: []
  xField: string
  yField: string
  type: string
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const { data, xField, yField, type } = props

  const formattedData = [
    {
      id: type,
      color: 'hsl(171%, 70%, 50%)',
      data: [],
    },
  ]

  formattedData[0].data = data.map((a) => ({ y: a[yField], x: a[xField] })).reverse()

  function generateToolTip(data: any) {
    return (
      <Section className="smallSection">
        <div className="header">
          <div className="wrapper">
            Date: <div className="value">{moment.unix(Number(data.point.data.x)).format('MMM DD, YYYY').valueOf()}</div>
          </div>
        </div>
        <div className="body">
          <div className="wrapper">
            {type}:
            <div className="value">
              $
              {(Math.round(data.point.data.y * 100) / 100).toLocaleString('en-US', {
                style: 'decimal',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
                useGrouping: true,
                notation: 'compact',
                compactDisplay: 'short',
              })}
            </div>
          </div>
        </div>
      </Section>
    )
  }

  return (
    <>
      {/* {formattedData[0].data !== [] ? (
        <Flex sx={{ height: '370px' }} mt={10}>
          <ResponsiveLine
            data={formattedData}
            areaOpacity={1}
            enableGridX={false}
            enableGridY={false}
            enablePoints={false}
            axisBottom={null}
            axisTop={null}
            axisRight={null}
            axisLeft={null}
            enableArea={true}
            isInteractive={true}
            useMesh={true}
            tooltip={(data) => generateToolTip(data)}
            colors="#FFB300"
            defs={[
              {
                id: 'gradient',
                type: 'linearGradient',
                gradientTransform: 'rotate(53.53 0.5 0.5)',
                opacity: 0.4,
                colors: [
                  { offset: 15.88, color: '#E1B242', opacity: 0.4 },
                  { offset: 92.56, color: '#A16552', opacity: 0.4 },
                ],
              },
            ]}
            fill={[{ match: '*', id: 'gradient' }]}
          />
        </Flex>
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
      )} */}
    </>
  )
}

export default LineChart
