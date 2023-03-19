import { Masterchef, VaultApeV1, VaultApeV2 } from 'config/abi/types'
import { Contract } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import masterChefAbi from 'config/abi/masterchef.json'
import vaultApeV1Abi from 'config/abi/vaultApeV1.json'
import vaultApeV2Abi from 'config/abi/vaultApeV2.json'
import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { unstakeWithoutWait } from 'utils/callHelpers'
import { useMasterChefAddress, useVaultApeAddressV1, useVaultApeAddressV2 } from 'hooks/useAddress'
import { useAppDispatch } from 'state'
import { useFarmsV2 } from 'state/farmsV2/hooks'
import {
  MasterApeProductsInterface,
  MigrateStatus,
  MigrateTransaction,
  ProductTypes,
} from 'state/masterApeMigration/types'
import { setAddTransactions, updateMigrateStatus } from 'state/masterApeMigration/reducer'
import useIsMobile from 'hooks/useIsMobile'
import { delay } from 'lodash'

const useUnstakeAll = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const walletIsMetamask = library?.connection?.url === 'metamask'
  const isMobile = useIsMobile()
  const masterChefV1Address = useMasterChefAddress()
  const vaultV2Address = useVaultApeAddressV2()
  const vaultV1Address = useVaultApeAddressV1()
  const v2Farms = useFarmsV2(null)
  const dispatch = useAppDispatch()

  const handleUnstake = useCallback(
    (migrateLps: MasterApeProductsInterface[]) => {
      if (migrateLps.length === 0 || undefined) return
      const migrateLp = migrateLps[0]
      // Get the corresponding farm pid
      const v2FarmPid = v2Farms.find(({ lpAddresses }) => migrateLp.lp === lpAddresses[chainId].toLowerCase())?.pid
      try {
        const { pid, stakedAmount, id, type, lp, lpValueUsd, token0, token1, singleStakeAsset } = migrateLp
        // Define contracts in the callback to avoid a new contract being initalized every render
        const masterApeV1Contract = new Contract(
          masterChefV1Address,
          masterChefAbi,
          getProviderOrSigner(library, account),
        ) as Masterchef
        const vaultV1Contract = new Contract(
          vaultV1Address,
          vaultApeV1Abi,
          getProviderOrSigner(library, account),
        ) as VaultApeV1
        const vaultV2Contract = new Contract(
          vaultV2Address,
          vaultApeV2Abi,
          getProviderOrSigner(library, account),
        ) as VaultApeV2

        const contractCall =
          type === ProductTypes.FARM
            ? unstakeWithoutWait(masterApeV1Contract, pid, stakedAmount)
            : type === ProductTypes.VAULT_V1
            ? vaultV1Contract.withdrawAll(pid)
            : vaultV2Contract.withdrawAll(pid)
        dispatch(updateMigrateStatus(migrateLp.id, 'unstake', MigrateStatus.PENDING, 'Unstake Pending'))
        contractCall
          .then((tx) => {
            const transaction: MigrateTransaction = {
              hash: tx.hash,
              id,
              type: 'unstake',
              migrateLpType: type,
              lpAddress: lp,
              v1FarmPid: pid,
              v2FarmPid,
              v1VaultPid: pid,
              lpValueUsd,
              lpSymbol: singleStakeAsset ? token0?.symbol : `${token0?.symbol} - ${token1?.symbol}`,
              lpAmount: stakedAmount,
            }
            dispatch(setAddTransactions(transaction))
            if (!walletIsMetamask || isMobile) {
              delay(() => {
                return handleUnstake(migrateLps.slice(1, migrateLps.length))
              }, 2000)
            }
          })
          .catch((e) => {
            dispatch(
              updateMigrateStatus(
                id,
                'unstake',
                MigrateStatus.INVALID,
                e.message === 'MetaMask Tx Signature: User denied transaction signature.'
                  ? 'Transaction rejected in wallet'
                  : e.message,
              ),
            )
            if (!walletIsMetamask || isMobile) {
              delay(() => {
                return handleUnstake(migrateLps.slice(1, migrateLps.length))
              }, 2000)
            }
          })
        if (walletIsMetamask && !isMobile) {
          return handleUnstake(migrateLps.slice(1, migrateLps.length))
        }
      } catch {
        dispatch(
          updateMigrateStatus(
            migrateLp.id,
            'unstake',
            MigrateStatus.INVALID,
            'Something went wrong please try refreshing',
          ),
        )
      }
    },
    [
      account,
      dispatch,
      walletIsMetamask,
      masterChefV1Address,
      vaultV2Address,
      vaultV1Address,
      library,
      chainId,
      v2Farms,
      isMobile,
    ],
  )

  return handleUnstake
}

export default useUnstakeAll
