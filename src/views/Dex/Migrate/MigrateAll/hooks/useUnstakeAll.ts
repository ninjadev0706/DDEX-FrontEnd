import { Masterchef } from 'config/abi/types'
import { Contract } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import masterChefAbi from 'config/abi/masterchef.json'
import { useCallback } from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { getProviderOrSigner } from 'utils'
import { unstake } from 'utils/callHelpers'
import { MigrateStatus } from '../provider/types'
import { useMigrateAll } from '../provider'
import track from 'utils/track'

const useUnstakeAll = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const { handleUpdateMigrateLp, handleUpdateMigratorResults } = useMigrateAll()
  const handleUnstakeAll = useCallback(
    (migrateLps: MigrateResult[]) => {
      migrateLps.map(async (migrateLp) => {
        try {
          const { pid, chefAddress, stakedBalance, id, smartRouter, token0, token1 } = migrateLp
          const masterChefContract = new Contract(
            chefAddress,
            masterChefAbi,
            getProviderOrSigner(library, account),
          ) as Masterchef
          handleUpdateMigrateLp(id, 'unstake', MigrateStatus.PENDING, 'Unstake in progress')
          unstake(masterChefContract, pid, stakedBalance)
            .then((tx) =>
              library
                .waitForTransaction(tx.transactionHash)
                .then(() => {
                  handleUpdateMigratorResults()
                  handleUpdateMigrateLp(id, 'unstake', MigrateStatus.COMPLETE, 'Unstake complete')
                  track({
                    event: 'migrate_unstake',
                    chain: chainId,
                    data: {
                      cat: smartRouter,
                      token1: token0.symbol,
                      token2: token1.symbol,
                      amount: stakedBalance,
                    },
                  })
                })
                .catch((e) => handleUpdateMigrateLp(id, 'unstake', MigrateStatus.INVALID, e.message)),
            )
            .catch((e) => {
              handleUpdateMigrateLp(id, 'unstake', MigrateStatus.INVALID, e.message)
            })
        } catch {
          handleUpdateMigrateLp(
            migrateLp.id,
            'unstake',
            MigrateStatus.INVALID,
            'Something went wrong please try refreshing',
          )
        }
      })
    },
    [account, handleUpdateMigrateLp, handleUpdateMigratorResults, library, chainId],
  )
  return handleUnstakeAll
}

export default useUnstakeAll
