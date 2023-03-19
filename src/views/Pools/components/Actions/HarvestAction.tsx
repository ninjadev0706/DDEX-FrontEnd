/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Button, Flex } from '@ape.swap/uikit'
import { useHistory } from 'react-router-dom'
import { useSousHarvest } from 'hooks/useHarvest'
import { useToast } from 'state/hooks'
import { getEtherscanLink, showCircular } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSousStake } from 'hooks/useStake'
import { fetchPoolsUserDataAsync, updateUserPendingReward } from 'state/pools'
import { useCurrency } from 'hooks/Tokens'
import { useBananaAddress } from 'hooks/useAddress'
import { useIsModalShown } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { poolStyles } from '../styles'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'

interface HarvestActionsProps {
  sousId: number
  userEarnings: number
  earnTokenSymbol: string
  earnTokenValueUsd: number
  disabled: boolean
}

const HarvestAction: React.FC<HarvestActionsProps> = ({
  sousId,
  earnTokenSymbol,
  disabled,
  userEarnings,
  earnTokenValueUsd,
}) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const [pendingApeHarderTrx, setPendingApeHarderTrx] = useState(false)
  const { onHarvest } = useSousHarvest(sousId)
  const { onStake } = useSousStake(sousId, earnTokenValueUsd)
  const bananaToken = useCurrency(useBananaAddress())
  const { showPoolHarvestModal } = useIsModalShown()
  const history = useHistory()
  const isBananaBanana = sousId === 0

  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const harvestBanana = earnTokenSymbol === bananaToken.symbol
  const displayPHCircular = () =>
    showPoolHarvestModal && harvestBanana && showCircular(chainId, history, '?modal=circular-ph')

  const userTokenBalanceUsd = (userEarnings * earnTokenValueUsd).toFixed(2)

  const handleHarvest = async () => {
    setPendingTrx(true)
    await onHarvest()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Harvest Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
        if (trxHash) displayPHCircular()
      })
      .catch((e) => {
        console.error(e)
        setPendingTrx(false)
      })
    dispatch(updateUserPendingReward(chainId, sousId, account))
    setPendingTrx(false)
  }

  const handleApeHarder = async () => {
    setPendingApeHarderTrx(true)
    await onStake(userEarnings.toString())
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Ape Harder Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
      })
      .catch((e) => {
        console.error(e)
        setPendingApeHarderTrx(false)
      })
    dispatch(fetchPoolsUserDataAsync(chainId, account))
    setPendingApeHarderTrx(false)
  }

  return (
    <Flex sx={{ ...poolStyles.actionContainer, minWidth: isBananaBanana && ['', '', '380px'] }}>
      <ListViewContent
        title={t('Earned')}
        value={userEarnings?.toFixed(4)}
        valueIcon={
          <Flex sx={{ height: '16px', alignItems: 'center', mr: '3px' }}>
            <ServiceTokenDisplay token1={earnTokenSymbol} size={13} />
          </Flex>
        }
        value2={`$${userTokenBalanceUsd}`}
        value2Secondary
        value2Direction="column"
        style={poolStyles.columnView}
      />
      <Button
        disabled={disabled || pendingTrx}
        onClick={handleHarvest}
        load={pendingTrx}
        sx={isBananaBanana ? poolStyles.fixedSizedBtn : poolStyles.styledBtn}
      >
        {t('HARVEST')}
      </Button>
      {isBananaBanana && (
        <Flex sx={{ width: ['100%', '100%', 'unset'], margin: ['15px 0 0 0', '15px 0 0 0', '0 10px'] }}>
          <Button
            size="md"
            disabled={disabled || pendingApeHarderTrx}
            onClick={handleApeHarder}
            load={pendingApeHarderTrx}
            sx={poolStyles.apeHarder}
          >
            {t('APE HARDER')}
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default React.memo(HarvestAction)
