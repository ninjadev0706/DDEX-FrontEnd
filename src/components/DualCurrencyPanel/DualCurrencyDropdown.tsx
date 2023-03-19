/** @jsxImportSource theme-ui */
import { Dropdown, DropdownItem, Flex, Text, useModal } from '@ape.swap/uikit'
import { Currency } from '@ape.swap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useCallback, useMemo, useState } from 'react'
import { Box, Spinner } from 'theme-ui'
import DualCurrencySearchModal from './DualCurrencySearchModal'
import { useAllTokens } from 'hooks/Tokens'
import { useSetZapInputList, useZapInputList } from 'state/zap/hooks'
import DropdownDisplay from './DropdownDisplay'
import { useTranslation } from 'contexts/Localization'
import { createFilterToken } from 'components/SearchModal/filtering'
import { DualCurrencySelector } from '../../views/Bills/components/Actions/types'

const DualCurrencyDropdown: React.FC<{
  inputCurrencies: Currency[]
  onCurrencySelect?: (currency: DualCurrencySelector) => void
  lpList: DualCurrencySelector[]
  enableZap: boolean
}> = ({ inputCurrencies, onCurrencySelect, lpList, enableZap }) => {
  useSetZapInputList()
  const allTokens = useAllTokens()
  const rawZapInputList = useZapInputList()
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearchQuery = useCallback((val: string) => {
    setSearchQuery(val)
  }, [])

  const zapInputList = useMemo(() => {
    const addresses = []
    if (rawZapInputList) {
      const listByChain = rawZapInputList[chainId]
      for (const res of Object.values(listByChain)) {
        if (res.address[chainId]) {
          addresses.push(res.address[chainId].toLowerCase())
        }
      }
    }
    const filteredZapInputTokens = Object.entries(allTokens).filter((token) =>
      addresses.includes(token[0].toLowerCase()),
    )
    return Object.fromEntries(filteredZapInputTokens)
  }, [allTokens, chainId, rawZapInputList])

  const quickSorting = (token1, token2) => {
    // we might want to make this more involved. Sorting order is as follows: 1 WETH, 2 BUSD, 3 DAI, 4 USDC
    if (token1.symbol === 'WETH') {
      return -1
    }
    if (token1.symbol === 'BUSD') {
      if (token2.symbol === 'WETH') {
        return 1
      } else return -1
    }
    if (token1.symbol === 'DAI') {
      if (token2.symbol === 'WETH' || token2.symbol === 'BUSD') {
        return 1
      } else return -1
    }
    if (token1.symbol === 'USDC') {
      if (token2.symbol === 'WETH' || token2.symbol === 'BUSD' || token2.symbol === 'DAI') {
        return 1
      } else return -1
    }
    return 1
  }

  const currenciesList: DualCurrencySelector[] = useMemo(() => {
    const filterToken = createFilterToken(searchQuery)
    const parsedList = Object.values(zapInputList)
      .filter(filterToken)
      .sort(quickSorting)
      .map((token) => {
        return { currencyA: token, currencyB: null }
      })
    return [lpList[0], { currencyA: Currency.ETHER, currencyB: null }, parsedList].flat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zapInputList, searchQuery])

  const handleCurrencyDynamic = useCallback(
    (currency: DualCurrencySelector) => {
      onCurrencySelect(currency)
      setSearchQuery('')
    },
    [onCurrencySelect],
  )

  const [onPresentCurrencyModal] = useModal(
    <DualCurrencySearchModal
      onCurrencySelect={handleCurrencyDynamic}
      inputCurrencies={inputCurrencies}
      currenciesList={currenciesList}
      searchQuery={searchQuery}
      handleSearchQuery={handleSearchQuery}
    />,
    true,
    true,
    'DualCurrencySearch',
  )

  const Item = useCallback(
    (item: Currency[], index) => {
      return (
        <DropdownItem
          size="sm"
          key={index}
          onClick={() => handleCurrencyDynamic(currenciesList[index])}
          sx={{ width: '100%' }}
        >
          <DropdownDisplay inputCurrencies={item} />
        </DropdownItem>
      )
    },
    [currenciesList, handleCurrencyDynamic],
  )

  return (
    <Flex sx={{ minWidth: 'max-content' }}>
      {inputCurrencies[0] ? (
        <Flex>
          {enableZap ? (
            <Dropdown
              size="sm"
              component={<DropdownDisplay inputCurrencies={inputCurrencies} active />}
              sx={{ width: '190px', zIndex: 500, background: 'white4' }}
            >
              {currenciesList.slice(0, 4).map((item, index) => {
                return Item([item.currencyA, item.currencyB], index)
              })}
              <DropdownItem size="sm" sx={{ textAlign: 'center' }} onClick={onPresentCurrencyModal}>
                <Text sx={{ '&:hover': { textDecoration: 'underline' } }}>{t('See all')} &gt;</Text>
              </DropdownItem>
            </Dropdown>
          ) : (
            <Box
              sx={{
                background: 'white4',
                borderRadius: '10px',
                position: 'relative',
                width: '190px',
              }}
            >
              <Flex
                sx={{
                  padding: '5px 4px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  span: {
                    fontSize: 3,
                  },
                }}
              >
                <DropdownDisplay inputCurrencies={inputCurrencies} active />
              </Flex>
            </Box>
          )}
        </Flex>
      ) : (
        <Spinner width="15px" height="15px" sx={{ marginRight: '10px' }} />
      )}
    </Flex>
  )
}

export default React.memo(DualCurrencyDropdown)
