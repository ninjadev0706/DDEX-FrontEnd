/** @jsxImportSource theme-ui */
import React, { useCallback, useMemo, useState } from 'react'
import { Flex, Svg, Text, Text as StyledText } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBuyBill from 'views/Bills/hooks/useBuyBill'
import BigNumber from 'bignumber.js'
import { useToast } from 'state/hooks'
import { getEtherscanLink } from 'utils'
import { useAppDispatch } from 'state'
import { fetchBillsUserDataAsync, fetchUserOwnedBillsDataAsync } from 'state/bills'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { BuyProps, DualCurrencySelector } from './types'
import { GetLPButton, styles } from './styles'
import { BillValueContainer, TextWrapper } from '../Modals/styles'
import DualCurrencyPanel from 'components/DualCurrencyPanel/DualCurrencyPanel'
import { usePair } from 'hooks/usePairs'
import { ZapType } from '@ape.swap/sdk'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { Box } from 'theme-ui'
import { useCurrencyBalance } from 'state/wallet/hooks'
import maxAmountSpend from 'utils/maxAmountSpend'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useZapCallback } from 'hooks/useZapCallback'
import BillActions from './BillActions'
import track from 'utils/track'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBillType } from '../../hooks/useBillType'
import UpdateSlippage from 'components/DualDepositModal/UpdateSlippage'
import useAddLiquidityModal from 'components/DualAddLiquidity/hooks/useAddLiquidityModal'

