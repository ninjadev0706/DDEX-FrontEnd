import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Link, Svg, Text } from '@ape.swap/uikit'
import DexPanel from 'views/Dex/components/DexPanel'
import { useCurrency } from 'hooks/Tokens'
import { Currency, CurrencyAmount, Pair, ZapType } from '@ape.swap/sdk'
import maxAmountSpend from 'utils/maxAmountSpend'
import ZapPanel from 'views/Dex/Zap/components/ZapPanel'
import { Field } from 'state/zap/actions'
import { useDerivedZapInfo, useSetZapInputList, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import ZapLiquidityActions from 'views/Dex/Zap/components/ZapLiquidityActions'
import { styles } from './styles'
import { useZapCallback } from 'hooks/useZapCallback'
import DistributionPanel from 'views/Dex/Zap/components/DistributionPanel/DistributionPanel'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { Box, Switch } from 'theme-ui'
import { wrappedToNative } from '../../utils'
import track from 'utils/track'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTokenPriceUsd } from 'hooks/useTokenPriceUsd'

interface ZapLiquidityProps {
  handleConfirmedTx: (hash: string, pairOut: Pair) => void
  poolAddress: string
  pid: string
  zapIntoProductType: ZapType
  zapable: boolean
}

const ZapLiquidity: React.FC<ZapLiquidityProps> = ({
  handleConfirmedTx,
  poolAddress,
  pid,
  zapIntoProductType,
  zapable,
}) => {
  useSetZapInputList()
  const [zapErrorMessage, setZapErrorMessage] = useState<string>(null)
  const [stakeIntoProduct, setStakeIntoProduct] = useState<boolean>(true)
  const [disableZap, setDisableZap] = useState<boolean>(false)

  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const { INPUT, typedValue, recipient, zapType } = useZapState()
  const [zapSlippage] = useUserSlippageTolerance(true)

  const currencyA = INPUT.currencyId

  const inputCurrency = useCurrency(currencyA)

  const { zap, inputError: zapInputError, currencyBalances } = useDerivedZapInfo()
  const { onUserInput, onInputSelect, onCurrencySelection, onSetZapType } = useZapActionHandlers()

  const tokenPrice = useTokenPriceUsd(chainId, zap.currencyIn.currency)

  const handleInputSelect = useCallback(
    (field: Field, currency: Currency) => {
      onInputSelect(field, currency)
    },
    [onInputSelect],
  )

  const handleOutputSelect = useCallback(
    (currencyIdA: Currency, currencyIdB: Currency) => {
      onCurrencySelection(Field.OUTPUT, [currencyIdA, currencyIdB])
      setDisableZap(true)
      onSetZapType(ZapType.ZAP)
      setStakeIntoProduct(false)
    },
    [onCurrencySelection, onSetZapType],
  )

  const handleStakeIntoProduct = (value: boolean) => {
    setStakeIntoProduct(value)
    if (value) {
      onSetZapType(zapIntoProductType)
    } else {
      onSetZapType(ZapType.ZAP)
    }
  }

  const { callback: zapCallback } = useZapCallback(zap, zapType, zapSlippage, recipient, poolAddress, null, pid)

  const handleZap = useCallback(() => {
    setZapErrorMessage(null)
    zapCallback()
      .then((hash) => {
        handleConfirmedTx(hash, zap.pairOut.pair)
        const amount = getBalanceNumber(new BigNumber(zap.currencyIn.inputAmount.toString()))
        track({
          event: 'zap',
          chain: chainId,
          data: {
            cat: 'liquidity',
            token1: zap.currencyIn.currency.getSymbol(chainId),
            token2: `${zap.currencyOut1.outputCurrency.getSymbol(chainId)}-${zap.currencyOut2.outputCurrency.getSymbol(
              chainId,
            )}`,
            amount,
            usdAmount: amount * tokenPrice,
          },
        })
      })
      .catch((error) => {
        setZapErrorMessage(error.message)
      })
  }, [chainId, handleConfirmedTx, tokenPrice, zap, zapCallback])

  const handleDismissConfirmation = useCallback(() => {
    // clear zapErrorMessage if user closes the error modal
    setZapErrorMessage(null)
  }, [])

  const handleMaxInput = useCallback(
    (field: Field) => {
      const maxAmounts: { [field in Field]?: CurrencyAmount } = {
        [Field.INPUT]: maxAmountSpend(currencyBalances[Field.INPUT]),
        [Field.OUTPUT]: maxAmountSpend(currencyBalances[Field.OUTPUT]),
      }
      if (maxAmounts) {
        onUserInput(field, maxAmounts[field]?.toExact() ?? '')
      }
    },
    [currencyBalances, onUserInput],
  )

  // reset input value to zero on first render
  useEffect(() => {
    onUserInput(Field.INPUT, '')
    onSetZapType(zapable ? zapIntoProductType : ZapType.ZAP)
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [zapable])

  return (
    <div>
      <Flex sx={styles.liquidityContainer}>
        {zapable && zap?.pairOut?.pair?.token0?.getSymbol(chainId) && (
          <Flex sx={{ marginBottom: '10px', fontSize: '12px', alignItems: 'center' }}>
            <Text>
              {t('Stake in')}{' '}
              {`${wrappedToNative(zap?.pairOut?.pair?.token0?.getSymbol(chainId))} - ${wrappedToNative(
                zap?.pairOut?.pair?.token1?.getSymbol(chainId),
              )} ${t('Farm')}`}
            </Text>
            <Box sx={{ width: '50px', marginLeft: '10px' }}>
              <Switch
                checked={stakeIntoProduct}
                onChange={() => handleStakeIntoProduct(!stakeIntoProduct)}
                sx={styles.switchStyles}
                disabled={disableZap}
              />
            </Box>
          </Flex>
        )}
        <Flex sx={{ marginTop: '30px' }}>
          <DexPanel
            value={typedValue}
            panelText="From:"
            currency={inputCurrency}
            otherCurrency={null}
            fieldType={Field.INPUT}
            onCurrencySelect={handleInputSelect}
            onUserInput={onUserInput}
            handleMaxInput={handleMaxInput}
            isZapInput
          />
        </Flex>
        <Flex sx={{ margin: '10px', justifyContent: 'center' }}>
          <Svg icon="ZapArrow" />
        </Flex>
        <ZapPanel
          value={zap?.pairOut?.liquidityMinted?.toSignificant(10) || '0.0'}
          onSelect={handleOutputSelect}
          lpPair={zap.pairOut.pair}
        />
        {typedValue && parseFloat(typedValue) > 0 && zap?.pairOut?.liquidityMinted && (
          <Flex sx={{ marginTop: '40px' }}>
            <DistributionPanel zap={zap} />
          </Flex>
        )}
        <ZapLiquidityActions
          zapInputError={zapInputError}
          zap={zap}
          handleZap={handleZap}
          zapErrorMessage={zapErrorMessage}
          handleDismissConfirmation={handleDismissConfirmation}
        />
        <Flex sx={{ marginTop: '10px', justifyContent: 'center' }}>
          <Link
            href="https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/liquidity"
            target="_blank"
            textAlign="center"
          >
            <Text size="12px" style={{ lineHeight: '18px', fontWeight: 400, textDecoration: 'underline' }}>
              Learn more{'>'}
            </Text>
          </Link>
        </Flex>
      </Flex>
    </div>
  )
}

export default React.memo(ZapLiquidity)
