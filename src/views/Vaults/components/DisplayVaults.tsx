/** @jsxImportSource theme-ui */
import { Button, Flex, Svg, useModal } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import { useLocation } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAppDispatch } from 'state'
import { Field, selectCurrency } from 'state/swap/actions'
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Vault } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { vaultTokenDisplay } from '../helpers'
import Actions from './Actions'
import HarvestAction from './Actions/HarvestAction'
import DualLiquidityModal from 'components/DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from 'state/zap/actions'
import Tooltip from 'components/Tooltip/Tooltip'
import { BLOCK_EXPLORER } from 'config/constants/chains'
import ListView from 'components/ListViewV2/ListView'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { styles } from './styles'
import { VaultVersion } from '@ape.swap/apeswap-lists'

const DisplayVaults: React.FC<{ vaults: Vault[]; openId?: number }> = ({ vaults, openId }) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const isActive = !pathname.includes('history')
  const { t } = useTranslation()

  const [onPresentAddLiquidityWidgetModal] = useModal(<DualLiquidityModal />, true, true, 'dualLiquidityModal')

  const showLiquidity = (token, quoteToken, vault) => {
    dispatch(
      selectCurrency({
        field: Field.INPUT,
        currencyId: token,
      }),
    )
    dispatch(
      selectCurrency({
        field: Field.OUTPUT,
        currencyId: quoteToken,
      }),
    )
    dispatch(
      selectOutputCurrency({
        currency1: vault.token.address[chainId],
        currency2: vault.quoteToken.address[chainId],
      }),
    )
    onPresentAddLiquidityWidgetModal()
  }

  const vaultsListView = vaults.map((vault) => {
    const isBananaBanana = vault.version === VaultVersion.V1
    const totalDollarAmountStaked = Math.round(parseFloat(vault?.totalStaked) * vault?.stakeTokenPrice * 100) / 100
    const liquidityUrl = `https://apeswap.finance/swap/`
    const userAllowance = vault?.userData?.allowance
    const userEarnings = getBalanceNumber(new BigNumber(vault?.userData?.pendingRewards || 0))
    const userEarningsUsd = `$${(
      (getBalanceNumber(new BigNumber(vault?.userData?.pendingRewards)) || 0) * vault.rewardTokenPrice
    ).toFixed(2)}`
    const userTokenBalance = `${(getBalanceNumber(new BigNumber(vault?.userData?.tokenBalance)) || 0).toFixed(4)}
    ${vault?.version === VaultVersion.V1 ? 'BANANA' : ' LP'}`
    const userTokenBalanceUsd = `$${(parseFloat(userTokenBalance || '0') * vault?.stakeTokenPrice).toFixed(2)}`
    const userStakedBalance = getBalanceNumber(new BigNumber(vault?.userData?.stakedBalance))
    const userStakedBalanceUsd = `$${((userStakedBalance || 0) * vault?.stakeTokenPrice).toFixed(2)}`

    const { tokenDisplay, stakeLp, earnLp } = vaultTokenDisplay(vault.stakeToken, vault.rewardToken)
    const explorerLink = BLOCK_EXPLORER[chainId]
    const vaultContractURL = `${explorerLink}/address/${vault?.stratAddress[chainId]}`

    return {
      tokenDisplayProps: {
        token1: tokenDisplay?.token1,
        token2: tokenDisplay?.token2,
        token3: tokenDisplay?.token3,
        token4: tokenDisplay?.token4,
        stakeLp,
        earnLp,
      },
      listProps: {
        // there are two vaults with the same ID, so it is important to use different id's here, otherwise react renders them again and again
        id: `${vault.id} ${vault?.inactive}`,
        open: openId === vault.id,
        title: <ListViewContent value={vault.stakeToken.symbol} style={{ maxWidth: '180px' }} />,
        titleWidth: '400px',
        iconsContainer: '130px',
        infoContent: (
          <Tooltip
            valueTitle={t('Withdrawal Fee')}
            valueContent={`${vault?.withdrawFee}%`}
            value2Title={t('Performance Fee')}
            value2Content={`${vault?.keeperFee}%`}
            secondURL={vaultContractURL}
            secondURLTitle={t('View Vault Contract')}
            tokenContract={vault?.stakeToken?.address[chainId]}
          />
        ),
        cardContent: (
          <Flex sx={styles.cardContent}>
            <Flex sx={{ ...styles.onlyDesktop, maxWidth: '140px', width: '100%' }}>
              <ListViewContent
                title={t('Daily APY')}
                value={`${isActive ? vault?.apy?.daily?.toFixed(2) : '0.00'}%`}
                toolTip={t(
                  'Daily APY includes BANANA rewards (calculated based on token value, reward rate, and percentage of vault owned) and DEX swap fees, compounded daily.',
                )}
                toolTipPlacement="bottomLeft"
                toolTipTransform="translate(25%, 0%)"
                style={styles.farmInfo}
              />
            </Flex>
            <ListViewContent
              title={t('APY')}
              value={`${isActive ? vault?.apy?.yearly?.toFixed(2) : '0.00'}%`}
              toolTip={t(
                'Annual APY includes annualized BANANA rewards (calculated based on token value, reward rate, and percentage of vault owned) and DEX swap fees, compounded daily.',
              )}
              toolTipPlacement="bottomLeft"
              toolTipTransform="translate(28%, 0%)"
              style={styles.farmInfo}
            />
            <Flex
              sx={{
                ...styles.onlyDesktop,
                minWidth: '140px',
                maxWidth: '170px',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              <ListViewContent
                title={t('Liquidity')}
                value={`$${totalDollarAmountStaked.toLocaleString(undefined)}`}
                toolTip={t('The total value of the tokens currently staked in this vault.')}
                toolTipPlacement="bottomRight"
                toolTipTransform="translate(13%, 0%)"
                style={{
                  maxWidth: '170px',
                  minWidth: '140px',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              />
            </Flex>
            <ListViewContent
              title={vault.version === 'V1' ? t('Staked') : t('Earned')}
              value={vault.version === 'V1' ? userStakedBalanceUsd : userEarningsUsd}
              style={styles.farmInfo}
            />
          </Flex>
        ),
        expandedContent: (
          <>
            <Flex sx={{ ...styles.expandedContent, justifyContent: isBananaBanana ? 'center' : 'space-between' }}>
              <Flex sx={{ ...styles.onlyMobile, width: '100%' }}>
                <ListViewContent
                  title={t('Daily APY')}
                  value={`${isActive ? vault?.apy?.daily?.toFixed(2) : '0.00'}%`}
                  toolTip={t(
                    'Daily APY includes BANANA rewards (calculated based on token value, reward rate, and percentage of vault owned) and DEX swap fees, compounded daily.',
                  )}
                  toolTipPlacement="bottomLeft"
                  toolTipTransform="translate(25%, 0%)"
                  style={styles.farmInfo}
                />
                <ListViewContent
                  title={t('Liquidity')}
                  value={`$${totalDollarAmountStaked.toLocaleString(undefined)}`}
                  toolTip={t('The total value of the tokens currently staked in this vault.')}
                  toolTipPlacement="bottomRight"
                  toolTipTransform="translate(13%, 0%)"
                  style={styles.farmInfo}
                />
              </Flex>
              <Flex sx={{ ...styles.actionContainer, width: isBananaBanana ? '320px' : '100%' }}>
                <ListViewContent
                  title={t('Available')}
                  value={userTokenBalance}
                  value2={userTokenBalanceUsd}
                  value2Secondary
                  value2Direction="column"
                  style={styles.columnView}
                />
                <Flex sx={{ width: '100%', maxWidth: ['130px', '130px', '140px'] }}>
                  {vault.stakeToken?.lpToken ? (
                    <Button
                      onClick={() =>
                        showLiquidity(
                          vault.token.symbol === 'BNB' ? 'ETH' : vault.token.address[chainId],
                          vault.quoteToken.symbol === 'BNB' ? 'ETH' : vault.quoteToken.address[chainId],
                          vault,
                        )
                      }
                      sx={styles.styledBtn}
                    >
                      {t('GET LP')}
                      <Flex sx={{ ml: '5px' }}>
                        <Svg icon="ZapIcon" color="primaryBright" />
                      </Flex>
                    </Button>
                  ) : (
                    <a
                      href={liquidityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ width: '100%', maxWidth: '130px' }}
                    >
                      <Button sx={styles.styledBtn}>GET {vault?.stakeToken?.symbol}</Button>
                    </a>
                  )}
                </Flex>
              </Flex>
              <Flex sx={{ ...styles.onlyDesktop, mx: '10px', minWidth: '35px' }}>
                <Svg icon="caret" direction="right" width="15px" />
              </Flex>
              <Actions
                allowance={userAllowance?.toString()}
                stakedBalance={vault?.userData?.stakedBalance?.toString()}
                stakedTokenSymbol={vault?.stakeToken?.symbol}
                stakingTokenBalance={vault?.userData?.tokenBalance?.toString()}
                stakeTokenAddress={vault?.stakeToken?.address[chainId]}
                stakeTokenValueUsd={vault?.stakeTokenPrice}
                withdrawFee={vault?.withdrawFee}
                pid={vault.pid}
                vaultVersion={vault.version}
              />
              {(vault.version === VaultVersion.V2 || vault.version === VaultVersion.V3) && (
                <>
                  <Flex sx={{ ...styles.onlyDesktop, mx: '10px' }}>
                    <Svg icon="caret" direction="right" width="50px" />
                  </Flex>
                  <HarvestAction
                    pid={vault?.pid}
                    disabled={userEarnings <= 0}
                    userEarnings={userEarnings}
                    earnTokenSymbol={vault?.rewardToken?.symbol}
                  />
                </>
              )}
            </Flex>
          </>
        ),
      },
    }
  })
  return <ListView listViews={vaultsListView} />
}

export default React.memo(DisplayVaults)
