import { Erc20 } from 'config/abi/types'
import { Contract, ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useCallback } from 'react'
import { MigrateResult } from 'state/zapMigrator/hooks'
import { getProviderOrSigner } from 'utils'
import { MigrateStatus } from '../provider/types'
import { useMigrateAll } from '../provider'
import { ZAP_ADDRESS } from '@ape.swap/sdk'
import track from 'utils/track'

const useMigrateApproveAll = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const { handleUpdateMigrateLp } = useMigrateAll()

  const handleApproveAll = useCallback(
    (migrateLps: MigrateResult[]) => {
      migrateLps.map(async (migrateLp) => {
        try {
          const { lpAddress, id, smartRouter, token0, token1 } = migrateLp
          const lpContract = new Contract(lpAddress, IUniswapV2PairABI, getProviderOrSigner(library, account)) as Erc20
          handleUpdateMigrateLp(id, 'approveMigrate', MigrateStatus.PENDING, 'Migrate approval in progress')
          lpContract
            .approve(ZAP_ADDRESS[chainId], ethers.constants.MaxUint256)
            .then((tx) =>
              library
                .waitForTransaction(tx.hash)
                .then(() => {
                  handleUpdateMigrateLp(id, 'approveMigrate', MigrateStatus.COMPLETE, 'Migrate approval complete')
                  track({
                    event: 'migrate_approve',
                    chain: chainId,
                    data: {
                      cat: smartRouter,
                      token1: token0.symbol,
                      token2: token1.symbol,
                    },
                  })
                })
                .catch((e) => handleUpdateMigrateLp(id, 'approveMigrate', MigrateStatus.INVALID, e.message)),
            )
            .catch((e) => {
              handleUpdateMigrateLp(id, 'approveMigrate', MigrateStatus.INVALID, e.message)
            })
        } catch {
          handleUpdateMigrateLp(
            migrateLp.id,
            'approveMigrate',
            MigrateStatus.INVALID,
            'Something went wrong please try refreshing',
          )
        }
      })
    },
    [account, handleUpdateMigrateLp, library, chainId],
  )
  return handleApproveAll
}

export default useMigrateApproveAll
