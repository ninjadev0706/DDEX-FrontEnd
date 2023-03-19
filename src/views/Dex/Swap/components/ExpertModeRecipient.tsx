import { Flex, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { textUnderlineHover } from 'views/Dex/styles'
import AddressInputPanel from './AddressInputPanel'

const ExpertModeRecipient: React.FC<{
  recipient: string
  showWrap: boolean
  isExpertMode: boolean
  onChangeRecipient: (recipient: string) => void
}> = ({ recipient, showWrap, isExpertMode, onChangeRecipient }) => {
  const { t } = useTranslation()
  return isExpertMode ? (
    <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: '10px' }}>
      {recipient === null && !showWrap && (
        <Flex
          sx={{ cursor: 'pointer', position: 'relative', width: 'fit-content', ...textUnderlineHover }}
          onClick={() => onChangeRecipient('')}
        >
          <Text size="14px" id="add-recipient-button">
            {t('Add recipient')}
          </Text>
        </Flex>
      )}
      {recipient !== null && !showWrap && (
        <Flex
          justify="space-between"
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Flex
            sx={{ cursor: 'pointer', position: 'relative', width: 'fit-content', ...textUnderlineHover }}
            onClick={() => onChangeRecipient(null)}
          >
            {' '}
            <Text size="14px" id="remove-recipient-button">
              {t('Remove recipient')}
            </Text>
          </Flex>

          <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
        </Flex>
      )}
    </Flex>
  ) : (
    <></>
  )
}

export default React.memo(ExpertModeRecipient)
