/** @jsxImportSource theme-ui */
import { Flex, Svg, TooltipBubble } from '@ape.swap/uikit'
import { InfoIcon } from '@apeswapfinance/uikit'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ContentContainer, ListCardContainer, styles } from './styles'
import { ListCardProps } from './types'

const ListCard: React.FC<ListCardProps> = ({
  serviceTokenDisplay,
  tag,
  title,
  cardContent,
  expandedContent,
  infoContent,
  infoContentPosition,
  expandedContentJustified,
  titleContainerWidth,
  open,
  alignServiceTokens,
  toolTipIconWidth,
  ttWidth,
  backgroundColor,
  beforeTokenContent,
}) => {
  const [expanded, setExpanded] = useState(open)
  return (
    <>
      <ListCardContainer onClick={() => setExpanded((prev) => !prev)} backgroundColor={backgroundColor}>
        <Flex sx={{ ...styles.titleContainer, maxWidth: titleContainerWidth || '290px' }}>
          <Flex>{beforeTokenContent}</Flex>
          <Flex sx={{ mr: '10px' }}>
            {alignServiceTokens ? (
              <Flex sx={{ width: '130px', justifyContent: 'flex-end' }}>{serviceTokenDisplay}</Flex>
            ) : (
              serviceTokenDisplay
            )}
          </Flex>
          <Flex sx={{ justifyContent: 'center' }}>
            {tag}
            {title}
          </Flex>
        </Flex>
        <ContentContainer>{cardContent}</ContentContainer>
        {expandedContent && (
          <span style={{ marginRight: '30px', transform: 'translate(0, -3px)' }}>
            <Svg icon="caret" direction={expanded ? 'up' : 'down'} width="10px" />
          </span>
        )}
        {infoContent && (
          <div style={{ display: 'inline-block' }}>
            <TooltipBubble
              placement="bottomRight"
              body={infoContent}
              transformTip={infoContentPosition || 'translate(-82%, 40%)'}
              width={ttWidth || '205px'}
            >
              <InfoIcon width={toolTipIconWidth || '25px'} />
            </TooltipBubble>
          </div>
        )}
      </ListCardContainer>
      <AnimatePresence>
        {expandedContent && expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'fit-content' }}
            transition={{ opacity: { duration: 0.2 } }}
            exit={{ height: 0 }}
            sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}
          >
            <Flex
              sx={{
                background: 'white3',
                flexDirection: 'row',
                height: '100px',
                width: '100%',
                justifyContent: expandedContentJustified || 'space-between',
                padding: '0px 30px 0px 30px',
                flexWrap: 'no-wrap',
                alignItems: 'center',
              }}
            >
              {expandedContent}
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(ListCard)
