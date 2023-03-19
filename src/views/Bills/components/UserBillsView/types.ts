import { TranslateFunction } from 'contexts/Localization'
import { Bills, UserBill, UserBillNft } from 'state/types'

export interface PLProps {
  website: string
  twitter: string
  t: TranslateFunction
  isMobile?: boolean
}

export interface BillsToRender extends UserBill {
  filteredOwnedBillNftData: UserBillNft
  bill: Bills
}

export type Option = {
  label: string
  value: string
}

export const FILTER_OPTIONS: Option[] = [
  {
    label: 'Filter',
    value: 'filter',
  },
  {
    label: 'ApeSwap',
    value: 'bananaBill',
  },
  {
    label: 'Partner',
    value: 'jungleBill',
  },
]

export const SORT_OPTIONS: Option[] = [
  {
    label: 'Sort',
    value: 'sort',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Claimable',
    value: 'claimable',
  },
  {
    label: 'Fully Vested',
    value: 'vested',
  },
]
