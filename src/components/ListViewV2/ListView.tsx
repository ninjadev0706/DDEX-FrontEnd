/** @jsxImportSource theme-ui */
import React from 'react'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { styles } from './styles'
import ListCard from './ListCard'
import { ListViewProps } from './types'
import { Flex } from '@ape.swap/uikit'

const ListView: React.FC<{ listViews: ListViewProps[] }> = ({ listViews }) => {
  return (
    <Flex sx={styles.listViewContainer}>
      {listViews.map((view: ListViewProps) => {
        return (
          <ListCard
            key={view.listProps.id}
            serviceTokenDisplay={
              <ServiceTokenDisplay {...view.tokenDisplayProps} dualEarn={view.tokenDisplayProps?.token4 != null} />
            }
            {...view.listProps}
          />
        )
      })}
    </Flex>
  )
}

export default React.memo(ListView)
