/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@ape.swap/uikit'

const ListViewLayout = ({ children }: { children: React.ReactElement | React.ReactElement[] }) => {
  return (
    <Flex
      sx={{
        position: 'relative',
        flexDirection: 'column',
        alignSelf: 'center',
        minWidth: '300px',
        width: '100%',
        padding: '0px 10px',
        maxWidth: ['500px', '500px', '1150px'],
      }}
    >
      {children}
    </Flex>
  )
}

export default ListViewLayout
