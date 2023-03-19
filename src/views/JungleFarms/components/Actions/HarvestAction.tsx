/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { useJungleHarvest } from 'hooks/useHarvest'
import { useToast } from 'state/hooks'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { updateJungleFarmsUserPendingReward } from 'state/jungleFarms'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { Button, Flex } from '@ape.swap/uikit'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { styles } from '../styles'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'

interface HarvestActionsProps {
  jungleId: number
  userEarnings: number
  disabled: boolean
  userEarningsUsd: string
  earnTokenSymbol: string
}

const HarvestAction: React.FC<HarvestActionsProps> = ({
  jungleId,
  disabled,
  userEarnings,
  userEarningsUsd,
  earnTokenSymbol,
}) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onHarvest } = useJungleHarvest(jungleId)

  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const handleHarvest = async () => {
    setPendingTrx(true)
    await onHarvest()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Harvest Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
      })
      .catch((e) => {
        console.error(e)
        setPendingTrx(false)
      })
    dispatch(updateJungleFarmsUserPendingReward(chainId, jungleId, account))
    setPendingTrx(false)
  }

  return (
    <Flex sx={styles.actionContainer}>
      <ListViewContent
        title={t('Earned')}
        value={userEarnings?.toFixed(4)}
        valueIcon={
          <Flex sx={{ height: '16px', alignItems: 'center', mr: '3px' }}>
            <ServiceTokenDisplay token1={earnTokenSymbol} size={13} />
          </Flex>
        }
        value2={userEarningsUsd}
        value2Secondary
        value2Direction="column"
        style={styles.columnView}
      />
      <Flex sx={styles.depositContainer}>
        <Button disabled={disabled || pendingTrx} onClick={handleHarvest} load={pendingTrx} sx={styles.styledBtn}>
          {t('HARVEST')}
        </Button>
      </Flex>
    </Flex>
  )
}

export default React.memo(HarvestAction)
