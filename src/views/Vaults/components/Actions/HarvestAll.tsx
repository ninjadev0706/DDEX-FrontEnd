/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useToast } from 'state/hooks'
import { fetchVaultV3UserDataAsync } from 'state/vaultsV3'
import { getEtherscanLink, showCircular } from 'utils'
import useHarvestAllMaximizer from 'views/Vaults/hooks/useHarvestAllMaximizer'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAppDispatch } from 'state'
import { useIsModalShown } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { Button } from '@ape.swap/uikit'
import { styles } from '../styles'

interface HarvestActionsProps {
  pids: number[]
  disabled?: boolean
}

const HarvestAll: React.FC<HarvestActionsProps> = ({ pids, disabled }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onHarvestAll } = useHarvestAllMaximizer(pids)
  const { toastSuccess } = useToast()
  const history = useHistory()
  const { t } = useTranslation()

  const { showGeneralHarvestModal } = useIsModalShown()
  const displayGHCircular = () => showGeneralHarvestModal && showCircular(chainId, history, '?modal=circular-gh')

  const handleHarvestAll = async () => {
    setPendingTrx(true)
    await onHarvestAll()
      .then((resp) => {
        resp.map((trx) => {
          const trxHash = trx.transactionHash
          if (trxHash) displayGHCircular()
          return toastSuccess(t('Harvest Successful'), {
            text: t('View Transaction'),
            url: getEtherscanLink(trxHash, 'transaction', chainId),
          })
        })
      })
      .catch((e) => {
        console.error(e)
        setPendingTrx(false)
      })
    dispatch(fetchVaultV3UserDataAsync(account, chainId))
    setPendingTrx(false)
  }

  return (
    <Button
      size="sm"
      minWidth={100}
      disabled={disabled || pendingTrx || pids.length <= 0}
      onClick={handleHarvestAll}
      load={pendingTrx}
      sx={styles.harvestAllBtn}
    >
      {t('HARVEST ALL')} ({pids.length})
    </Button>
  )
}

export default React.memo(HarvestAll)
