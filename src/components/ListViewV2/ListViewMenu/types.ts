import React from 'react'

export interface ListMenuProps {
  onHandleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  setFilterOption?: (value: string) => void
  filterOption?: string
  setSortOption?: (value: string) => void
  sortOption?: string
  query: string
  checkboxLabel: string
  showOnlyCheckbox: boolean
  setShowOnlyCheckbox: (value: boolean) => void
  toogleLabels: string[]
  filterOptions?: Option[]
  sortOptions?: Option[]
  actionButton?: React.ReactNode
  showMonkeyImage?: boolean
}

export type Option = {
  label: string
  value: string
}
