/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Token } from '@ape.swap/sdk'
import { Text, Flex, Button, Svg, Link as UiLink } from '@ape.swap/uikit'
import { Divider } from 'theme-ui'
import { AnimatePresence, motion } from 'framer-motion'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import useTotalSupply from '../../../../../hooks/useTotalSupply'
import Dots from 'components/Loader/Dots'
import { styles } from './styles'
import { MigrateResult, useZapMigratorActionHandlers } from 'state/zapMigrator/hooks'
import { useLastZapMigratorRouter } from 'state/user/hooks'
import { useTokenPriceUsd } from 'hooks/useTokenPriceUsd'
import { wrappedToNative } from 'utils'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { useFarms } from 'state/farms/hooks'
import { Link } from 'react-router-dom'
import { MigrateFarmIcon } from 'components/Icons'
import useWindowSize from 'hooks/useDimensions'

interface PositionCardProps extends MigrateResult {
  inWallet?: boolean
  showUnwrapped?: boolean
}

export default function FullPositionCard({
  token0,
  token1,
  smartRouter,
  lpAddress,
  inWallet,
  walletBalance,
  stakedBalance,
}: PositionCardProps) {
  // Load farms to check if a farm matches tokens
  const farms = useFarms(null)

  const { width } = useWindowSize()

  const { chainId } = useActiveWeb3React()

  const lpToken = new Token(chainId, lpAddress, 18)

  const userBalance = inWallet ? walletBalance : stakedBalance

  const { onUserSetMigrator } = useZapMigratorActionHandlers()

  const [showMore, setShowMore] = useState(false)
  const { t } = useTranslation()

  const totalPoolTokens = useTotalSupply(lpToken)
  const [, updateLastZapMigratorRouter] = useLastZapMigratorRouter()

  const onSetMigrator = () => {
    onUserSetMigrator(lpAddress, smartRouter)
    updateLastZapMigratorRouter(smartRouter)
  }

  const currencyPrice = useTokenPriceUsd(chainId, lpToken, true)

  const poolTokenPercentage = parseFloat(userBalance) / parseFloat(totalPoolTokens?.raw.toString())

  const [token0Deposited, token1Deposited] = [
    poolTokenPercentage * token0.reserves,
    poolTokenPercentage * token1.reserves,
  ]

  const tokenObj0 = new Token(chainId, token0.address, token0.decimals, token0.symbol)
  const tokenObj1 = new Token(chainId, token1.address, token1.decimals, token1.symbol)

  const matchingFarm = farms.find(
    (farm) =>
      (farm.tokenAddresses[chainId].toLowerCase() === token0.address.toLowerCase() ||
        farm.tokenAddresses[chainId].toLowerCase() === token1.address.toLowerCase()) &&
      (farm.quoteTokenAdresses[chainId].toLowerCase() === token0.address.toLowerCase() ||
        farm.quoteTokenAdresses[chainId].toLowerCase() === token1.address.toLowerCase()),
  )

  return (
    <Flex sx={{ ...styles.poolContainer }} onClick={() => setShowMore((prev) => !prev)}>
      <Flex sx={{ ...styles.innerContainer }}>
        <Flex sx={{ ...styles.titleContainer, flexShrink: 0 }}>
          <Flex sx={{ alignItems: 'center' }}>
            <Flex sx={{ mr: '7.5px' }}>
              <DoubleCurrencyLogo currency0={tokenObj0} currency1={tokenObj1} />
            </Flex>
            <Flex sx={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text size="10px" weight={400} sx={{ lineHeight: '5px' }}>
                {smartRouter} LP
              </Text>
              <Text size="12px" weight={700}>
                {!token0 || !token1 ? (
                  <Dots>Loading</Dots>
                ) : (
                  `${wrappedToNative(token0.symbol)}-${wrappedToNative(token1.symbol)}`
                )}
              </Text>
              <Text size="10px" weight={400} sx={{ lineHeight: '5px' }}>
                {currencyPrice ? `$${(currencyPrice * parseFloat(userBalance)).toFixed(2)}` : '-'}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex sx={{ alignItems: 'center' }}>
          <Button
            as={Link}
            onClick={onSetMigrator}
            to={
              inWallet ? `migrate/${token0.address}/${token1.address}` : `unstake/${token0.address}/${token1.address}`
            }
            sx={{ height: '40px', mr: '10px' }}
          >
            <Svg icon="Migrate" width="15px" color="primaryBright" />
            <Text size="10px" weight={700} ml="5px">
              {width < 400 ? t('Migrate') : t('Migrate Liquidity')}
            </Text>
          </Button>
          <Svg icon="caret" width="8px" direction={showMore ? 'up' : 'down'} />
        </Flex>
      </Flex>
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'fit-content' }}
            transition={{ opacity: { duration: 0.2 } }}
            exit={{ opacity: 0, height: 0 }}
            sx={{ overflow: 'hidden', position: 'relative', width: '100%' }}
          >
            <Divider />
            <Flex sx={{ width: '100%', flexDirection: 'column', mb: '10px' }}>
              <Flex sx={{ justifyContent: 'space-between', margin: '2.5px 0px' }}>
                <Text size="14px" weight={500}>
                  {t('Total pooled tokens')}
                </Text>
                {userBalance ? (
                  <Text size="14px" weight={700}>
                    {parseFloat(userBalance)?.toFixed(6)}
                  </Text>
                ) : (
                  '-'
                )}
              </Flex>
              <Flex sx={{ justifyContent: 'space-between', margin: '2.5px 0px' }}>
                <Text size="14px" weight={500}>
                  {t('Pooled')} {wrappedToNative(token0.symbol)}
                </Text>
                {token0Deposited ? (
                  <Flex sx={{ alignItems: 'center' }}>
                    <Text size="14px" weight={700} mr="8px">
                      {token0Deposited?.toFixed(6)}
                    </Text>
                    <CurrencyLogo currency={tokenObj0} />
                  </Flex>
                ) : (
                  '-'
                )}
              </Flex>
              <Flex sx={{ justifyContent: 'space-between', margin: '2.5px 0px' }}>
                <Text size="14px" weight={500}>
                  {t('Pooled')} {wrappedToNative(token1.symbol)}
                </Text>
                {token1Deposited ? (
                  <Flex sx={{ alignItems: 'center' }}>
                    <Text size="14px" weight={700} mr="8px">
                      {token1Deposited?.toFixed(6)}
                    </Text>
                    <CurrencyLogo currency={tokenObj1} />
                  </Flex>
                ) : (
                  '-'
                )}
              </Flex>
              <Flex sx={{ justifyContent: 'space-between', margin: '2.5px 0px' }}>
                <Text size="14px" weight={500}>
                  {t('Share of pool')}
                </Text>
                <Text size="14px" weight={700}>
                  {poolTokenPercentage
                    ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                    : '-'}
                </Text>
              </Flex>
              {matchingFarm && (
                <Flex
                  sx={{
                    mt: '10px',
                    flexDirection: 'row',
                    height: '100px',
                    alignItems: 'center',
                    background: 'white4',
                    padding: '15px',
                    borderRadius: '10px',
                  }}
                >
                  <Flex sx={{ width: '25%', alignItems: 'center', justifyContent: 'center', mr: '10px' }}>
                    <MigrateFarmIcon />
                  </Flex>
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Text size="12px" weight={400} sx={{ lineHeight: '20px' }}>
                      Earn <span> {matchingFarm?.apy || ''}% APY </span>
                      {/* Earn <span sx={{ fontWeight: 700 }}> {matchingFarm?.apy || ''}% APY </span> */}
                      with the{' '}
                      <span>
                      {/* <span sx={{ fontWeight: 700 }}> */}
                        {wrappedToNative(token0.symbol)}-{wrappedToNative(token1.symbol)} farm at ApeSwap
                      </span>
                    </Text>
                    <UiLink href={`https://apeswap.finance/farms?pid=${matchingFarm.pid}`} target="_blank">
                      <Text size="12px" mr="10px">
                        View farm
                      </Text>
                      <Svg icon="external" />
                    </UiLink>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  )
}
