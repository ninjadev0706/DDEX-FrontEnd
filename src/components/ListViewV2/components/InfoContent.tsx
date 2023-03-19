/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, InfoIcon, Svg, TooltipBubble } from '@ape.swap/uikit'

const InfoContent = ({
  infoContent,
  expandedContent,
  expanded,
}: {
  infoContent?: React.ReactNode
  expandedContent?: React.ReactNode
  expanded: boolean
}) => {
  return (
    <>
      {infoContent && (
        <Flex sx={{ display: 'inline-block' }}>
          <TooltipBubble body={infoContent} transformTip="translate(11%, 0%)" width="205px">
            <InfoIcon width={'15px'} />
          </TooltipBubble>
        </Flex>
      )}
      {expandedContent && (
        <span style={{ marginLeft: '20px', transform: 'translate(0, -3px)' }}>
          <Svg icon="caret" direction={expanded ? 'up' : 'down'} width="10px" />
        </span>
      )}
    </>
  )
}

export default React.memo(InfoContent)
