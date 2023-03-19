/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Checkbox, Flex, Input, Svg, Text, useMatchBreakpoints, NetworkButton, Toggle } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { SearchText, styles } from '../styles'
import useSelectNetwork from 'hooks/useSelectNetwork'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import { BillsListMenuProps, FILTER_OPTIONS, SORT_OPTIONS } from '../types'
import MenuSelect from 'components/ListViewV2/ListViewMenu/MenuSelect'
import { AnimatePresence, motion } from 'framer-motion'

const BillsListMenu: React.FC<BillsListMenuProps> = ({
  onHandleQueryChange,
  setFilterOption,
  filterOption,
  setSortOption,
  sortOption,
  query,
  showOnlyDiscount,
  setShowOnlyDiscount,
  showAvailable,
  setShowAvailable,
}) => {
  const { t } = useTranslation()
  const { switchNetwork } = useSelectNetwork()
  const { chainId } = useActiveWeb3React()
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isLg && !isXl && !isXxl
  const [expanded, setExpended] = useState(false)

  return (
    <Flex sx={styles.menuContainer}>
      {isMobile ? (
        <Flex sx={styles.mobileContainer}>
          <Flex>
            <SearchText bold mr="15px">
              {t('Search')}
            </SearchText>
            <Input value={query} onChange={onHandleQueryChange} icon="search" sx={styles.input} />
            <Flex sx={styles.expandedButton} onClick={() => setExpended(!expanded)}>
              <Svg icon="MenuSettings" width="18px" />
            </Flex>
          </Flex>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'fit-content', transitionEnd: { overflow: 'visible' } }}
                transition={{ opacity: { duration: 0.2 } }}
                exit={{ height: 0, overflow: 'hidden' }}
                sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}
              >
                <Flex sx={styles.mobileRow}>
                  <Flex sx={styles.inputContainer} pr={3}>
                    <MenuSelect selectedOption={sortOption} setOption={setSortOption} options={SORT_OPTIONS} />
                  </Flex>
                  <Flex sx={styles.inputContainer} pl={3}>
                    <MenuSelect selectedOption={filterOption} setOption={setFilterOption} options={FILTER_OPTIONS} />
                  </Flex>
                  <Flex sx={styles.networkWrapper}>
                    <NetworkButton
                      switchNetwork={switchNetwork}
                      chainId={chainId}
                      t={t}
                      supportedChains={AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.BILLS]}
                    />
                  </Flex>
                </Flex>
              </motion.div>
            )}
          </AnimatePresence>
          <Flex sx={styles.mobileRow}>
            <Flex>
              <Toggle
                size="sm"
                labels={[t('Available'), t('Sold out')]}
                onClick={() => setShowAvailable(!showAvailable)}
                checked={!showAvailable}
                sx={{ height: '36px', alignItems: 'center' }}
              />
            </Flex>
            <Flex sx={{ alignItems: 'center' }} onClick={() => setShowOnlyDiscount(!showOnlyDiscount)}>
              <Checkbox checked={showOnlyDiscount} />
              <Text ml="15px" size="14px" weight={700} color="success">
                {t('Discount')}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <>
          <Flex>
            <SearchText bold mr="15px">
              {t('Search')}
            </SearchText>
            <Input value={query} onChange={onHandleQueryChange} icon="search" sx={styles.input} />
          </Flex>
          <Flex sx={{ minWidth: '100px' }}>
            <MenuSelect selectedOption={sortOption} setOption={setSortOption} options={SORT_OPTIONS} />
          </Flex>
          <Flex sx={{ minWidth: '100px' }}>
            <MenuSelect selectedOption={filterOption} setOption={setFilterOption} options={FILTER_OPTIONS} />
          </Flex>
          <Flex sx={{ minWidth: '150px' }}>
            <Toggle
              size="sm"
              labels={[t('Available'), t('Sold out')]}
              onClick={() => setShowAvailable(!showAvailable)}
              checked={!showAvailable}
              sx={{ height: '36px', alignItems: 'center', width: '100%' }}
            />
          </Flex>
          <Flex
            sx={{ alignItems: 'center', '&: hover': { cursor: 'pointer' } }}
            onClick={() => setShowOnlyDiscount(!showOnlyDiscount)}
          >
            <Checkbox checked={showOnlyDiscount} onClick={() => setShowOnlyDiscount(!showOnlyDiscount)} />
            <Text ml="15px" size="14px" weight={700} color="success">
              {t('Discount')}
            </Text>
          </Flex>
          <Flex
            sx={{
              '& button': {
                width: '180px',
                justifyContent: 'space-between',
                '& span': { width: '100%', textAlign: 'left' },
              },
            }}
          >
            <NetworkButton
              switchNetwork={switchNetwork}
              chainId={chainId}
              t={t}
              supportedChains={AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.BILLS]}
            />
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default React.memo(BillsListMenu)
