/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Modal, ModalProps, Flex, Checkbox, Text } from '@ape.swap/uikit'
import MoonPayIframe from './MoonFrame'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@ape.swap/sdk'
import { NETWORK_LABEL } from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'

// Supported chains for moonpay
const SUPPORTED_CHAINS = [ChainId.BSC, ChainId.MAINNET, ChainId.MATIC, ChainId.ARBITRUM]

export default function MoonPayModal({ onDismiss }: ModalProps) {
  const [accept, setAccept] = useState(false)
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const modalProps = {
    style: {
      zIndex: 10,
      overflowY: 'auto',
      maxHeight: 'calc(100% - 30px)',
    },
    sx: {
      minWidth: '437px',
      '@media screen and (max-width: 437px)': {
        minWidth: '95%',
      },
      maxWidth: '437px',
    },
  }
  return (
    <Modal title="Buy crypto with MoonPay" onDismiss={onDismiss} {...modalProps}>
      {!SUPPORTED_CHAINS.includes(chainId) ? (
        <Flex sx={{ margin: '10px 0px', flexDirection: 'column' }}>
          <Text>
            {`${NETWORK_LABEL[chainId]} is unsupported by MoonPay. Assets purchased will be sent to other chains, depending on the asset.`}{' '}
          </Text>
          <Flex sx={{ margin: '20px 10px' }}>
            <Text size="14px">{t('Would you still like to purchase crypto with fiat?')}</Text>
            {'  '}
            <Checkbox
              sx={{
                ml: '10px',
                borderRadius: '8px',
                backgroundColor: 'white3',
                'input:checked ~ &': {
                  backgroundColor: 'yellow',
                },
              }}
              checked={accept}
              onChange={() => {
                setAccept((prev) => !prev)
              }}
            />
          </Flex>
          {accept && <MoonPayIframe />}
        </Flex>
      ) : (
        <MoonPayIframe />
      )}
    </Modal>
  )
}
