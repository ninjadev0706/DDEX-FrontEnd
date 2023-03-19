/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import {
  AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS,
  CHAIN_PARAMS,
  LIST_VIEW_PRODUCTS,
  NETWORK_LABEL,
  FULL_PRODUCT_NAMES,
} from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSwitchNetwork from 'hooks/useSelectNetwork'
import React from 'react'
import MonkeyImage from 'views/Dex/Orders/components/OrderHistoryPanel/MonkeyImage'

const ListView404: React.FC<{ product: LIST_VIEW_PRODUCTS }> = ({ product }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { switchNetwork } = useSwitchNetwork()

  return (
    <Flex
      sx={{
        width: '100%',
        background: 'white2',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
      }}
    >
      <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 20px' }}>
        <Text size="25px" sx={{ mb: '15px', textAlign: 'center' }}>
          {"You're"} connected to: {NETWORK_LABEL[chainId]}
        </Text>
        <MonkeyImage />
        <Text size="12px" sx={{ margin: '10px 0px 5px 0px', opacity: '.5', textAlign: 'center' }}>
          {t('%product% is only available on ', {
            product: FULL_PRODUCT_NAMES[product],
          })}
          {AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[product].length === 1
            ? AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[product].map((chainId) => `${NETWORK_LABEL[chainId]}. `)
            : AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[product].map((chainId) =>
                AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[product].indexOf(chainId) ===
                AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[product].length - 1
                  ? `${NETWORK_LABEL[chainId]}. `
                  : `${NETWORK_LABEL[chainId]}, `,
              )}
          {t('Switch to: ')}
        </Text>
        <Flex sx={{ mt: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[product].map((chainId) => {
            return (
              <Flex
                key={chainId}
                sx={{
                  padding: '5px 10px',
                  background: 'white3',
                  alignItems: 'center',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  margin: '5px 5px',
                }}
                onClick={() => switchNetwork(chainId)}
              >
                <ServiceTokenDisplay token1={CHAIN_PARAMS[chainId].nativeCurrency.symbol} size={22.5} />
                <Text ml="10px">{NETWORK_LABEL[chainId]}</Text>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ListView404
