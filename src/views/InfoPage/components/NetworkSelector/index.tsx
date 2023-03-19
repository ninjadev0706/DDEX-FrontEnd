/** @jsxImportSource theme-ui */
import { Button, Flex, Input, Link, Svg, Text, useModal } from '@ape.swap/uikit'
import { INFO_PAGE_CHAIN_PARAMS, MAINNET_CHAINS } from 'config/constants/chains'
import React from 'react'
import useIsMobile from '../../../../hooks/useIsMobile'
import { useFetchActiveChains } from '../../../../state/info/hooks'
import { useHistory, useLocation } from 'react-router-dom'
import LegacySelectModal from '../Modals/LegacySelectModal'
import { ChainId } from '@ape.swap/sdk'

interface NetworkSelectorProps {
  onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const NetworkSelector: React.FC<NetworkSelectorProps> = (props) => {
  const mobile = useIsMobile()
  const [activeChains, toggleChain] = useFetchActiveChains()
  const { onFilter } = props
  const location = useLocation()
  const history = useHistory()

  const [onPresentLegacySelectModal] = useModal(<LegacySelectModal onDismiss={null} />, true, true)

  function isActive(chain) {
    // If active changes equals null it means all chains should be shown
    return activeChains === null || activeChains.filter((x) => x === chain).length > 0
  }

  return (
    <>
      <Flex
        sx={{
          width: `${mobile ? '95vw' : '100%'}`,
          maxWidth: '1200px',
          height: 'fit-content',
          justifyContent: 'flex-end',
          marginBottom: '15px',
        }}
      >
        <Link onClick={onPresentLegacySelectModal}>
          <Text weight={400}>View legacy info pages</Text>
        </Link>
      </Flex>
      <Flex
        sx={{
          width: `${mobile ? '95vw' : '100%'}`,
          maxWidth: '1200px',
          height: 'fit-content',
          padding: '20px',
          background: 'white2',
          borderRadius: '10px',
          mb: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <Flex
          sx={{
            width: `${mobile ? '100%' : '245px'}`,
            marginTop: `${mobile ? '15px' : '0px'}`,
            justifyContent: `${mobile ? 'center' : 'flex-start'}`,
            height: '36px',
          }}
        >
          <Button
            size="sm"
            variant={location.pathname === '/info' ? 'primary' : 'tertiary'}
            sx={{
              textTransform: 'none',
              color: `${location.pathname === '/info' ? 'white' : 'gray'}`,
              fontSize: '12px',
              paddingLeft: '18px',
              paddingRight: `${location.pathname.includes('/info/token') ? '34px' : '18px'}`,
              zIndex: `${location.pathname === '/info' ? '100' : '20'}`,
            }}
            onClick={() => history.push('/info')}
          >
            Overview
          </Button>
          <Button
            ml={-8}
            size="sm"
            variant={location.pathname.includes('/info/tokens') ? 'primary' : 'tertiary'}
            sx={{
              textTransform: 'none',
              color: `${location.pathname.includes('/info/token') ? 'white' : 'gray'}`,
              fontSize: '12px',
              paddingRight: `${location.pathname.includes('/info/pairs') ? '34px' : '18px'}`,
              paddingLeft: `${location.pathname.includes('/info/tokens') ? '18px' : '34px'}`,
              zIndex: `${location.pathname.includes('/info/tokens') ? '100' : '10'}`,
            }}
            onClick={() => history.push('/info/tokens')}
          >
            Tokens
          </Button>
          <Button
            size="sm"
            ml={-8}
            variant={location.pathname.includes('/info/pairs') ? 'primary' : 'tertiary'}
            sx={{
              textTransform: 'none',
              color: `${location.pathname.includes('/info/pairs') ? 'white' : 'gray'}`,
              fontSize: '12px',
              paddingLeft: `${location.pathname.includes('/info/pairs') ? '18px' : '34px'}`,
              paddingRight: '18px',
              zIndex: `${location.pathname.includes('/info/pairs') ? '100' : '0'}`,
            }}
            onClick={() => history.push('/info/pairs')}
          >
            Pairs
          </Button>
        </Flex>
        <Flex sx={{ flex: `${mobile ? '0 0 100%' : '1'}`, marginTop: `${mobile ? '15px' : '0px'}` }}>
          <Text bold mr="15px" mt="5px" ml="20px">
            Search
          </Text>
          <Input
            icon="search"
            sx={{ width: '100%', marginLeft: '10px', borderRadius: '10px', fontWeight: 800, border: 'none' }}
            width="100%"
            onChange={onFilter}
          />
        </Flex>
        <Flex
          sx={{
            flex: `${mobile ? '0 0 100%' : ''}`,
            justifyContent: `${mobile ? 'center' : 'flex-end'}`,
            order: `${mobile ? '-1' : '1'}`,
          }}
        >
          {MAINNET_CHAINS.map((chainId) => {
            return (
              <div
                onClick={() => toggleChain(chainId)}
                key={chainId}
                // sx={{
                //   background: 'white3',
                //   borderRadius: '10px',
                //   padding: '10px',
                //   cursor: 'pointer',
                //   margin: '0px 0px 0px 10px',
                // }}
              >
                <Flex sx={{ filter: `${isActive(chainId) === true ? 'none' : 'grayscale(100%)'}` }}>
                  <Svg
                    width={30}
                    height={30}
                    icon={chainId === ChainId.TLOS ? 'tlos_token' : INFO_PAGE_CHAIN_PARAMS[chainId].icon}
                  />
                </Flex>
              </div>
            )
          })}
        </Flex>
      </Flex>
    </>
  )
}

export default NetworkSelector
