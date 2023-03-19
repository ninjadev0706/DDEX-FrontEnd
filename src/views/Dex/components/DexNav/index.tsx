/** @jsxImportSource theme-ui */
import { Link, useHistory } from 'react-router-dom'
import { CogIcon, Flex, Text, useModal, Svg } from '@ape.swap/uikit'
import { ChainId } from '@ape.swap/sdk'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SettingsModal from '../../../../components/Menu/GlobalSettings/SettingsModal'
import { styles } from './styles'

interface DexNavProps {
  zapSettings?: boolean
}

const DexNav: React.FC<DexNavProps> = ({ zapSettings }) => {
  const history = useHistory()
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { pathname } = history.location

  const onLiquidity =
    pathname?.includes('add-liquidity') ||
    pathname?.includes('liquidity') ||
    pathname?.includes('remove') ||
    pathname?.includes('find') ||
    pathname?.includes('zap') ||
    pathname?.includes('migrate') ||
    pathname?.includes('unstake')

  const [onPresentSettingsModal] = useModal(<SettingsModal zapSettings={zapSettings} />)

  return (
    <Flex sx={styles.dexNavContainer}>
      <Flex
        sx={{ ...styles.navLinkContainer, justifyContent: chainId === ChainId.BSC ? 'space-between' : 'flex-start' }}
      >
        <Text
          size="14px"
          sx={{
            ...styles.navLink,
            color: !pathname?.includes('swap') && 'textDisabled',
            mr: chainId === ChainId.BSC ? '0px' : '30px',
          }}
          as={Link}
          to="/swap"
          id="swap-link"
          className="swap"
        >
          {t('Swap')}
        </Text>
        {chainId === ChainId.BSC && (
          <Text
            size="14px"
            sx={{
              ...styles.navLink,
              color: !pathname?.includes('orders') && 'textDisabled',
            }}
            as={Link}
            to="/limit-orders"
            id="orders-link"
            className="orders"
          >
            {t('Orders')}
          </Text>
        )}
        <Text
          size="14px"
          sx={{ ...styles.navLink, color: !onLiquidity && 'textDisabled' }}
          as={Link}
          to={chainId === ChainId.MAINNET ? '/add-liquidity' : '/zap'}
          id="liquidity-link"
          className="liquidity"
        >
          {t('Liquidity')}
        </Text>
      </Flex>
      <Flex sx={{ ...styles.navIconContainer }}>
        <Flex sx={styles.iconCover} onClick={() => history.push({ search: `?modal=tutorial` })}>
          <Svg icon="quiz" />
        </Flex>
        <Flex sx={styles.iconCover} onClick={() => window.open('https://app.multichain.org/#/router', '_blank')}>
          <Svg icon="bridge" />
        </Flex>
        <CogIcon sx={{ cursor: 'pointer' }} width={24} onClick={onPresentSettingsModal} />
      </Flex>
    </Flex>
  )
}

export default React.memo(DexNav)
