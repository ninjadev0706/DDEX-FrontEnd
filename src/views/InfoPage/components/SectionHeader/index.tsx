/** @jsxImportSource theme-ui */
import { Flex, Svg, Text } from '@ape.swap/uikit'
import React from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'

interface SectionHeaderProps {
  title: string
  link?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  const mobile = useIsMobile()

  return (
    <Flex sx={{ flexDirection: 'row', width: `${mobile ? '95vw' : '100%'}`, mt: '20px' }}>
      <Flex sx={{ width: '50%', flexDirection: 'column' }}>
        <Text size="16px" weight={700}>
          {props.title}
        </Text>
      </Flex>
      {props.link && (
        <Flex sx={{ alignItems: 'flex-end', width: '50%', flexDirection: 'column' }}>
          <Text size="12px" weight={500}>
            <a href={props.link}>
              See more <Svg icon="caret" width="10px" direction="right" />
            </a>
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default SectionHeader
