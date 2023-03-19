/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import {
  AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS,
  CHAIN_PARAMS,
  LIST_VIEW_PRODUCTS,
  NETWORK_LABEL,
} from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSwitchNetwork from 'hooks/useSelectNetwork'
import React from 'react'
import MonkeyImage from 'views/Dex/Orders/components/OrderHistoryPanel/MonkeyImage'
import { BillsView } from '../../index'
import { styles } from './styles'

export enum EmptyComponentType {
  USER_BILLS,
  AVAILABLE_BILLS,
  NO_RESULTS,
  COMING_SOON,
}

interface EmptyListComponentProps {
  type?: EmptyComponentType
  handleBillsViewChange?: (view: BillsView) => void
}

const EmptyList: React.FC<EmptyListComponentProps> = ({ type, handleBillsViewChange }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { switchNetwork } = useSwitchNetwork()
  const eligibleChains = AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.BILLS]?.filter(
    (chain) => chain !== chainId,
  )

  return (
    <Flex sx={styles.mainContainer}>
      <Flex sx={styles.subContainer}>
        <MonkeyImage />
        <Flex sx={styles.title}>
          <Text color="gray">
            {type === EmptyComponentType.AVAILABLE_BILLS &&
              t(`All Treasury Bills on ${NETWORK_LABEL[chainId]} are sold out.`)}
            {type === EmptyComponentType.USER_BILLS && t(`You don't have any bills`)}
            {type === EmptyComponentType.NO_RESULTS && t('No results found')}
            {type === EmptyComponentType.COMING_SOON && t('Bills coming soon')}
          </Text>
        </Flex>
        <Text size="12px" sx={{ marginTop: '15px', opacity: '.5', textAlign: 'center' }}>
          {type === EmptyComponentType.AVAILABLE_BILLS && t('Switch to: ')}
          {type === EmptyComponentType.USER_BILLS && t('Click below to purchase your first bill')}
        </Text>
        <Flex sx={styles.availableBills}>
          {type === EmptyComponentType.AVAILABLE_BILLS &&
            eligibleChains.map((chainId) => {
              return (
                <Flex key={chainId} sx={styles.networkButton} onClick={() => switchNetwork(chainId)}>
                  <ServiceTokenDisplay token1={CHAIN_PARAMS[chainId].nativeCurrency.symbol} size={22.5} />
                  <Text ml="10px">{NETWORK_LABEL[chainId]}</Text>
                </Flex>
              )
            })}
          {type === EmptyComponentType.USER_BILLS && (
            <Button onClick={() => handleBillsViewChange(BillsView.AVAILABLE_BILLS)} sx={{ marginTop: '10px' }}>
              {t('See bills')}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default EmptyList
