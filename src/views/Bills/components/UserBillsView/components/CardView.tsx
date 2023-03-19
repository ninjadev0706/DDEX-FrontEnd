import { Flex, Skeleton } from '@apeswapfinance/uikit'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Claim from '../../Actions/Claim'
import { BillCardsContainer, CardContainer } from '../styles'
import BillModal from '../../Modals'
import { BillsToRender } from '../types'
import ListViewContentMobile from 'components/ListViewV2/ListViewContent'
import { formatNumberSI } from 'utils/formatNumber'

const CardView: React.FC<{ billsToRender: BillsToRender[] }> = ({ billsToRender }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const billsCardView = billsToRender.map((billToRender, i) => {
    const { bill, filteredOwnedBillNftData } = billToRender
    const claimable = getBalanceNumber(new BigNumber(billToRender.pendingRewards), bill?.earnToken?.decimals[chainId])
    return (
      <CardContainer key={i}>
        {filteredOwnedBillNftData?.image ? (
          <BillModal
            bill={bill}
            billId={billToRender.id}
            billCardImage={`${filteredOwnedBillNftData?.image + '?img-width=720'}`}
          />
        ) : (
          <Skeleton width="270px" height="159px" />
        )}
        <Flex
          padding="0px 15px"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: '75px', width: '100%' }}
        >
          <ListViewContentMobile
            tag="ape"
            value={bill.lpToken.symbol}
            style={{ height: '35px', width: '130px', flexDirection: 'column' }}
          />
          <ListViewContentMobile
            title={t('Claimable')}
            value={formatNumberSI(parseFloat(claimable.toFixed(0)), 3)}
            value2={`($${(claimable * billToRender?.bill?.earnTokenPrice).toFixed(2)})`}
            value2Secondary
            style={{ height: '35px', width: '60px', alignItems: 'flex-end', flexDirection: 'column' }}
          />
        </Flex>
        <Claim
          billAddress={bill.contractAddress[chainId]}
          billIds={[billToRender.id]}
          pendingRewards={billToRender?.pendingRewards}
          margin={'0 20px 20px 20px'}
        />
      </CardContainer>
    )
  })

  return <BillCardsContainer>{billsCardView}</BillCardsContainer>
}

export default React.memo(CardView)
