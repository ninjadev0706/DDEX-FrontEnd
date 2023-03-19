/** @jsxImportSource theme-ui */
import React from 'react'
import BigNumber from 'bignumber.js'
import StakeAction from './StakeActions'
import { Flex } from '@ape.swap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { VaultVersion } from 'config/constants/types'
import { styles } from '../styles'
import { useTranslation } from '../../../../contexts/Localization'

interface CardActionProps {
  allowance: string
  stakingTokenBalance: string
  stakedTokenSymbol: string
  stakedBalance: string
  stakeTokenValueUsd: number
  stakeTokenAddress: string
  withdrawFee: string
  pid: number
  vaultVersion: VaultVersion
}

const Actions: React.FC<CardActionProps> = ({
  allowance,
  stakingTokenBalance,
  stakedTokenSymbol,
  stakedBalance,
  stakeTokenValueUsd,
  stakeTokenAddress,
  withdrawFee,
  pid,
  vaultVersion,
}) => {
  const { t } = useTranslation()

  const actionToRender = () => {
    const isBananaBanana = vaultVersion === VaultVersion.V1
    const lpText = vaultVersion === VaultVersion.V1 ? 'BANANA' : ' LP'
    const rawStakedBalance = getBalanceNumber(new BigNumber(stakedBalance))
    const userStakedBalanceUsd = `$${(getBalanceNumber(new BigNumber(stakedBalance || 0)) * stakeTokenValueUsd).toFixed(
      2,
    )}`
    return (
      <Flex sx={{ ...styles.actionContainer, width: isBananaBanana ? '320px' : '100%' }}>
        <ListViewContent
          title={t('Staked')}
          value={rawStakedBalance ? `${rawStakedBalance.toFixed(2)} ${lpText}` : `0.000 ${lpText}`}
          value2={userStakedBalanceUsd}
          value2Secondary
          value2Direction="column"
          style={styles.columnView}
        />
        <Flex sx={styles.depositContainer}>
          <StakeAction
            stakedBalance={stakedBalance}
            stakedTokenSymbol={stakedTokenSymbol}
            stakingTokenBalance={stakingTokenBalance}
            stakeTokenValueUsd={stakeTokenValueUsd}
            withdrawFee={withdrawFee}
            pid={pid}
            vaultVersion={vaultVersion}
            allowance={allowance}
            stakeTokenAddress={stakeTokenAddress}
          />
        </Flex>
      </Flex>
    )
  }
  return actionToRender()
}

export default React.memo(Actions)
