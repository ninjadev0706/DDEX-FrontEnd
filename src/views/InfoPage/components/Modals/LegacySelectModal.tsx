/** @jsxImportSource theme-ui */
import React from 'react'
import { Modal, Flex, Text, IconButton, Svg } from '@ape.swap/uikit'
import { INFO_PAGE_CHAIN_PARAMS, MAINNET_CHAINS, NETWORK_INFO_LINK } from 'config/constants/chains'
import useIsMobile from '../../../../hooks/useIsMobile'
import { ChainId } from '@ape.swap/sdk'

interface LegacySelectModalProps {
  onDismiss: () => void
}

const LegacySelectModal: React.FC<LegacySelectModalProps> = ({ onDismiss }) => {
  const mobile = useIsMobile()

  return (
    <Modal onDismiss={onDismiss} minWidth={`${mobile ? '95vw' : '500px'}`} maxWidth={`${mobile ? '95vw' : '500px'}`}>
      <Flex alignItems="center" justifyContent="center" mt="10px" mb="20px">
        <IconButton
          icon="close"
          color="text"
          variant="transparent"
          onClick={onDismiss}
          sx={{ position: 'absolute', right: '20px', top: '25px' }}
        />
      </Flex>
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', mb: '20px' }}>
        <Text size="14px" sx={{ textAlign: 'center' }}>
          {`Select a logo below to view that chain's previous analytics page`}{' '}
        </Text>
      </Flex>
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        {MAINNET_CHAINS.map((chainId) => {
          return (
            <a
              href={NETWORK_INFO_LINK[chainId]}
              target="_blank"
              rel="noopener noreferrer"
              key={chainId}
              // sx={{ cursor: 'pointer', margin: '0px 20px' }}
            >
              <Flex>
                {chainId !== ChainId.ARBITRUM && (
                  <Svg
                    width={30}
                    height={30}
                    icon={chainId === ChainId.TLOS ? 'tlos_token' : INFO_PAGE_CHAIN_PARAMS[chainId].icon}
                  />
                )}
              </Flex>
            </a>
          )
        })}
      </Flex>
    </Modal>
  )
}

export default React.memo(LegacySelectModal)
