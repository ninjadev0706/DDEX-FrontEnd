/** @jsxImportSource theme-ui */
import { Flex, TooltipBubble, InfoIcon, Svg } from '@ape.swap/uikit'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { ContentContainer, ListCardContainer, styles } from './styles'
import { ListCardProps } from './types'

const MobileListCard: React.FC<ListCardProps> = ({
  serviceTokenDisplay,
  tag,
  title,
  cardContent,
  expandedContent,
  infoContent,
  infoContentPosition,
  open,
  expandedContentSize,
  ttWidth,
  backgroundColor,
  beforeTokenContent,
  forMigrationList,
}) => {
  const [expanded, setExpanded] = useState(open)
  return (
    <>
      <ListCardContainer
        onClick={() => setExpanded((prev) => !prev)}
        backgroundColor={backgroundColor}
        forMigrationList={forMigrationList}
      >
        <Flex sx={{ width: '100%', justifyContent: 'space-between' }}>
          {beforeTokenContent && <Flex>{beforeTokenContent}</Flex>}
          <Flex sx={{ ...styles.titleContainer }}>
            {serviceTokenDisplay}
            <Flex sx={{ flexDirection: 'column', marginLeft: '10px' }}>
              {tag}
              {title}
            </Flex>
          </Flex>
          <Flex sx={{ alignItems: 'center' }}>
            {infoContent && (
              <div style={{ display: 'inline-block' }}>
                <TooltipBubble
                  body={infoContent}
                  transformTip={infoContentPosition || 'translate(0%, 0%)'}
                  width={ttWidth || '205px'}
                >
                  <InfoIcon width={'18px'} />
                </TooltipBubble>
              </div>
            )}
            {expandedContent && (
              <span style={{ marginLeft: '20px', transform: 'translate(0, -2px)' }}>
                <Svg icon="caret" direction={expanded ? 'up' : 'down'} width="10px" />
              </span>
            )}
          </Flex>
        </Flex>
        {cardContent && <ContentContainer>{cardContent}</ContentContainer>}
      </ListCardContainer>
      <AnimatePresence>
        {expandedContent && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'fit-content' }}
            exit={{ opacity: 1 }}
            transition={{ opacity: { duration: 0.4 } }}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              minWidth: forMigrationList ? '250px' : '300px',
              background: 'white3',
            }}
          >
            <Flex
              sx={{
                background: 'white3',
                flexDirection: 'column',
                height: expandedContentSize || '234px',
                justifyContent: 'space-between',
                padding: '15px 10px',
                flexWrap: 'wrap',
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

export default React.memo(MobileListCard)
