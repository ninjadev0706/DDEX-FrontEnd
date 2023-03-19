import React from 'react'
import { useModal } from '@apeswapfinance/uikit'
import { useProfile } from 'state/hooks'
import useListNfa from 'hooks/useListNfa'
import { useTranslation } from 'contexts/Localization'
import NfaListingModal from '../NfaListingModal'
import { Button } from '@ape.swap/uikit'

const ListYourNfa: React.FC = () => {
  const { profile } = useProfile()
  const { onListNfa } = useListNfa()
  const { t } = useTranslation()
  const [onPresentNfaListingModal] = useModal(
    <NfaListingModal
      ownedNfas={profile?.ownedNfts}
      onConfirm={async (nfaIndex, auctionLength, timeToExtendVal, minTimeToExtend, minimumBid) => {
        await onListNfa(nfaIndex, auctionLength, timeToExtendVal, minTimeToExtend, minimumBid)
      }}
    />,
  )

  return (
    <Button size="sm" onClick={onPresentNfaListingModal} style={{ height: '36px' }}>
      {t('LIST YOUR NFA')}
    </Button>
  )
}

export default ListYourNfa
