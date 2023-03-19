import React, { useCallback } from 'react'
import { useModal } from '@apeswapfinance/uikit'
import { Field, selectCurrency } from 'state/swap/actions'
import { selectOutputCurrency } from 'state/zap/actions'
import { useDispatch } from 'react-redux'
import { ZapType } from '@ape.swap/sdk'
import { CHAIN_PARAMS } from 'config/constants/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Token } from 'config/constants/types'
import { JungleFarm } from 'state/types'
import DualDepositModal from 'components/DualDepositModal'
import { getEtherscanLink } from 'utils'
import { fetchJungleFarmsUserDataAsync } from 'state/jungleFarms'
import { useJungleStake } from 'hooks/useStake'
import { useToast } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { useZapActionHandlers } from 'state/zap/hooks'
import WithdrawModal from 'components/WithdrawModal'
import { useJungleUnstake } from 'hooks/useUnstake'
import { PRODUCT } from '../../../../config/constants'

const useStakeModals = (
  farm: JungleFarm,
  pendingDepositTrx: boolean,
  handlePendingTx: (value: boolean, type: string) => void,
) => {
  const { chainId, account } = useActiveWeb3React()
  const isZapable = !farm?.unZapable
  const { onStake } = useJungleStake(farm?.jungleId, farm?.stakingToken?.price)
  const { onUnstake } = useJungleUnstake(farm?.jungleId)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { onSetZapType } = useZapActionHandlers()

  const [openDepositModal] = useModal(
    <DualDepositModal
      setPendingDepositTrx={(value) => handlePendingTx(value, 'deposit')}
      pendingTx={pendingDepositTrx}
      pid={farm?.jungleId}
      allowance={farm?.userData?.allowance?.toString()}
      token0={farm?.lpTokens?.quoteToken?.symbol === 'BNB' ? 'ETH' : farm?.lpTokens?.quoteToken?.address[chainId]}
      token1={farm?.lpTokens?.token?.address[chainId]}
      lpAddress={farm?.stakingToken?.address[chainId]}
      poolAddress={farm?.contractAddress[chainId]}
      onStakeLp={async (val: string) => {
        handlePendingTx(true, 'deposit')
        await onStake(val, chainId)
          .then((resp) => {
            const trxHash = resp.transactionHash
            toastSuccess(t('Deposit Successful'), {
              text: t('View Transaction'),
              url: getEtherscanLink(trxHash, 'transaction', chainId),
            })
          })
          .catch((e) => {
            console.error(e)
            handlePendingTx(false, 'deposit')
          })
        dispatch(fetchJungleFarmsUserDataAsync(chainId, account))
        handlePendingTx(false, 'deposit')
      }}
      enableZap={isZapable}
      product={PRODUCT.JUNGLE_FARM}
    />,
    true,
    true,
    `dualDepositModal-${farm?.jungleId}`,
  )

  const [openWithdrawModal] = useModal(
    <WithdrawModal
      max={farm?.userData?.stakedBalance?.toString()}
      onConfirm={async (val) => {
        handlePendingTx(true, 'withdraw')
        await onUnstake(val)
          .then((resp) => {
            const trxHash = resp.transactionHash
            toastSuccess(t('Withdraw Successful'), {
              text: t('View Transaction'),
              url: getEtherscanLink(trxHash, 'transaction', chainId),
            })
          })
          .catch((e) => {
            console.error(e)
            handlePendingTx(false, 'withdraw')
          })
        dispatch(fetchJungleFarmsUserDataAsync(chainId, account))
        handlePendingTx(false, 'withdraw')
      }}
      title={'Unstake LP tokens'}
    />,
  )

  const nativeToETH = useCallback(
    (token: Token) => {
      const nativeSymbol = CHAIN_PARAMS[chainId].nativeCurrency.symbol
      if (token.symbol === nativeSymbol) return 'ETH'
      return token.address[chainId]
    },
    [chainId],
  )

  const onPresentDeposit = useCallback(() => {
    dispatch(
      selectCurrency({
        field: Field.INPUT,
        currencyId: nativeToETH(farm?.lpTokens?.token),
      }),
    )
    dispatch(
      selectCurrency({
        field: Field.OUTPUT,
        currencyId: nativeToETH(farm?.lpTokens?.quoteToken),
      }),
    )
    dispatch(
      selectOutputCurrency({
        currency1: nativeToETH(farm?.lpTokens?.token),
        currency2: nativeToETH(farm?.lpTokens?.quoteToken),
      }),
    )
    onSetZapType(ZapType.ZAP_LP_POOL)
    openDepositModal()
  }, [dispatch, farm, nativeToETH, onSetZapType, openDepositModal])

  return { onPresentDeposit, openWithdrawModal }
}

export default useStakeModals
