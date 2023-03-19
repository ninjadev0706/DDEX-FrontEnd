/** @jsxImportSource theme-ui */
import React from 'react'
import { Button, Flex, ListTagVariants, useModal } from '@ape.swap/uikit'
import ListView from 'components/ListViewV2/ListView'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { Farm, Tag } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import CalcButton from 'components/RoiCalculator/CalcButton'
import { useTranslation } from 'contexts/Localization'
import { Field, selectCurrency } from 'state/swap/actions'
import { useAppDispatch } from 'state'
import CardActions from './CardActions'
import { styles } from './styles'
import HarvestAction from './CardActions/HarvestAction'
import DualLiquidityModal from 'components/DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from 'state/zap/actions'
import { Svg } from '@ape.swap/uikit'
import Tooltip from 'components/Tooltip/Tooltip'

const DisplayFarms: React.FC<{ farms: Farm[]; openPid?: number; farmTags: Tag[]; v2Flag: boolean }> = ({
  farms,
  openPid,
  farmTags,
  v2Flag,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [onPresentAddLiquidityModal] = useModal(<DualLiquidityModal />, true, true, 'liquidityWidgetModal')

  const showLiquidity = (token, quoteToken, farm) => {
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
        currency1: farm.tokenAddresses[chainId],
        currency2: farm.quoteTokenAdresses[chainId],
      }),
    )
    onPresentAddLiquidityModal()
  }

  const farmsListView = farms.map((farm) => {
    const [token1, token2] = farm.lpSymbol.split('-')
    const userAllowance = farm?.userData?.allowance
    const userEarnings = getBalanceNumber(farm?.userData?.earnings || new BigNumber(0))?.toFixed(2)
    const userEarningsUsd = `$${(
      getBalanceNumber(farm?.userData?.earnings || new BigNumber(0)) * farm.bananaPrice
    ).toFixed(2)}`
    const userTokenBalance = `${getBalanceNumber(farm?.userData?.tokenBalance || new BigNumber(0))?.toFixed(6)} LP`
    const userTokenBalanceUsd = `$${(
      getBalanceNumber(farm?.userData?.tokenBalance || new BigNumber(0)) * farm?.lpValueUsd
    ).toFixed(2)}`
    const fTag = farmTags?.find((tag) => tag.pid === farm.pid)

    return {
      tokenDisplayProps: {
        token1: farm.pid === 184 ? 'NFTY2' : token1,
        token2,
        token3: 'BANANA',
        stakeLp: true,
      },
      listProps: {
        id: farm.pid,
        open: farm.pid === openPid,
        title: (
          <ListViewContent
            tag={fTag?.pid === farm.pid ? (fTag?.text.toLowerCase() as ListTagVariants) : null}
            value={farm?.lpSymbol}
            style={{ maxWidth: '170px' }}
          />
        ),
        titleWidth: '290px',
        infoContent: (
          <Tooltip
            valueTitle={t('Multiplier')}
            valueContent={farm?.multiplier}
            secondURL={farm?.projectLink}
            secondURLTitle={t('Learn More')}
            tokenContract={farm?.lpAddresses[chainId]}
          />
        ),
        cardContent: (
          <Flex sx={styles.cardContent}>
            <ListViewContent
              title={t('APY')}
              value={parseFloat(farm?.apy) > 1000000 ? `>1,000,000%` : `${farm?.apy}%`}
              toolTip={t(
                'APY includes annualized BANANA rewards and rewards for providing liquidity (DEX swap fees), compounded daily.',
              )}
              toolTipPlacement="bottomLeft"
              toolTipTransform="translate(8%, 0%)"
              aprCalculator={
                <CalcButton
                  label={farm.lpSymbol}
                  rewardTokenName="BANANA"
                  rewardTokenPrice={farm.bananaPrice}
                  apr={parseFloat(farm?.apr)}
                  lpApr={parseFloat(farm?.lpApr)}
                  apy={parseFloat(farm?.apy)}
                  lpAddress={farm.lpAddresses[chainId]}
                  isLp
                  tokenAddress={farm.tokenAddresses[chainId]}
                  quoteTokenAddress={farm.quoteTokenSymbol === 'BNB' ? 'ETH' : farm.quoteTokenAdresses[chainId]}
                  lpCurr1={farm?.tokenAddresses[chainId]}
                  lpCurr2={farm?.quoteTokenAdresses[chainId]}
                />
              }
              style={styles.apyInfo}
            />
            <Flex sx={{ ...styles.onlyDesktop, maxWidth: '180px', width: '100%' }}>
              <ListViewContent
                title={t('APR')}
                value={`${farm?.apr}%`}
                value2={`${farm?.lpApr}%`}
                value2Icon={
                  <span style={{ marginRight: '7px', transform: 'rotate(45deg)' }}>
                    <Svg icon="swapArrows" width={13} color="text" />
                  </span>
                }
                valueIcon={
                  <span style={{ marginRight: '5px' }}>
                    <Svg icon="banana_token" width={15} color="text" />
                  </span>
                }
                toolTip={t(
                  'BANANA reward APRs are calculated in real time. DEX swap fee APRs are calculated based on previous 24 hours of trading volume. Note: APRs are provided for your convenience. APRs are constantly changing and do not represent guaranteed returns.',
                )}
                toolTipPlacement="bottomLeft"
                toolTipTransform="translate(8%, 0%)"
                value2Direction="column"
                style={styles.farmInfo}
              />
            </Flex>
            <Flex sx={{ ...styles.onlyDesktop, maxWidth: '180px', width: '100%' }}>
              <ListViewContent
                title={t('Liquidity')}
                value={`$${Number(farm?.totalLpStakedUsd).toLocaleString(undefined)}`}
                toolTip={t('The total value of the LP tokens currently staked in this farm.')}
                toolTipPlacement={'bottomLeft'}
                toolTipTransform={'translate(23%, 0%)'}
                style={styles.farmInfo}
              />
            </Flex>
            <ListViewContent title={t('Earned')} value={userEarningsUsd} style={styles.earnedInfo} />
          </Flex>
        ),
        expandedContent: (
          <Flex sx={styles.expandedContent}>
            <Flex sx={{ ...styles.onlyMobile, width: '100%' }}>
              <ListViewContent
                title={t('APR')}
                value={`${farm?.lpApr}%`}
                valueIcon={
                  <span style={{ marginRight: '7px', transform: 'rotate(45deg)' }}>
                    <Svg icon="swapArrows" width={13} color="text" />
                  </span>
                }
                value2={`${farm?.apr}%`}
                value2Icon={
                  <span style={{ marginRight: '5px' }}>
                    <Svg icon="banana_token" width={15} color="text" />
                  </span>
                }
                toolTip={t(
                  'BANANA reward APRs are calculated in real time. DEX swap fee APRs are calculated based on previous 24 hours of trading volume. Note: APRs are provided for your convenience. APRs are constantly changing and do not represent guaranteed returns.',
                )}
                toolTipPlacement="bottomLeft"
                toolTipTransform="translate(8%, 0%)"
                style={styles.farmInfo}
              />
              <ListViewContent
                title={t('Liquidity')}
                value={`$${Number(farm?.totalLpStakedUsd).toLocaleString(undefined)}`}
                toolTip={t('The total value of the LP tokens currently staked in this farm.')}
                toolTipPlacement={'bottomLeft'}
                toolTipTransform={'translate(23%, 0%)'}
                style={styles.farmInfo}
              />
            </Flex>
            <Flex sx={styles.actionContainer}>
              <ListViewContent
                title={t('Available')}
                value={userTokenBalance}
                value2={userTokenBalanceUsd}
                value2Secondary
                value2Direction="column"
                style={{ maxWidth: '50%', flexDirection: 'column' }}
              />
              <Flex sx={{ width: '100%', maxWidth: ['130px', '130px', '140px'] }}>
                <Button
                  onClick={() =>
                    showLiquidity(
                      farm.tokenAddresses[chainId],
                      farm.quoteTokenSymbol === 'BNB' ? 'ETH' : farm.quoteTokenAdresses[chainId],
                      farm,
                    )
                  }
                  sx={styles.styledBtn}
                >
                  {t('GET LP')}
                  <Flex sx={{ ml: '5px' }}>
                    <Svg icon="ZapIcon" color="primaryBright" />
                  </Flex>
                </Button>
              </Flex>
            </Flex>
            <Flex sx={{ ...styles.onlyDesktop, mx: '10px' }}>
              <Svg icon="caret" direction="right" width="50px" />
            </Flex>
            <CardActions
              allowance={userAllowance?.toString()}
              stakedBalance={farm?.userData?.stakedBalance?.toString()}
              stakingTokenBalance={farm?.userData?.tokenBalance?.toString()}
              stakeLpAddress={farm.lpAddresses[chainId]}
              lpValueUsd={farm.lpValueUsd}
              pid={farm.pid}
              v2Flag={v2Flag}
            />
            <Flex sx={{ ...styles.onlyDesktop, mx: '10px' }}>
              <Svg icon="caret" direction="right" width="50px" />
            </Flex>
            <HarvestAction
              pid={farm.pid}
              disabled={userEarnings === '0.00'}
              userEarnings={userEarnings}
              userEarningsUsd={userEarningsUsd}
              v2Flag={v2Flag}
            />
          </Flex>
        ),
      },
    }
  })

  return <ListView listViews={farmsListView} />
}

export default React.memo(DisplayFarms)
