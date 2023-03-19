/** @jsxImportSource theme-ui */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Link, Flex } from '@ape.swap/uikit'
import { NETWORK_LABEL } from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'
import useENS from '../../../../hooks/ENS/useENS'
import useActiveWeb3React from '../../../../hooks/useActiveWeb3React'
import { getEtherscanLink } from '../../../../utils'

const SInput = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.white3};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.text)};
  overflow: hidden;
  font-size: 16px;
  padding: 10px;
  height: 40px;
  text-overflow: ellipsis;
  font-weight: 500;
  ::placeholder {
    color: ${({ theme }) => theme.colors.text};
    text-align: center;
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }
`

export default function AddressInputPanel({
  id,
  value,
  onChange,
}: {
  id?: string
  // the typed string value
  value: string
  // triggers whenever the typed value changes
  onChange: (value: string) => void
}) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()
  const { address, loading, name } = useENS(value)

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange],
  )

  const error = Boolean(value.length > 0 && !loading && !address)

  return (
    <Flex id={id} sx={{ flexDirection: 'column', width: '100%', marginTop: '10px' }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex>
          {address && chainId && (
            <Link external small href={getEtherscanLink(name ?? address, 'address', chainId)} sx={{ fontSize: '12px' }}>
              {t('View on %name%Scan', { name: NETWORK_LABEL[chainId] })}
            </Link>
          )}
        </Flex>
        <Flex sx={{ width: '100%', position: 'relative' }}>
          <SInput
            className="recipient-address-input"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder={t('Wallet Address or ENS name')}
            error={error}
            pattern="^(0x[a-fA-F0-9]{40})$"
            onChange={handleInput}
            value={value}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
