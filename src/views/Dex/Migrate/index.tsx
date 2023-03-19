/** @jsxImportSource theme-ui */
import React from 'react'
import { Text, Flex, Spinner, Button } from '@ape.swap/uikit'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import FullPositionCard from './components/PositionCard'
import { useUserRecentTransactions } from '../../../state/user/hooks'
import { dexStyles } from '../styles'
import DexNav from '../components/DexNav'
import { styles } from '../AddLiquidity/styles'
import RecentTransactions from '../components/RecentTransactions'
import LiquiditySubNav from '../components/LiquiditySubNav'
import { useMigratorBalances } from 'state/zapMigrator/hooks'
import { useFarms, usePollFarms } from 'state/farms/hooks'
import { useFetchFarmLpAprs } from 'state/hooks'
import MonkeyImage from '../Orders/components/OrderHistoryPanel/MonkeyImage'
import { useBills } from 'state/bills/hooks'
import { useJungleFarms } from 'state/jungleFarms/hooks'
import { Link } from 'react-router-dom'

export default function Migrate() {
  usePollFarms()
  const { account, chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  const farms = useFarms(null)
  const bills = useBills()
  const jungleFarms = useJungleFarms(null)
  const [recentTransactions] = useUserRecentTransactions()
  const { t } = useTranslation()

  const { loading, valid, results } = useMigratorBalances()
  // Merge different product tokens to check against migrate response and filter
  const mergedTokenPairsToCheckAgainst = [
    ...farms.flatMap((farm) => {
      const { tokenAddresses, quoteTokenAdresses } = farm
      return [
        [quoteTokenAdresses[chainId]?.toLowerCase(), tokenAddresses[chainId]?.toLowerCase()],
        [tokenAddresses[chainId]?.toLowerCase(), quoteTokenAdresses[chainId]?.toLowerCase()],
      ]
    }),
    ...bills.flatMap((bill) => {
      const { token, quoteToken } = bill
      return [
        [quoteToken.address[chainId]?.toLowerCase(), token.address[chainId]?.toLowerCase()],
        [token.address[chainId]?.toLowerCase(), quoteToken.address[chainId]?.toLowerCase()],
      ]
    }),
    ...jungleFarms.flatMap((farm) => {
      const { token, quoteToken } = farm.lpTokens
      return [
        [quoteToken.address[chainId]?.toLowerCase(), token.address[chainId]?.toLowerCase()],
        [token.address[chainId]?.toLowerCase(), quoteToken.address[chainId]?.toLowerCase()],
      ]
    }),
  ]

  const filteredResults = results.filter((res) => {
    const { token0, token1 } = res
    return mergedTokenPairsToCheckAgainst.find(
      ([address0, address1]) =>
        (token0.address.toLowerCase() === address0 || token0.address.toLowerCase() === address1) &&
        (token1.address.toLowerCase() === address0 || token1.address.toLowerCase() === address1),
    )
  })

  const walletBalances = valid ? filteredResults.filter((bal) => parseFloat(bal.walletBalance) > 0.0) : []
  const stakedBalances = valid ? filteredResults.filter((bal) => parseFloat(bal.stakedBalance) > 0.0) : []

  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ ...dexStyles.dexContainer }}>
          <DexNav />
          <LiquiditySubNav />
          <Flex sx={{ flexDirection: 'column', maxWidth: '100%', width: '420px' }}>
            <Flex sx={{ ...styles.topContainer, mb: '20px' }}>
              {!account ? (
                <UnlockButton fullWidth />
              ) : (
                (walletBalances?.length > 0 || stakedBalances?.length > 0) && (
                  <Button fullWidth as={Link} to="/migrate/all">
                    Migrate All
                  </Button>
                )
              )}
            </Flex>
            {(loading || !valid) && account ? (
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Spinner size={100} />
              </Flex>
            ) : account ? (
              walletBalances?.length > 0 || stakedBalances?.length > 0 ? (
                <Flex sx={{ flexDirection: 'column' }}>
                  {walletBalances && (
                    <Text mb="15px" ml="1px">
                      {t('Wallet')} ({walletBalances.length})
                    </Text>
                  )}
                  {walletBalances.map((bal) => (
                    <FullPositionCard {...bal} inWallet key={bal.lpAddress} />
                  ))}
                  {stakedBalances && (
                    <Text margin="15px 0px" ml="1px">
                      {t('Staked')} ({stakedBalances.length})
                    </Text>
                  )}
                  {stakedBalances.map((bal) => (
                    <FullPositionCard {...bal} key={bal.lpAddress} />
                  ))}
                </Flex>
              ) : (
                <Flex
                  sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 0px' }}
                >
                  <MonkeyImage />
                  <Text size="14px" sx={{ margin: '10px 0px 5px 0px', opacity: '.5' }}>
                    {t('No Other LPs Found!')}
                  </Text>
                </Flex>
              )
            ) : (
              <></>
            )}
          </Flex>
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}
