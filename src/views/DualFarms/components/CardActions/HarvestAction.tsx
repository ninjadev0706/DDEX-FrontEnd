/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { useMiniChefHarvest } from 'hooks/useHarvest'
import { useToast } from 'state/hooks'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { Button, Flex, AutoRenewIcon } from '@ape.swap/uikit'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { DualFarm } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { styles } from '../styles'

interface HarvestActionsProps {
  pid: number
  disabled: boolean
  farm: DualFarm
}

const HarvestAction: React.FC<HarvestActionsProps> = ({ pid, disabled, farm }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onReward } = useMiniChefHarvest(pid)
  const { toastSuccess } = useToast()
  const userEarningsMiniChef = getBalanceNumber(farm?.userData?.miniChefEarnings || new BigNumber(0)).toFixed(2)
  const userEarningsRewarder = getBalanceNumber(farm?.userData?.rewarderEarnings || new BigNumber(0)).toFixed(2)

  return (
    <Flex sx={styles.actionContainer}>
      <ListViewContent
        title={t('Earned')}
        value={userEarningsMiniChef}
        valueIcon={
          <Flex sx={{ height: '16px', alignItems: 'center', mr: '3px' }}>
            <ServiceTokenDisplay token1={farm?.rewardTokens.token0.symbol} size={13} />
          </Flex>
        }
        value2={farm?.dualImage !== false ? `${userEarningsRewarder}` : ''}
        value2Direction="column"
        value2Icon={
          farm?.dualImage !== false ? (
            <Flex sx={{ height: '16px', alignItems: 'center', mr: '3px' }}>
              <ServiceTokenDisplay token1={farm.pid === 11 ? 'NFTY2' : farm?.rewardTokens.token1.symbol} size={13} />
            </Flex>
          ) : null
        }
        style={styles.columnView}
      />
      <Flex sx={styles.depositContainer}>
        <Button
          className="noClick"
          disabled={disabled || pendingTrx}
          onClick={async () => {
            setPendingTrx(true)
            await onReward()
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
            setPendingTrx(false)
          }}
          endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
          sx={styles.styledBtn}
        >
          {t('HARVEST')}
        </Button>
      </Flex>
    </Flex>
  )
}

export default React.memo(HarvestAction)
