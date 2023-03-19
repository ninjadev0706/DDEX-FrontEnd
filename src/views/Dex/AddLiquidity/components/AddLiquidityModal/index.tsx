/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import { Modal } from '@apeswapfinance/uikit'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import { Field } from 'state/mint/actions'
import { ConfirmationPendingContent, TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { AddLiquidityModalProps } from './types'
import { styles } from './styles'
import PoolInfo from '../PoolInfo'

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({
  currencies,
  liquidityMinted,
  noLiquidity,
  title,
  parsedAmounts,
  poolTokenPercentage,
  price,
  txHash,
  attemptingTxn,
  onDismiss,
  onAdd,
}) => {
  const { chainId } = useActiveWeb3React()
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const { t } = useTranslation()
  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? ''} ${
    currencies[Field.CURRENCY_A]?.getSymbol(chainId) ?? ''
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''} ${
    currencies[Field.CURRENCY_B]?.getSymbol(chainId) ?? ''
  }`
  return (
    <Modal title={title} maxWidth="420px" onDismiss={onDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : txHash ? (
        <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={onDismiss} />
      ) : (
        <Flex sx={styles.modalWrapper}>
          <>
            <Flex sx={{ ...styles.confirmDisabledInputContainer, transform: 'translate(0px, 12px)' }}>
              <Text size="22px" weight={700}>
                {parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)}
              </Text>
              <Flex sx={{ alignItems: 'center' }}>
                <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="30px" />
                <Text size="14px" weight={700} ml="10px">
                  {currencies[Field.CURRENCY_A].getSymbol(chainId)}
                </Text>
              </Flex>
            </Flex>
            <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Flex sx={styles.outerLogoCircle}>
                <Flex sx={styles.innerLogoCircle}>
                  <Text weight={700} color="primaryBright" sx={{ lineHeight: '0px' }}>
                    +
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex sx={{ ...styles.confirmDisabledInputContainer, transform: 'translate(0px, -12px)' }}>
              <Text size="22px" weight={700}>
                {parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)}
              </Text>
              <Flex sx={{ alignItems: 'center' }}>
                <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size="30px" />
                <Text size="14px" weight={700} ml="10px">
                  {currencies[Field.CURRENCY_B].getSymbol(chainId)}
                </Text>
              </Flex>
            </Flex>
            <Text size="14px" textAlign="left" weight={500} margin="10px 0px" style={{ textAlign: 'center' }}>
              {t(
                'Output is estimated. If the price changes by more than %allowedSlippage%% your transaction will revert.',
                { allowedSlippage: allowedSlippage / 100 },
              )}
            </Text>
            <PoolInfo
              currencies={currencies}
              noLiquidity={noLiquidity}
              chainId={chainId}
              price={price}
              poolTokenPercentage={poolTokenPercentage}
              liquidityMinted={liquidityMinted}
            />
            <Button onClick={onAdd} fullWidth mt="15px">
              {t('Confirm Add Liquidity')}
            </Button>
          </>
        </Flex>
      )}
    </Modal>
  )
}

export default React.memo(AddLiquidityModal)
