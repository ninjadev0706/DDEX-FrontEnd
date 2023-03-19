/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import {
  BillDiagramContainer,
  BillGifContainer,
  DescriptionContainer,
  FirstTimeCardContainer,
} from '../UserBillsView/styles'
import { Text } from '@apeswapfinance/uikit'
import BillsDiagram from 'components/MarketingModalContent/Bills/BillsDiagram'
import { AnimatePresence, motion } from 'framer-motion'
import { Flex, Svg } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'

const MobileCard = () => {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  return (
    <FirstTimeCardContainer onClick={() => setExpanded(!expanded)}>
      <BillGifContainer>
        <img src={'images/bills/bill-nfts.gif'} alt="bill-img" />
      </BillGifContainer>
      <DescriptionContainer>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Text fontSize="22px" bold sx={{ margin: '0 0 5px 10px' }}>
            {t('Tips for buying bills')}
          </Text>
          <span style={{ marginRight: '10px', transform: 'translate(0, -3px)' }}>
            <Svg icon="caret" direction={expanded ? 'up' : 'down'} width="10px" />
          </span>
        </Flex>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'fit-content' }}
              transition={{ opacity: { duration: 0.2 } }}
              exit={{ opacity: 0, height: 0 }}
              sx={{ position: 'relative', overflow: 'hidden' }}
            >
              <BillDiagramContainer>
                <BillsDiagram />
              </BillDiagramContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </DescriptionContainer>
    </FirstTimeCardContainer>
  )
}

export default MobileCard
