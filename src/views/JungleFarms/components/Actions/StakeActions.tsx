/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import UnlockButton from 'components/UnlockButton'
import { AddIcon, Button, Flex, MinusIcon } from '@ape.swap/uikit'
import { styles } from '../styles'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useStakeModals from './useStakeModals'
import { JungleFarm } from 'state/types'

const StakeActions = ({ farm }: { farm: JungleFarm }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [pendingDepositTrx, setPendingDepositTrx] = useState(false)
  const [pendingWithdrawTrx, setPendingWithdrawTrx] = useState(false)
  const firstStake = !new BigNumber(farm?.userData?.stakedBalance)?.gt(0)

  const handlePendingTx = useCallback((value: boolean, type: string) => {
    if (type === 'deposit') setPendingDepositTrx(value)
    if (type === 'withdraw') setPendingWithdrawTrx(value)
  }, [])

  const { onPresentDeposit, openWithdrawModal } = useStakeModals(farm, pendingDepositTrx, handlePendingTx)

  const renderStakingButtons = () => {
    if (!account) return <UnlockButton sx={{ width: '100%' }} />
    if (firstStake)
      return (
        <Button onClick={onPresentDeposit} load={pendingDepositTrx} disabled={pendingDepositTrx} sx={styles.styledBtn}>
          {t('DEPOSIT')}
        </Button>
      )
    return (
      <Flex sx={styles.stakeActions}>
        <Button
          onClick={openWithdrawModal}
          load={pendingWithdrawTrx}
          disabled={pendingWithdrawTrx}
          mr="10px"
          size="sm"
          sx={styles.smallBtn}
        >
          {!pendingWithdrawTrx && <MinusIcon color="white" width="20px" height="20px" fontWeight={700} />}
        </Button>
        <Button
          onClick={onPresentDeposit}
          load={pendingDepositTrx}
          disabled={pendingDepositTrx}
          size="sm"
          sx={styles.smallBtn}
        >
          {!pendingDepositTrx && <AddIcon color="white" width="25px" height="25px" fontWeight={700} />}
        </Button>
      </Flex>
    )
  }

  return renderStakingButtons()
}

export default React.memo(StakeActions)