const Buy: React.FC<BuyProps> = ({ bill, onBillId, onTransactionSubmited }) => {
  const {
    token,
    quoteToken,
    contractAddress,
    price,
    lpPrice,
    earnToken,
    earnTokenPrice,
    maxTotalPayOut,
    totalPayoutGiven,
    billNftAddress,
    maxPayoutTokens,
  } = bill
  const { chainId, account, library } = useActiveWeb3React()
  const { recipient, typedValue } = useZapState()
  const billType: string = useBillType(contractAddress[chainId])
  const { onBuyBill } = useBuyBill(contractAddress[chainId], typedValue, lpPrice, price)
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const onAddLiquidityModal = useAddLiquidityModal()

  const billsCurrencies: DualCurrencySelector = {
    currencyA: useCurrency(token.address[chainId]),
    currencyB: useCurrency(quoteToken.address[chainId]),
  }
  const [currencyA, setCurrencyA] = useState(billsCurrencies.currencyA)
  const [currencyB, setCurrencyB] = useState(billsCurrencies.currencyB)
  const inputCurrencies = [currencyA, currencyB]

  // We want to find the pair (if any) to get its balance, if there's no pair use currencyA
  const [, pair] = usePair(inputCurrencies[0], inputCurrencies[1])
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, pair?.liquidityToken ?? currencyA)

  const { zap } = useDerivedZapInfo()
  const [zapSlippage, setZapSlippage] = useUserSlippageTolerance(true)
  const { onCurrencySelection, onUserInput } = useZapActionHandlers()
  const maxPrice = new BigNumber(price).times(102).div(100).toFixed(0)
  const { callback: zapCallback } = useZapCallback(
    zap,
    ZapType.ZAP_T_BILL,
    zapSlippage,
    recipient,
    contractAddress[chainId] || 's',
    maxPrice,
  )
  const priceImpact = new BigNumber(zap?.totalPriceImpact?.toFixed(2)).times(100).toNumber()
  const showUpdateSlippage =
    zapSlippage < priceImpact && !currencyB && parseFloat(selectedCurrencyBalance?.toExact()) >= parseFloat(typedValue)
  const updateSlippage = useCallback(() => {
    if (zapSlippage < priceImpact) {
      const newZapSlippage = Math.round(priceImpact + 5)
      setZapSlippage(newZapSlippage)
    }
  }, [priceImpact, setZapSlippage, zapSlippage])
  const originalSlippage = useMemo(() => {
    return zapSlippage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // this logic prevents user to initiate a tx for a higher bill value than the available amount
  const consideredValue = currencyB ? typedValue : zap?.pairOut?.liquidityMinted?.toExact()
  const bigValue = new BigNumber(consideredValue).times(new BigNumber(10).pow(18))
  const billValue = bigValue.div(new BigNumber(price))?.toFixed(2)
  const available = new BigNumber(maxTotalPayOut)
    ?.minus(new BigNumber(totalPayoutGiven))
    ?.div(new BigNumber(10).pow(earnToken.decimals[chainId]))
  // threshold equals to 10 usd in earned tokens (banana or jungle token)
  const thresholdToShow = new BigNumber(5).div(earnTokenPrice)
  const safeAvailable = available.minus(thresholdToShow)
  const singlePurchaseLimit = new BigNumber(maxPayoutTokens).div(new BigNumber(10).pow(earnToken?.decimals?.[chainId]))
  const displayAvailable = singlePurchaseLimit.lt(safeAvailable) ? singlePurchaseLimit : safeAvailable

  const onHandleValueChange = useCallback(
    (val: string) => {
      onUserInput(Field.INPUT, val)
    },
    [onUserInput],
  )

  const searchForBillId = useCallback(
    (resp, billNftAddress) => {
      const { logs, transactionHash } = resp
      const findBillNftLog = logs.find((log) => log.address.toLowerCase() === billNftAddress.toLowerCase())
      const getBillNftIndex = findBillNftLog.topics[findBillNftLog.topics.length - 1]
      const convertHexId = parseInt(getBillNftIndex, 16)
      onBillId(convertHexId.toString(), transactionHash)
    },
    [onBillId],
  )

  const handleBuy = useCallback(async () => {
    setPendingTrx(true)
    onTransactionSubmited(true)
    if (currencyB) {
      await onBuyBill()
        .then((resp) => {
          const trxHash = resp.transactionHash
          searchForBillId(resp, billNftAddress)
          toastSuccess(t('Buy Successful'), {
            text: t('View Transaction'),
            url: getEtherscanLink(trxHash, 'transaction', chainId),
          })
          dispatch(fetchUserOwnedBillsDataAsync(chainId, account))
          dispatch(fetchBillsUserDataAsync(chainId, account))
        })
        .catch((e) => {
          console.error(e)
          toastError(e?.data?.message || t('Error: Please try again.'))
          setPendingTrx(false)
          onTransactionSubmited(false)
        })
    } else {
      await zapCallback()
        .then((hash) => {
          setPendingTrx(true)
          setZapSlippage(originalSlippage)
          library
            .waitForTransaction(hash)
            .then((receipt) => {
              const { logs } = receipt
              const findBillNftLog = logs.find((log) => log.address.toLowerCase() === billNftAddress.toLowerCase())
              const getBillNftIndex = findBillNftLog.topics[findBillNftLog.topics.length - 1]
              const convertHexId = parseInt(getBillNftIndex, 16)
              onBillId(convertHexId.toString(), hash)
              dispatch(fetchUserOwnedBillsDataAsync(chainId, account))
              dispatch(fetchBillsUserDataAsync(chainId, account))
            })
            .catch((e) => {
              console.error(e)
              toastError(e?.data?.message || t('Error: Please try again.'))
              setPendingTrx(false)
              onTransactionSubmited(false)
            })
          track({
            event: 'zap',
            chain: chainId,
            data: {
              cat: 'bill',
              token1: zap.currencyIn.currency.getSymbol(chainId),
              token2: `${zap.currencyOut1.outputCurrency.getSymbol(
                chainId,
              )}-${zap.currencyOut2.outputCurrency.getSymbol(chainId)}`,
              amount: getBalanceNumber(new BigNumber(zap.currencyIn.inputAmount.toString())),
            },
          })
          track({
            event: billType,
            chain: chainId,
            data: {
              cat: 'buy',
              address: contractAddress[chainId],
              typedValue,
              usdAmount: parseFloat(zap?.pairOut?.liquidityMinted?.toExact()) * lpPrice,
            },
          })
        })
        .catch((e) => {
          setZapSlippage(originalSlippage)
          console.error(e)
          toastError(
            e?.message.includes('INSUFFICIENT')
              ? t('Slippage Error: Please go to the GET LP modal and check your slippage using the ⚙️ icon')
              : e?.message || t('Error: Please try again.'),
          )
          setPendingTrx(false)
          onTransactionSubmited(false)
        })
    }
  }, [
    account,
    chainId,
    currencyB,
    library,
    billNftAddress,
    onBillId,
    dispatch,
    onBuyBill,
    onTransactionSubmited,
    searchForBillId,
    t,
    toastError,
    toastSuccess,
    zapCallback,
    zap,
    typedValue,
    billType,
    contractAddress,
    lpPrice,
    originalSlippage,
    setZapSlippage,
  ])

  const handleMaxInput = useCallback(() => {
    onHandleValueChange(maxAmountSpend(selectedCurrencyBalance).toExact())
  }, [onHandleValueChange, selectedCurrencyBalance])

  const handleCurrencySelect = useCallback(
    (currency: DualCurrencySelector) => {
      setCurrencyA(currency?.currencyA)
      setCurrencyB(currency?.currencyB)
      onHandleValueChange('')
      if (!currency?.currencyB) {
        // if there's no currencyB use zap logic
        onCurrencySelection(Field.INPUT, [currency.currencyA])
        onCurrencySelection(Field.OUTPUT, [billsCurrencies.currencyA, billsCurrencies.currencyB])
      }
    },
    [billsCurrencies.currencyA, billsCurrencies.currencyB, onCurrencySelection, onHandleValueChange],
  )

  return (
    <Flex sx={styles.buyContainer}>
      <Flex sx={{ flexWrap: 'wrap' }}>
        <DualCurrencyPanel
          handleMaxInput={handleMaxInput}
          onUserInput={onHandleValueChange}
          value={typedValue}
          onCurrencySelect={handleCurrencySelect}
          inputCurrencies={inputCurrencies}
          lpList={[billsCurrencies]}
          enableZap={true}
        />
      </Flex>
      <Flex sx={styles.detailsContainer}>
        <BillValueContainer>
          <TextWrapper>
            <Text size="12px" pr={1}>
              {t('Bill Value')}:{' '}
              <span style={{ fontWeight: 700 }}>
                {billValue === 'NaN' ? '0' : parseFloat(billValue)?.toLocaleString(undefined)} {earnToken?.symbol}
              </span>
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text size="12px">
              {t('Max per Bill')}:{' '}
              <span style={{ fontWeight: 700 }}>
                {!available ? '0' : parseFloat(displayAvailable.toFixed(0))?.toLocaleString(undefined)}{' '}
                {earnToken?.symbol}
              </span>
            </Text>
          </TextWrapper>
        </BillValueContainer>
        <Flex sx={{ ...styles.buttonsContainer }}>
          <Box sx={styles.getLpContainer}>
            <GetLPButton variant="secondary" onClick={() => onAddLiquidityModal(token, quoteToken, null, null, null)}>
              <StyledText sx={{ marginRight: '5px' }}>{t('Get LP')}</StyledText>
              <Svg icon="ZapIcon" color="yellow" />
            </GetLPButton>
          </Box>
          <Box sx={styles.buyButtonContainer}>
            <BillActions
              bill={bill}
              zap={zap}
              currencyB={currencyB}
              handleBuy={handleBuy}
              billValue={billValue}
              value={typedValue}
              purchaseLimit={displayAvailable.toString()}
              balance={selectedCurrencyBalance?.toExact()}
              pendingTrx={pendingTrx}
              errorMessage={zapSlippage < priceImpact && !currencyB ? 'Change Slippage' : null}
            />
          </Box>
          {showUpdateSlippage && !pendingTrx && (
            <Flex sx={styles.updateSlippage}>
              <UpdateSlippage priceImpact={priceImpact} updateSlippage={updateSlippage} />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(Buy)
