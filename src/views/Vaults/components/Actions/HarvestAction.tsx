/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { useToast } from 'state/hooks'
import { getEtherscanLink, showCircular } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { fetchVaultV3UserDataAsync } from 'state/vaultsV3'
import useHarvestMaximizer from 'views/Vaults/hooks/useHarvestMaximizer'
import { useAppDispatch } from 'state'
import { useIsModalShown } from 'state/user/hooks'
import { useHistory } from 'react-router-dom'
import { AutoRenewIcon, Button, Flex } from '@ape.swap/uikit'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'
import ServiceTokenDisplay from '../../../../components/ServiceTokenDisplay'

interface HarvestActionsProps {
  pid: number
  userEarnings: number
  earnTokenSymbol: string
  disabled: boolean
}

const HarvestAction: React.FC<HarvestActionsProps> = ({ pid, earnTokenSymbol, disabled, userEarnings }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onHarvest } = useHarvestMaximizer(pid)
  const { toastSuccess } = useToast()
  const history = useHistory()
  const { t } = useTranslation()

  const { showGeneralHarvestModal } = useIsModalShown()
  const displayGHCircular = () => showGeneralHarvestModal && showCircular(chainId, history, '?modal=circular-gh')

  const handleHarvest = async () => {
    setPendingTrx(true)
    await onHarvest()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess('Harvest Successful', {
          text: 'View Transaction',
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
        if (trxHash) displayGHCircular()
      })
      .catch((e) => {
        console.error(e)
        setPendingTrx(false)
      })
    dispatch(fetchVaultV3UserDataAsync(account, chainId))
    setPendingTrx(false)
  }

  return (
    <Flex sx={{ ...styles.actionContainer, width: '100%' }}>
      <ListViewContent
        title={t('Earned')}
        value={userEarnings?.toFixed(4)}
        valueIcon={
          <Flex sx={{ height: '16px', alignItems: 'center', mr: '3px' }}>
            <ServiceTokenDisplay token1="BANANA" size={13} />
          </Flex>
        }
        style={styles.columnView}
      />
      <Flex sx={styles.depositContainer}>
        <Button
          disabled={disabled || pendingTrx}
          onClick={handleHarvest}
          load={pendingTrx}
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
