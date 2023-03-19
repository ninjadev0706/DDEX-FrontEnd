/** @jsxImportSource theme-ui */
import React from 'react'
import { Select, SelectItem, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Option } from './types'

interface FilterSelectProps {
  selectedOption: string
  setOption: (option: string) => void
  options: Option[]
}

const MenuSelect: React.FC<FilterSelectProps> = ({ selectedOption, setOption, options }) => {
  const { t } = useTranslation()
  return (
    <Select
      size="xsm"
      onChange={(e) => setOption(e.target.value)}
      active={selectedOption}
      sx={{
        height: '36px',
        display: 'flex',
        width: '100%',
        paddingRight: '4px',
      }}
    >
      {options?.map((option) => {
        return (
          <SelectItem size="xsm" value={option.value} key={option.label}>
            <Text>{t(option.label)}</Text>
          </SelectItem>
        )
      })}
    </Select>
  )
}

export default MenuSelect
