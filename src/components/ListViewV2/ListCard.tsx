/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Flex } from '@ape.swap/uikit'
import { AnimatePresence, motion } from 'framer-motion'
import { styles } from './styles'
import { ListCardProps } from './types'
import InfoContent from './components/InfoContent'

const ListCard: React.FC<ListCardProps> = ({
  serviceTokenDisplay,
  title,
  titleWidth = '310px',
  iconsContainer = '117px',
  cardContent,
  expandedContent,
  infoContent,
  open,
}) => {
  const [expanded, setExpanded] = useState(open)
  return (
    <>
      <Flex sx={styles.listCardContainer} onClick={() => setExpanded((prev) => !prev)}>
        <Flex sx={{ ...styles.titleContainer, maxWidth: ['100%', '100%', '275px', titleWidth] }}>
          <Flex sx={styles.tokensContainer}>
            <Flex sx={{ minWidth: ['', '', iconsContainer], justifyContent: 'flex-end' }}>{serviceTokenDisplay}</Flex>
            <Flex sx={{ flexDirection: 'column', marginLeft: '10px' }}>{title}</Flex>
          </Flex>
          <Flex sx={styles.infoContentMobile}>
            <InfoContent infoContent={infoContent} expandedContent={expandedContent} expanded={expanded} />
          </Flex>
        </Flex>
        {cardContent && <Flex sx={styles.cardContentContainer}>{cardContent}</Flex>}
        <Flex
          sx={{
            display: ['none', 'none', 'flex'],
            minWidth: expandedContent ? '49px' : '20px',
            justifyContent: 'center',
          }}
        >
          <InfoContent infoContent={infoContent} expandedContent={expandedContent} expanded={expanded} />
        </Flex>
      </Flex>
      <AnimatePresence>
        {expandedContent && expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'fit-content', transitionEnd: { overflow: 'visible' } }}
            transition={{ opacity: { duration: 0.2 } }}
            exit={{ height: 0, overflow: 'hidden' }}
            sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}
          >
            <Flex sx={styles.expandedWrapper}>{expandedContent}</Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(ListCard)
