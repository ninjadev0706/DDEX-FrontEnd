/** @jsxImportSource theme-ui */
import React from 'react'
import { Button, Flex, Text } from '@ape.swap/uikit'
import FormattedPriceImpact from '../../views/Dex/components/FormattedPriceImpact'
import { JSBI, Percent } from '@ape.swap/sdk'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance } from '../../state/user/hooks'

interface UpdateSlippageProps {
  priceImpact: number
  updateSlippage: () => void
}

const UpdateSlippage: React.FC<UpdateSlippageProps> = ({ priceImpact, updateSlippage }) => {
  const { t } = useTranslation()
  const [zapSlippage] = useUserSlippageTolerance(true)

  return (
    <Flex
      sx={{
        margin: '15px 0',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text size="12px" sx={{ lineHeight: '18px' }}>
        {t('This transaction requires a slippage tolerance of ')}
        <FormattedPriceImpact priceImpact={new Percent(JSBI.BigInt(priceImpact + 5), JSBI.BigInt(10000))} />
        {'. '}
        {t('After this transaction, slippage tolerance will be reset to ')}
        {zapSlippage / 100} {'%.'}
      </Text>
      {priceImpact + 5 > 500 && (
        <Text color="error" size="12px">
          {t('Beware: your transaction may be frontrun')}
        </Text>
      )}
      <Button onClick={updateSlippage} sx={{ minWidth: '100px', marginLeft: '5px' }}>
        {t('Update')}
      </Button>
    </Flex>
  )
}

export default React.memo(UpdateSlippage)
