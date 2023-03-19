/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAllHarvest } from 'hooks/useHarvest'
import { AutoRenewIcon, Button } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import { useIsModalShown } from 'state/user/hooks'
import { useToast } from 'state/hooks'
import { getEtherscanLink, showCircular } from 'utils'
import { styles } from '../styles'
import { updateFarmV2UserEarnings } from 'state/farmsV2'

interface HarvestActionsProps {
  pids: number[]
  disabled: boolean
  v2Flag: boolean
}

const HarvestAllAction: React.FC<HarvestActionsProps> = ({ pids, disabled, v2Flag }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onReward } = useAllHarvest(pids, chainId, v2Flag)
  const { t } = useTranslation()
  const history = useHistory()
  const { toastSuccess } = useToast()

  const { showGeneralHarvestModal } = useIsModalShown()
  const displayGHCircular = () => showGeneralHarvestModal && showCircular(chainId, history, '?modal=circular-gh')

  return (
    <Button
      size="sm"
      className="noClick"
      disabled={disabled || pendingTrx}
      onClick={async () => {
        setPendingTrx(true)
        await onReward()
          .then((resp) => {
            resp.map((trx) => {
              const trxHash = trx.transactionHash
              if (trxHash) displayGHCircular()
              return toastSuccess(t('Claim Successful'), {
                text: t('View Transaction'),
                url: getEtherscanLink(trxHash, 'transaction', chainId),
              })
            })
          })
          .catch((e) => {
            console.error(e)
            setPendingTrx(false)
          })
        pids.map((pid) => {
          return dispatch(updateFarmV2UserEarnings(chainId, pid, account))
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
