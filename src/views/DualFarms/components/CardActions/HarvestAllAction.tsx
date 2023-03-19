/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { useAllHarvest } from 'hooks/useHarvest'
import { AutoRenewIcon, Button } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

interface HarvestActionsProps {
  pids: number[]
  disabled: boolean
}

const HarvestAllAction: React.FC<HarvestActionsProps> = ({ pids, disabled }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onReward } = useAllHarvest(pids, chainId, false)

  return (
    <Button
      size="sm"
      className="noClick"
      disabled={disabled || pendingTrx}
      onClick={async () => {
        setPendingTrx(true)
        await onReward().catch((e) => {
          console.error(e)
          setPendingTrx(false)
        })
        setPendingTrx(false)
      }}
      endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
      sx={styles.harvestAllBtn}
    >
      {t('HARVEST ALL')} ({pids.length})
    </Button>
  )
}

export default React.memo(HarvestAllAction)
