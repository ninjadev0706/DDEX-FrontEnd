/** @jsxImportSource theme-ui */
import React, { useEffect, useState } from 'react'
import { Flex, Text, Box, Link } from 'theme-ui'
import { Button, Svg, useModal } from '@ape.swap/uikit'
import { DropDownIcon } from 'components/ListView/styles'
import { useTranslation } from 'contexts/Localization'
import { useBananaAddress, useGoldenBananaAddress } from 'hooks/useAddress'
import { Field, selectCurrency } from 'state/swap/actions'
import { useAppDispatch } from 'state'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { tokenListInfo } from './tokenInfo'
import styles, { FarmButton } from './styles'
import DualLiquidityModal from '../DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from 'state/zap/actions'

interface DetailsContentProps {
  onDismiss?: () => void
  label?: string
  rewardTokenName?: string
  rewardTokenPrice?: number
  apr?: number
  lpApr?: number
  apy?: number
  lpAddress?: string
  tokenAddress?: string
  quoteTokenAddress?: string
  isLp?: boolean
  liquidityUrl?: string
  lpCurr1?: string
  lpCurr2?: string
}

const DetailsContent: React.FC<DetailsContentProps> = ({
  apr,
  lpApr,
  isLp,
  label,
  tokenAddress,
  quoteTokenAddress,
  apy,
  liquidityUrl,
  rewardTokenName,
  lpCurr1,
  lpCurr2,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [link, setLink] = useState('')
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const banana = useBananaAddress()
  const gnana = useGoldenBananaAddress()

  const [onPresentDualLiquidityModal] = useModal(<DualLiquidityModal />, true, true, 'liquidityWidgetModal')

  useEffect(() => {
    if (!isLp) {
      if (tokenAddress?.toLowerCase() === banana.toLowerCase()) {
        setLink('swap')
      }
      if (tokenAddress?.toLowerCase() === gnana.toLowerCase()) {
        setLink('gnana')
      }
    }
  }, [chainId, tokenAddress, isLp, banana, gnana])

  const showLiquidity = (token?, quoteToken?) => {
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
        currency1: lpCurr1,
        currency2: lpCurr2,
      }),
    )
    onPresentDualLiquidityModal()
  }

  return (
    <>
      <Flex
        sx={{ justifyContent: 'center', alignItems: 'center', columnGap: '10px', marginBottom: '15px' }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Text
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          {t('Details')}
        </Text>
        <DropDownIcon width="10px" open={expanded} />
      </Flex>
      <Box sx={styles.detailContainer(!expanded)}>
        <Flex sx={styles.detailRow}>
          {lpApr ? (
            <Text>{t('APR (incl. LP rewards)')}</Text>
          ) : (
            <Text>
              {t('APR')} - {rewardTokenName} {t('rewards')}
            </Text>
          )}
          <Text>{(apr + (lpApr || 0)).toFixed(2)}%</Text>
        </Flex>
        {isLp && lpApr && (
          <>
            <Flex sx={styles.detailRow}>
              <Text>{t('Base APR (BANANA yield only)')}</Text>
              <Text>{apr?.toFixed(2)}%</Text>
            </Flex>
            <Flex sx={styles.detailRow}>
              <Text>{t('APY (1x daily compound)')}</Text>
              <Text>{apy?.toFixed(2)}%</Text>
            </Flex>
          </>
        )}
        <ul>
          {tokenListInfo[isLp ? 'lpPair' : 'notLpPair']?.map((item) => (
            <li key={item}>
              <Text sx={styles?.text} dangerouslySetInnerHTML={{ __html: t(item) }} />
            </li>
          ))}
        </ul>

        <Flex sx={{ marginTop: '25px', justifyContent: 'center' }}>
          {isLp && !liquidityUrl && (
            <FarmButton onClick={() => showLiquidity(tokenAddress, quoteTokenAddress)}>
              {t('GET')} {label}
              <Box sx={{ marginLeft: '5px' }}>
                <Svg icon="ZapIcon" color="primaryBright" />
              </Box>
            </FarmButton>
          )}
          {isLp && liquidityUrl && (
            <Link
              href={liquidityUrl}
              target="_blank"
              sx={{
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              <Button style={{ fontSize: '16px' }}>
                {t('GET')} {label}
              </Button>
            </Link>
          )}
          {!isLp && (
            <Link
              href={link}
              target="_blank"
              sx={{
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              <Button style={{ fontSize: '16px' }}>
                {t('GET')} {label}
                <Box sx={{ marginLeft: '5px' }}>
                  <Svg icon="ZapIcon" color="primaryBright" />
                </Box>
              </Button>
            </Link>
          )}
        </Flex>
      </Box>
    </>
  )
}
export default React.memo(DetailsContent)
