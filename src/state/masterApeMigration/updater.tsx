import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useAppDispatch } from '../index'
import { State } from 'state/types'
import { MigrateStatus, ProductTypes } from './types'
import {
  fetchV1Products,
  fetchV2Products,
  setRemoveTransactions,
  updateAndMergeStatus,
  updateMigrateStatus,
} from './reducer'
import { updateFarmV2UserAllowances, updateFarmV2UserTokenBalances } from 'state/farmsV2'
import { updateFarmUserStakedBalances, updateFarmUserTokenBalances } from 'state/farms'
import { fetchVaultUserDataAsync, updateVaultUserBalance, updateVaultUserStakedBalance } from 'state/vaults'
import { updateVaultV3UserAllowance } from 'state/vaultsV3'
import { delay } from 'lodash'
import track from 'utils/track'

const sentTxHash = []

export default function Updater(): null {
  const { library, chainId, account } = useActiveWeb3React()

  const currentBlock = useBlockNumber()

  const dispatch = useAppDispatch()
  const transactions = useSelector((state: State) => state.masterApeMigration.transactions)

  const migrateMaximizers = useSelector((state: State) => state.masterApeMigration.migrateMaximizers)

  useEffect(() => {
    if (!chainId || !library || !currentBlock || transactions.length === 0) return
    transactions.forEach(
      ({
        hash,
        migrateLpType,
        id,
        migrateLocation,
        v2FarmPid,
        v1FarmPid,
        v1VaultPid,
        v3VaultPid,
        lpAddress,
        type,
        lpValueUsd,
        lpAmount,
        lpSymbol,
      }) => {
        if (sentTxHash.includes(hash)) return
        sentTxHash.push(hash)
        library
          .waitForTransaction(hash)
          .then((receipt) => {
            if (receipt) {
              if (type === 'unstake') {
                dispatch(updateFarmV2UserTokenBalances(chainId, v2FarmPid, account))
                if (migrateLpType === ProductTypes.FARM) {
                  dispatch(updateFarmUserStakedBalances(chainId, v1FarmPid, account))
                  dispatch(updateFarmUserTokenBalances(chainId, v1FarmPid, account))
                  dispatch(fetchV1Products(chainId))
                } else {
                  dispatch(updateVaultUserStakedBalance(account, chainId, v1VaultPid))
                  dispatch(updateVaultUserBalance(account, chainId, v1VaultPid))
                  dispatch(fetchVaultUserDataAsync(account, chainId))
                }
                dispatch(updateAndMergeStatus(chainId, id, lpAddress, type, MigrateStatus.COMPLETE, 'Unstake complete'))
                try {
                  track({
                    event: 'masterApeMigration',
                    chain: chainId,
                    data: {
                      cat: 'Unstake',
                      type: migrateLpType,
                      lpValueUsd,
                      lpAmount: parseFloat(lpAmount),
                      lpSymbol,
                      hash,
                    },
                  })
                } catch {}
              }
              if (type === 'approveStake') {
                v3VaultPid && migrateMaximizers
                  ? dispatch(updateVaultV3UserAllowance(account, chainId, v3VaultPid))
                  : dispatch(updateFarmV2UserAllowances(chainId, v2FarmPid, account))
                dispatch(
                  updateMigrateStatus(
                    id,
                    type,
                    MigrateStatus.COMPLETE,
                    migrateMaximizers && v3VaultPid ? 'Vault approval complete' : 'Farm approval complete',
                  ),
                )
                try {
                  track({
                    event: 'masterApeMigration',
                    chain: chainId,
                    data: {
                      cat: migrateMaximizers && v3VaultPid ? 'Vault approval' : 'Farm approval',
                      lpSymbol,
                      hash,
                    },
                  })
                } catch {}
              }
              if (type === 'stake') {
                dispatch(updateMigrateStatus(id, type, MigrateStatus.COMPLETE, 'Stake complete'))
                dispatch(updateFarmV2UserTokenBalances(chainId, v2FarmPid, account))
                try {
                  track({
                    event: 'masterApeMigration',
                    chain: chainId,
                    data: {
                      cat: `Stake ${migrateLocation} Complete`,
                      lpValueUsd,
                      lpAmount: parseFloat(lpAmount),
                      lpSymbol,
                      hash,
                    },
                  })
                } catch {}
              }
              dispatch(setRemoveTransactions(id))
              delay(() => {
                dispatch(fetchV2Products(chainId))
                dispatch(fetchV1Products(chainId))
              }, 1000)
            } else {
              dispatch(updateMigrateStatus(id, type, MigrateStatus.INVALID, 'Something went wrong'))
              dispatch(setRemoveTransactions(id))
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      },
    )
  }, [chainId, library, account, transactions, currentBlock, migrateMaximizers, dispatch])

  return null
}
