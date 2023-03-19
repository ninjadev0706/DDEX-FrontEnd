/** @jsxImportSource theme-ui */
import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useEagerConnect from 'hooks/useEagerConnect'
import { ResetCSS, ApeSwapTheme } from '@apeswapfinance/uikit'
import BigNumber from 'bignumber.js'
import MarketingModalCheck from 'components/MarketingModalCheck'
import { useFetchBananaPrice } from 'state/tokenPrices/hooks'
import { useFetchProfile, useUpdateNetwork, useFetchLiveIfoStatus, useFetchLiveTagsAndOrdering } from 'state/hooks'
import { usePollBlockNumber } from 'state/block/hooks'
import { PageMeta } from 'components/layout/Page'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import PoolFinder from './views/Dex/PoolFinder'
import ResetScroll from './utils/resetScroll'
import FloatingDocs from 'components/FloatingDocs'
// Most used routes get loaded directly
import Pool from './views/Dex/Pool'
import Swap from './views/Dex/Swap'
import AddLiquidity from './views/Dex/AddLiquidity'
import Zap from './views/Dex/Zap'
import RemoveLiquidity from './views/Dex/RemoveLiquidity'
import useCircularStaking from 'hooks/useCircularStaking'
// Load HomePage with Lazy load
import Home from './views/Homepage'
import { ChainId } from '@ape.swap/sdk'
import NetworkProductCheck from 'components/NetworkProductCheck'
import MigrateMasterApeV2 from './views/MigrateMasterApeV2'
import { useMonitorMigrationPhase } from 'state/migrationTimer/hooks'
import { CURRENT_MIGRATE_PATH } from 'components/Menu/chains/bscConfig'
import { useSetInitialMigrateStatus } from 'state/masterApeMigration/hooks'
import MigrationRequiredPopup from 'components/MigrationRequiredPopup'

declare module '@emotion/react' {
  export interface Theme extends ApeSwapTheme {}
}

// Route-based code splitting
const Farms = lazy(() => import('./views/Farms'))
const Pools = lazy(() => import('./views/Pools'))
const JungleFarms = lazy(() => import('./views/JungleFarms'))
const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
const DualFarms = lazy(() => import('./views/DualFarms'))
const Nft = lazy(() => import('./views/Nft'))
const BabRaffle = lazy(() => import('./views/BabRaffle'))
const Nfa = lazy(() => import('./views/Nft/Nfa'))
const ApeZone = lazy(() => import('./views/ApeZone'))
const Stats = lazy(() => import('./views/Stats'))
const Auction = lazy(() => import('./views/Auction'))
const BurningGames = lazy(() => import('./views/BurningGames'))
const AdminPools = lazy(() => import('./views/AdminPools'))
const Vaults = lazy(() => import('./views/Vaults'))
const NfaStaking = lazy(() => import('./views/NfaStaking'))
const Bills = lazy(() => import('./views/Bills'))
const Orders = lazy(() => import('./views/Dex/Orders'))
const TermsOfUse = lazy(() => import('./views/LegalPages/TermsOfUse'))
const PrivacyPolicy = lazy(() => import('./views/LegalPages/PrivacyPolicy'))
const ProtocolDashboard = lazy(() => import('./views/ProtocolDashboard'))
const Migrate = lazy(() => import('./views/Dex/Migrate'))
const MigrateLiquidity = lazy(() => import('./views/Dex/Migrate/MigrateLiquidity'))
const MigrateAll = lazy(() => import('./views/Dex/Migrate/MigrateAll'))
const UnstakeLiquidity = lazy(() => import('./views/Dex/Migrate/UnstakeLiquidity'))
const InfoPage = lazy(() => import('./views/InfoPage'))
const TokensPage = lazy(() => import('./views/InfoPage/views/Tokens'))
const PairsPage = lazy(() => import('./views/InfoPage/views/Pairs'))
const TransactionsPage = lazy(() => import('./views/InfoPage/views/Transactions'))
const TokenPage = lazy(() => import('./views/InfoPage/views/Token'))
const PairPage = lazy(() => import('./views/InfoPage/views/Pair'))

const redirectSwap = () => import('./views/Dex/Swap/redirects')

const RedirectPathToSwapOnly = lazy(async () =>
  redirectSwap().then((r) => ({
    default: r.RedirectPathToSwapOnly,
  })),
)
const RedirectToSwap = lazy(async () =>
  redirectSwap().then((r) => ({
    default: r.RedirectToSwap,
  })),
)

