/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@ape.swap/uikit'
import { dexStyles } from '../../styles'
import { MigrateProvider } from './provider'
import { usePollVaultUserData } from 'state/vaults/hooks'
import MigrateStart from './MigrateStart'
import { ChainId } from '@ape.swap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const MigrateAll: React.FC = () => {
  // Fetch farms to filter lps on steps
  const { chainId } = useActiveWeb3React()
  usePollVaultUserData()
  return (
    <Flex sx={dexStyles.pageContainer}>
      <Flex sx={{ flexDirection: 'column', width: '1200px' }}>
        {chainId === ChainId.BSC && (
          <MigrateProvider>
            <MigrateStart />
          </MigrateProvider>
        )}
      </Flex>
    </Flex>
  )
}

export default MigrateAll
