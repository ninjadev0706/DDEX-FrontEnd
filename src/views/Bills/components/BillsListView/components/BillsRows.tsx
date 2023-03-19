/** @jsxImportSource theme-ui */
import React from 'react'
import getTimePeriods from 'utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import ListViewContent from 'components/ListViewV2/ListViewContent'
import { Flex } from '@ape.swap/uikit'
import BillModal from '../../Modals'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import ListView from 'components/ListViewV2/ListView'
import EmptyListComponent, { EmptyComponentType } from '../../EmptyListComponent/EmptyList'
import { Bills } from 'state/types'
import { formatNumberSI } from 'utils/formatNumber'
import DiscountContent from './DiscountContent'
import useIsMobile from 'hooks/useIsMobile'
import Tooltip from 'components/Tooltip/Tooltip'
import { BLOCK_EXPLORER } from 'config/constants/chains'
import { ChainId } from '@ape.swap/sdk'

interface BillsRowsProps {
  billsToRender: Bills[]
  noResults: boolean
}

const BillsRows: React.FC<BillsRowsProps> = ({ billsToRender, noResults }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const billsListView = billsToRender.map((bill) => {
    const { earnToken, token, quoteToken, maxTotalPayOut, totalPayoutGiven, earnTokenPrice, discount } = bill
    const vestingTime = getTimePeriods(parseInt(bill.vestingTime), true)
    const available = new BigNumber(maxTotalPayOut)
      ?.minus(new BigNumber(totalPayoutGiven))
      ?.div(new BigNumber(10).pow(earnToken.decimals[chainId]))

    const thresholdToHide = new BigNumber(11).div(earnTokenPrice)
    const thresholdToShow = new BigNumber(5).div(earnTokenPrice)
    const disabled = new BigNumber(available).lte(thresholdToHide) || discount === '100.00'

    const displayAvailable = available.minus(thresholdToShow).toFixed(0)
    const explorerLink = BLOCK_EXPLORER[chainId]
    const billContractURL = `${explorerLink}/address/${bill?.contractAddress[chainId]}`

    return {
      tokenDisplayProps: {
        token1: token.symbol,
        token2: quoteToken.symbol,
        token3: earnToken.symbol,
        stakeLp: true,
        billArrow: true,
      },
      listProps: {
        id: bill.index,
        title: (
          <ListViewContent
            tag="ape"
            value={bill.lpToken.symbol}
            style={{ maxWidth: '150px', flexDirection: 'column' }}
          />
        ),
        infoContent: (
          <Tooltip
            tokenContract={bill?.earnToken?.address[chainId]}
            secondURL={billContractURL}
            secondURLTitle={t('View Bill Contract')}
            twitter={bill?.twitter}
            projectLink={bill?.projectLink}
            audit={bill?.audit}
          />
        ),
        titleWidth: '278px',
        cardContent: isMobile ? (
          <DiscountContent
            title={t('Discount')}
            valueColor={disabled ? null : parseFloat(bill?.discount) < 0 ? '#DF4141' : '#38A611'}
            value={disabled ? 'N/A' : `${bill?.discount}%`}
            value2={disabled ? '' : bill?.priceUsd}
            toolTip={t(`This is the percentage discount relative to the token's current market price.`)}
            showToolTipPrice={parseFloat(bill?.priceUsd) < 0.001}
            flexDirection="row"
          />
        ) : (
          <Flex
            sx={{
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'space-between',
              '@media screen and (min-width: 852px)': {
                flexDirection: 'row',
              },
            }}
          >
            <Flex sx={{ width: '100%', maxWidth: '130px', ml: '10px' }}>
              <DiscountContent
                title={t('Discount')}
                valueColor={disabled ? null : parseFloat(bill?.discount) < 0 ? '#DF4141' : '#38A611'}
                value={disabled ? 'N/A' : `${bill?.discount}%`}
                value2={disabled ? '' : bill?.priceUsd}
                toolTip={t(`This is the percentage discount relative to the token's current market price.`)}
                showToolTipPrice={parseFloat(bill?.priceUsd) < 0.001}
                flexDirection="column"
              />
            </Flex>
            <ListViewContent
              title={t('Vesting Term')}
              value={vestingTime.days ? `${vestingTime.days} days` : 'NaN'}
              style={{ maxWidth: '105px', height: '40px', flexDirection: 'column' }}
              toolTip={t('This is how long it will take for all tokens in the Bill to fully vest.')}
              toolTipPlacement="bottomLeft"
              toolTipTransform="translate(39%, 0%)"
            />
            <ListViewContent
              title={t('Available Tokens')}
              value={disabled ? '0' : formatNumberSI(parseFloat(displayAvailable), 3)}
              style={{ maxWidth: '125px', height: '40px', flexDirection: 'column' }}
              toolTip={t('This is the amount of available tokens for purchase.')}
              toolTipPlacement="bottomLeft"
              toolTipTransform="translate(50%, 0%)"
            />
            <Flex sx={{ width: '165px', minWidth: '145px' }}>
              {account ? (
                <BillModal
                  bill={bill}
                  buttonText={disabled ? t('SOLD OUT') : t('BUY')}
                  id={bill.index}
                  buyFlag
                  disabled={!bill.discount || bill.discount.includes('NaN') || disabled}
                />
              ) : (
                <Flex sx={{ minWidth: '145px' }}>
                  <UnlockButton sx={{ width: '100%' }} />
                </Flex>
              )}
            </Flex>
          </Flex>
        ),
        expandedContent: isMobile && (
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            {account ? (
              <Flex sx={{ width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Flex
                  sx={{
                    flexWrap: 'wrap',
                    padding: '0 10px 10px 10px',
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <ListViewContent
                    title={'Vesting Term'}
                    value={disabled ? 'N/A' : vestingTime.days ? `${vestingTime.days} days` : 'NaN'}
                    toolTip={`This is how long it will take for all tokens in the Bill to fully vest.`}
                    toolTipPlacement={'bottomLeft'}
                    toolTipTransform={'translate(39%, 0%)'}
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  />
                  <ListViewContent
                    title={'Available Tokens'}
                    value={disabled ? '0' : formatNumberSI(parseFloat(displayAvailable), 2)}
                    toolTip={`This is the amount of available tokens for purchase.`}
                    toolTipPlacement={'bottomLeft'}
                    toolTipTransform={'translate(50%, 0%)'}
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  />
                </Flex>
                <Flex sx={{ width: '240px', justifyContent: 'center' }}>
                  <BillModal
                    bill={bill}
                    buttonText={disabled ? t('SOLD OUT') : t('BUY')}
                    id={bill.index}
                    buyFlag
                    disabled={!bill.discount || bill.discount.includes('NaN') || disabled}
                    buttonSize={'100%'}
                  />
                </Flex>
              </Flex>
            ) : (
              <Flex sx={{ width: '240px', justifyContent: 'center' }}>
                <UnlockButton sx={{ width: '100%' }} />
              </Flex>
            )}
          </Flex>
        ),
      },
    }
  })
  return (
    <>
      {billsListView?.length ? (
        <ListView listViews={billsListView} />
      ) : (
        <EmptyListComponent
          type={
            chainId === ChainId.ARBITRUM
              ? EmptyComponentType.COMING_SOON
              : noResults
              ? EmptyComponentType.NO_RESULTS
              : EmptyComponentType.AVAILABLE_BILLS
          }
        />
      )}
    </>
  )
}

export default React.memo(BillsRows)
