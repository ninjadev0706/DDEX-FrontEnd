import { Flex, Text } from '@ape.swap/uikit'
import React, { useEffect, useRef, useState } from 'react'
import { Bar, Container, Indicator, StyledTabNavStats, Tab } from './styles'

interface TabNavProps {
  activeTab: string
  tabOptions: string[]
  onChangeActiveTab: (tab: string) => void
  ownedBillsAmount?: number
}

export const TabNav: React.FC<TabNavProps> = ({ tabOptions, activeTab, onChangeActiveTab, ownedBillsAmount }) => {
  const [width, setWidth] = useState(0)
  const [left, setLeft] = useState(0)
  const refs = useRef([])

  const handleActiveTab = (el: HTMLDivElement, tab: string) => {
    setLeft(el.offsetLeft)
    setWidth(el.offsetWidth)

    onChangeActiveTab(tab)
  }

  useEffect(() => {
    setLeft(refs.current[0].offsetLeft)
    setWidth(refs.current[0].offsetWidth)
  }, [])

  return (
    <>
      <Container>
        <StyledTabNavStats columns={tabOptions.length}>
          <Indicator style={{ left, width }} />
          {tabOptions.map((tab, index) => (
            <Tab
              key={tab}
              ref={(element) => {
                refs.current[index] = element
              }}
              onClick={() => tab !== 'Products' && handleActiveTab(refs.current[index], tab)}
              isActive={activeTab === tab}
              disabled={tab === 'Products'}
            >
              <Flex sx={{ alignItems: 'center' }}>
                {tab}
                {tab === 'Products' && (
                  <Flex
                    sx={{
                      background: 'yellow',
                      height: '16px',
                      padding: '0px 5px',
                      pt: '2px',
                      borderRadius: '5px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: '5px',
                    }}
                  >
                    <Text size="10px" weight={700} color="primaryBright">
                      SOON!
                    </Text>
                  </Flex>
                )}
                {tab === 'Your Bills' && ` (${ownedBillsAmount})`}
              </Flex>
            </Tab>
          ))}
        </StyledTabNavStats>
        <Bar />
      </Container>
    </>
  )
}
