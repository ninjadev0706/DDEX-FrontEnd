/** @jsxImportSource theme-ui */
import React, { useMemo } from 'react'
import { Pair } from '@ape.swap/sdk'
import { Text, Flex, Spinner } from '@ape.swap/uikit'
import { Link } from 'react-router-dom'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import FullPositionCard from '../../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../../state/wallet/hooks'
import { usePairs } from '../../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs, useUserRecentTransactions } from '../../../state/user/hooks'
import { dexStyles } from '../styles'
import DexNav from '../components/DexNav'
import { styles } from './styles'
import RecentTransactions from '../components/RecentTransactions'
import LiquiditySubNav from '../components/LiquiditySubNav'

export default function Pool() {
  const { account } = useActiveWeb3React()
  const [recentTransactions] = useUserRecentTransactions()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
  const { t } = useTranslation()

  const renderBody = () => {
    if (!account) {
      return <></>
    }
    if (v2IsLoading) {
      return (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size={200} />
        </Flex>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Flex sx={{ justifyContent: 'center' }}>
        <Text textAlign="center">{t('No liquidity found.')}</Text>
      </Flex>
    )
  }

  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ ...dexStyles.dexContainer }}>
          <DexNav />
          <LiquiditySubNav />
          <Flex sx={{ flexDirection: 'column', maxWidth: '100%', width: '420px' }}>
            <Flex sx={{ ...styles.topContainer }}>
              <Text weight={700} sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
                {t('Add liquidity to receive LP tokens')}
              </Text>
              {!account && <UnlockButton mt="10px" />}
            </Flex>
            {renderBody()}
          </Flex>
          {account && !v2IsLoading && (
            <Flex sx={{ flexDirection: 'column', alignItems: 'center', margin: '20px 0px 10px 0px' }}>
              <Text mb="8px">{t('Missing LPs?')}</Text>
              <Text style={{ textDecoration: 'underline' }} mb="8px" as={Link} to="/find">
                {t('Find other LP tokens')}
              </Text>
              <Text mb="8px">{t('or')}</Text>
              <Flex sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                <Text style={{ textDecoration: 'underline' }} mb="8px" pr="5px" as={Link} to="/apestats">
                  {t('Visit ApeStats')}
                </Text>
                <Text mb="8px">{t(' for an overview of your positions.')}</Text>
              </Flex>
            </Flex>
          )}
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}
