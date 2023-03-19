/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import { Modal } from '@apeswapfinance/uikit'
import { DoubleCurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import { Field } from 'state/burn/actions'
import { ConfirmationPendingContent, TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { RemoveLiquidityModalProps } from './types'
import { styles } from './styles'
import PoolInfo from '../PoolInfo'

const RemoveLiquidityModal: React.FC<RemoveLiquidityModalProps> = ({
  pair,
  title,
  parsedAmounts,
  txHash,
  attemptingTxn,
  onDismiss,
  onRemove,
}) => {
  const { chainId } = useActiveWeb3React()
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const { t } = useTranslation()
  const currencyA = pair?.token0
  const currencyB = pair?.token1
  const pendingText = `${t('Removing')} ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? ''} ${
    currencyA?.getSymbol(chainId) ?? ''
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''} ${currencyB?.getSymbol(chainId) ?? ''}`
  return (
    <Modal title={title} maxWidth="420px" onDismiss={onDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : txHash ? (
        <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={onDismiss} />
      ) : (
        <Flex sx={{ ...styles.modalWrapper }}>
          <>
            <Flex sx={{ ...styles.confirmDisabledInputContainer, marginTop: '10px' }}>
              <Text size="22px" weight={700}>
                {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
              </Text>
              <Flex sx={{ alignItems: 'center' }}>
                <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={30} />
                <Text size="14px" weight={700} ml="5px">
                  {`${currencyA?.getSymbol(chainId)} - ${currencyB?.getSymbol(chainId)}`}
                </Text>
              </Flex>
            </Flex>
            <Text size="14px" textAlign="left" mt="15px" weight={500} style={{ textAlign: 'center' }}>
              {t(
                'Output is estimated. If the price changes by more than %allowedSlippage%% your transaction will revert.',
                { allowedSlippage: allowedSlippage / 100 },
              )}
            </Text>
            <PoolInfo pair={pair} parsedAmounts={parsedAmounts} chainId={chainId} />
            <Button onClick={onRemove} fullWidth mt="15px">
              {t('Confirm Remove Liquidity')}
            </Button>
          </>
        </Flex>
      )}
    </Modal>
  )
}

export default React.memo(RemoveLiquidityModal)
