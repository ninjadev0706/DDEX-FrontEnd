/** @jsxImportSource theme-ui */
import React from 'react'
import { Container } from './styles'
import { TabNav } from 'components/TabNav'
import { useBills } from 'state/bills/hooks'

interface BillsNavProps {
  billsView: string
  setBillsView: (newBillsView: string) => void
}

const BillsNav: React.FC<BillsNavProps> = ({ billsView, setBillsView }) => {
  const bills = useBills()
  const ownedBillsAmount = bills?.flatMap((bill) => {
    return bill?.userOwnedBillsData ? bill?.userOwnedBillsData : []
  }).length
  return (
    <Container>
      <TabNav
        tabOptions={['Available Bills', 'Your Bills']}
        activeTab={billsView}
        onChangeActiveTab={setBillsView}
        ownedBillsAmount={ownedBillsAmount ? ownedBillsAmount : 0}
      />
    </Container>
  )
}

export default React.memo(BillsNav)