const redirectAddLiquidity = () => import('./views/Dex/AddLiquidity/redirects')
const RedirectDuplicateTokenIds = lazy(async () =>
  redirectAddLiquidity().then((r) => ({
    default: r.RedirectDuplicateTokenIds,
  })),
)
const RedirectOldAddLiquidityPathStructure = lazy(async () =>
  redirectAddLiquidity().then((r) => ({
    default: r.RedirectOldAddLiquidityPathStructure,
  })),
)
const RedirectToAddLiquidity = lazy(async () =>
  redirectAddLiquidity().then((r) => ({
    default: r.RedirectToAddLiquidity,
  })),
)

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()

  usePollBlockNumber()
  useUpdateNetwork()
  useEagerConnect()
  useFetchBananaPrice()
  useFetchProfile()
  useFetchLiveIfoStatus()
  useFetchLiveTagsAndOrdering()
  // To help with account switching load the initial migration status here
  useSetInitialMigrateStatus()

  // Hotfix for showModal. Update redux state and remove
  useCircularStaking()

  useEffect(() => {
    if (account) dataLayer?.push({ event: 'wallet_connect', chain: chainId, user_id: account })
    // if chainId is added to deps, it will be triggered each time users switch chain
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useMonitorMigrationPhase()

  const loadMenu = () => {
    return (
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route exact path="/nft">
              <Nft />
            </Route>
            <Route exact path="/bab-raffle">
              <BabRaffle />
            </Route>
            <Route path="/" exact component={Home} />
            <Route path="/farms">
              {chainId === ChainId.MATIC ? <DualFarms /> : chainId === ChainId.TLOS ? <JungleFarms /> : <Farms />}
            </Route>
            <Route path="/pools">
              <Pools />
            </Route>
            <Route path="/protocol-dashboard">
              <ProtocolDashboard />
            </Route>
            <Route path="/jungle-farms">
              <JungleFarms />
            </Route>
            <Route path="/maximizers">
              <Vaults />
            </Route>
            <Route path="/treasury-bills">
              <Bills />
            </Route>
            <Route path="/admin-pools">
              <AdminPools />
            </Route>
            <Route path="/iao">
              <Ifos />
            </Route>
            <Route path="/auction">
              <Auction />
            </Route>
            <Route exact path="/nft">
              <Nft />
            </Route>
            <Route path="/nft/:id">
              <Nfa />
            </Route>
            <Route path="/staking">
              <NfaStaking />
            </Route>
            <Route path="/gnana">
              <ApeZone />
            </Route>
            <Route path="/apestats">
              <Stats />
            </Route>
            <Route path="/burn">
              <BurningGames />
            </Route>
            <Route path="/spinner">
              <PageLoader />
            </Route>
            <Route path="/terms">
              <TermsOfUse />
            </Route>
            <Route path="/privacy">
              <PrivacyPolicy />
            </Route>
            <Route exact path="/info">
              <InfoPage />
            </Route>
            <Route path={'/' + CURRENT_MIGRATE_PATH}>
              <MigrateMasterApeV2 />
            </Route>
            <Route exact path="/info/tokens">
              <TokensPage />
            </Route>
            <Route exact path="/info/pairs">
              <PairsPage />
            </Route>
            <Route exact path="/info/transactions">
              <TransactionsPage />
            </Route>
            <Route exact path="/info/token/:chain/:tokenId">
              <TokenPage />
            </Route>
            <Route exact path="/info/pair/:chain/:pairId">
              <PairPage />
            </Route>
            {/* Redirect */}
            <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>
            <Route path="/banana-farms">
              <Redirect to="/farms" />
            </Route>
            {/* SWAP ROUTES */}
            <Route path="/swap" component={Swap} />
            <Route exact strict path="/limit-orders" component={Orders} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Pool} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact strict path="/migrate" component={Migrate} />
            <Route exact strict path="/migrate/:currencyIdA/:currencyIdB" component={MigrateLiquidity} />
            <Route exact strict path="/unstake/:currencyIdA/:currencyIdB" component={UnstakeLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/add-liquidity" component={AddLiquidity} />
            <Route exact path="/add-liquidity/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add-liquidity/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
            <Route exact path="/migrate/all" component={MigrateAll} />
            <Route exact path="/zap" component={Zap} />
            <Route exact strict path="/zap/:currencyIdA" component={Zap} />
            <Route exact strict path="/zap/:currencyIdA/:currencyIdB/:currencyIdC" component={Zap} />
            {/* SWAP ROUTES */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
    )
  }

  return (
    <Router>
      <NetworkProductCheck />
      <PageMeta />
      <ResetScroll />
      <ResetCSS />
      <GlobalStyle />
      <MarketingModalCheck />
      {loadMenu()}
      <MigrationRequiredPopup v2Farms={[]} farms={[]} vaults={[]} homepage />
      <FloatingDocs />
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
