/** @jsxImportSource theme-ui */
import React from 'react'
import { TutorialModal } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { NETWORK_LABEL } from 'config/constants/chains'
import { useTranslation } from 'contexts/Localization'
import {
  SwapSlides,
  FarmSlides,
  PoolSlides,
  MaximizerSlides,
  GnanaSlides,
  BillsSlides,
  IAOSlides,
  OrdersSlides,
  LiquiditySlides,
  ConnectWalletSlide,
  MigrateSlides,
  TheMigrationSlides,
  DefaultSlides,
} from './TutorialSlides'
import { ChainId } from '@ape.swap/sdk'

const Tutorial: React.FC<{
  location: string
  onDismiss: () => void
}> = ({ location, onDismiss }) => {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  const networkLabel = NETWORK_LABEL[chainId]

  const getSlidesContent = () => {
    switch (location) {
      case '/swap': {
        return {
          type: `${networkLabel}-dex`,
          title: "Welcome to ApeSwap's Dex",
          description: `Easily trade ANY token on ${networkLabel} ${chainId === ChainId.BSC ? 'Chain' : 'Network'}!`,
          slides: account ? SwapSlides() : [<ConnectWalletSlide key={0} />, ...SwapSlides()],
          isConnected: !!account,
        }
      }
      case '/farms': {
        return {
          type: `${networkLabel}-farms`,
          title: `Welcome to ${chainId === ChainId.BSC ? 'BANANA' : networkLabel} Farms`,
          description: `Earn ${
            chainId === ChainId.TLOS ? 'TLOS' : 'BANANA'
          } by staking liquidity provider (LP) tokens!`,
          slides: account ? FarmSlides() : [<ConnectWalletSlide key={0} />, ...FarmSlides()],
          width: '300px',
          isConnected: !!account,
        }
      }
      case '/jungle-farms': {
        return {
          type: `jungle-farms`,
          title: `Welcome to Jungle Farms`,
          description: `Earn Partner Tokens by Staking Liquidity!`,
          slides: account ? FarmSlides() : [<ConnectWalletSlide key={0} />, ...FarmSlides()],
          width: '285px',
          isConnected: !!account,
        }
      }
      case '/pools': {
        return {
          type: 'pools',
          title: 'Welcome to Staking Pools',
          description: 'Earn tokens by staking BANANA or GNANA!',
          slides: account ? PoolSlides() : [<ConnectWalletSlide key={0} />, ...PoolSlides()],
          isConnected: !!account,
        }
      }
      case '/maximizers': {
        return {
          type: 'maximizers',
          title: 'Welcome to Banana Maximizers',
          description: 'Maximize your BANANA yields!',
          slides: account ? MaximizerSlides() : [<ConnectWalletSlide key={0} />, ...MaximizerSlides()],
          isConnected: !!account,
        }
      }
      case '/gnana': {
        return {
          type: 'gnana',
          title: 'Welcome to Golden Banana',
          description: 'Unlock the exclusive benefits of GNANA!',
          slides: account ? GnanaSlides() : [<ConnectWalletSlide key={0} />, ...GnanaSlides()],
          width: '296px',
          isConnected: !!account,
        }
      }
      case '/treasury-bills': {
        return {
          type: 'treasury-bills',
          title: 'Welcome to Treasury Bills',
          description: 'Buy tokens at a discount and obtain a unique NFT!',
          slides: account ? BillsSlides() : [<ConnectWalletSlide key={0} />, ...BillsSlides()],
          isConnected: !!account,
        }
      }
      case '/iao': {
        return {
          type: 'iao',
          title: 'Welcome to Initial Ape Offerings',
          description: 'Contribute BNB or GNANA to obtain newly launched tokens!',
          slides: account ? IAOSlides() : [<ConnectWalletSlide key={0} />, ...IAOSlides()],
          width: '285px',
          isConnected: !!account,
        }
      }
      case '/limit-orders': {
        return {
          type: 'orders',
          title: 'Welcome to Limit Orders',
          description: 'Trade at the price you want!',
          slides: account ? OrdersSlides() : [<ConnectWalletSlide key={0} />, ...OrdersSlides()],
          isConnected: !!account,
        }
      }
      case '/migrate': {
        return {
          type: 'migrate',
          title: 'Welcome to Liquidity Migration',
          description: 'Migrate your liquidity from external DEXs into ApeSwap',
          slides: account ? MigrateSlides() : [<ConnectWalletSlide key={0} />, ...MigrateSlides()],
          width: '332px',
          isConnected: !!account,
        }
      }
      case '/the-migration': {
        return {
          type: 'the-migration',
          title: 'Welcome to The Migration',
          description: 'Migrate your assets to our updated contracts to continue earning rewards!',
          slides: account ? MigrateSlides() : [<ConnectWalletSlide key={0} />, ...TheMigrationSlides()],
          width: '332px',
          isConnected: !!account,
        }
      }
      case '/liquidity':
      case '/zap':
      case '/add-liquidity':
        return {
          type: 'liquidity',
          title: 'Welcome to Dex Liquidity',
          description: 'Provide liquidity to earn trading fees!',
          slides: account ? LiquiditySlides() : [<ConnectWalletSlide key={0} />, ...LiquiditySlides()],
          isConnected: !!account,
        }
      default:
        return {
          type: 'default',
          title: 'WELCOME TO APESWAP',
          description: 'Before we begin, please review these important tips!',
          slides: DefaultSlides(),
          isConnected: false,
        }
    }
  }

  const tutorials = getSlidesContent()

  return (
    <TutorialModal
      type={tutorials?.type}
      title={tutorials?.title}
      description={tutorials?.description}
      t={t}
      onDismiss={onDismiss}
      isConnected={tutorials?.isConnected}
      width={tutorials.width}
    >
      {tutorials?.slides}
    </TutorialModal>
  )
}

export default Tutorial
