/** @jsxImportSource theme-ui */
import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Modal, ModalProvider } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import DualCurrencyPanel from 'components/DualCurrencyPanel/DualCurrencyPanel'
import { Field } from 'state/swap/actions'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import { DualCurrencySelector } from '../../views/Bills/components/Actions/types'
import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import maxAmountSpend from 'utils/maxAmountSpend'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { usePair } from 'hooks/usePairs'
import { Box } from 'theme-ui'
import { useUserSlippageTolerance } from 'state/user/hooks'
import DualActions from './DualActions'
import DistributionPanel from 'views/Dex/Zap/components/DistributionPanel/DistributionPanel'
import useDualDeposit from './hooks'
import UpdateSlippage from './UpdateSlippage'
import { PRODUCT } from '../../config/constants'
import { ZapType } from '@ape.swap/sdk'

interface DualDepositModalProps {
  onDismiss?: () => void
  setPendingDepositTrx: (value: boolean) => void
  pendingTx: boolean
  pid?: number
  allowance?: string
  token0?: string
  token1?: string
  lpAddress: string
  poolAddress: string
  onStakeLp?: (value: string) => void
  enableZap?: boolean
  product: PRODUCT
}

const modalProps = {
  sx: {
    zIndex: 11,
    maxHeight: 'calc(100% - 30px)',
    minWidth: ['90%', '420px'],
    width: '200px',
    maxWidth: '425px',
  },
}

const DualDepositModal: React.FC<DualDepositModalProps> = ({
  onDismiss,
  setPendingDepositTrx,
  pendingTx,
  pid,
  allowance,
  token0,
  token1,
  lpAddress,
  poolAddress,
  onStakeLp,
  enableZap,
  product,
}) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { typedValue } = useZapState()
  const showApproveContract = !new BigNumber(allowance).gt(0)
  const { onCurrencySelection, onUserInput, onSetZapType } = useZapActionHandlers()
  const lpCurrencies: DualCurrencySelector = {
    currencyA: useCurrency(token1),
    currencyB: useCurrency(token0),
  }
  const [currencyA, setCurrencyA] = useState(lpCurrencies.currencyA)
  const [currencyB, setCurrencyB] = useState(lpCurrencies.currencyB)
  const inputCurrencies = [currencyA, currencyB]
  const [, pair] = usePair(inputCurrencies[0], inputCurrencies[1])
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, pair?.liquidityToken ?? currencyA)
  const { zap } = useDerivedZapInfo()
  const [zapSlippage, setZapSlippage] = useUserSlippageTolerance(true)
  const priceImpact = new BigNumber(zap?.totalPriceImpact?.toFixed(2)).times(100).toNumber()
  const handleDeposit = useDualDeposit(!!currencyB, onStakeLp, pid, setPendingDepositTrx, poolAddress, onDismiss)

  const onHandleValueChange = useCallback(
    (val: string) => {
      onUserInput(Field.INPUT, val)
    },
    [onUserInput],
  )

  const handleCurrencySelect = useCallback(
    (currency: DualCurrencySelector) => {
      setCurrencyA(currency?.currencyA)
      setCurrencyB(currency?.currencyB)
      onHandleValueChange('')
      if (!currency?.currencyB) {
        // if there's no currencyB use zap logic
        onCurrencySelection(Field.INPUT, [currency.currencyA])
        onCurrencySelection(Field.OUTPUT, [lpCurrencies.currencyA, lpCurrencies.currencyB])
      }
    },
    [lpCurrencies.currencyA, lpCurrencies.currencyB, onCurrencySelection, onHandleValueChange],
  )

  const handleMaxInput = useCallback(() => {
    onHandleValueChange(maxAmountSpend(selectedCurrencyBalance)?.toExact())
  }, [onHandleValueChange, selectedCurrencyBalance])

  const updateSlippage = useCallback(() => {
    if (zapSlippage < priceImpact) {
      const newZapSlippage = Math.round(priceImpact + 5)
      setZapSlippage(newZapSlippage)
    }
  }, [priceImpact, setZapSlippage, zapSlippage])

  const showUpdateSlippage =
    zapSlippage < priceImpact && !currencyB && parseFloat(selectedCurrencyBalance?.toExact()) >= parseFloat(typedValue)

  // reset input value to zero on first render
  useEffect(() => {
    onUserInput(Field.INPUT, '')
    onSetZapType(product === PRODUCT.DUAL_FARM ? ZapType.ZAP_MINI_APE : ZapType.ZAP_LP_POOL)
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

  return (
    <ModalProvider>
      <Modal title={t('Stake LP tokens')} onDismiss={onDismiss} {...modalProps}>
        <Box sx={{ margin: '15px 0' }}>
          <DualCurrencyPanel
            handleMaxInput={handleMaxInput}
            onUserInput={onHandleValueChange}
            value={typedValue}
            onCurrencySelect={handleCurrencySelect}
            inputCurrencies={inputCurrencies}
            lpList={[lpCurrencies]}
            enableZap={enableZap}
          />
        </Box>
        {!currencyB && typedValue && parseFloat(typedValue) > 0 && zap?.pairOut?.liquidityMinted && (
          <Flex sx={{ margin: '15px 0', fontWeight: 600 }}>
            <DistributionPanel zap={zap} hideTitle />
          </Flex>
        )}
        {showUpdateSlippage && <UpdateSlippage priceImpact={priceImpact} updateSlippage={updateSlippage} />}
        <DualActions
          lpToApprove={lpAddress}
          showApproveLpFlow={showApproveContract}
          pid={pid.toString()}
          isZapSelected={!currencyB}
          inputError={
            parseFloat(typedValue) === 0 || !typedValue
              ? 'Enter an amount'
              : parseFloat(selectedCurrencyBalance?.toExact()) < parseFloat(typedValue)
              ? 'Insufficient balance'
              : zapSlippage < priceImpact && !currencyB
              ? 'Change Slippage'
              : null
          }
          disabled={pendingTx || selectedCurrencyBalance?.toExact() === '0'}
          pendingTrx={pendingTx}
          handleAction={handleDeposit}
          product={product}
        />
      </Modal>
    </ModalProvider>
  )
}

export default React.memo(DualDepositModal)
