import { useCallback } from 'react'
import { useVaultApeV1, useVaultApeV2, useVaultApeV3 } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { vaultUnstakeV1, vaultUnstakeV2, vaultUnstakeAll } from 'utils/callHelpers'
import track from 'utils/track'
import { VaultVersion } from 'config/constants/types'

export const useVaultUnstake = (pid: number, version: VaultVersion) => {
  const { chainId } = useActiveWeb3React()
  const vaultApeContractV1 = useVaultApeV1()
  const vaultApeContractV2 = useVaultApeV2()
  const vaultApeContractV3 = useVaultApeV3()

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        const trxHash =
          version === VaultVersion.V1
            ? await vaultUnstakeV1(vaultApeContractV1, pid, amount)
            : version === VaultVersion.V2
            ? await vaultUnstakeV2(vaultApeContractV2, pid, amount)
            : await vaultUnstakeV2(vaultApeContractV3, pid, amount)
        track({
          event: 'vault',
          chain: chainId,
          data: {
            cat: 'unstake',
            amount,
            pid,
          },
        })
        console.info(trxHash)
        return trxHash
      } catch (e) {
        console.error(e)
      }
      return null
    },
    [vaultApeContractV1, pid, version, vaultApeContractV3, vaultApeContractV2, chainId],
  )
  return { onUnstake: handleUnstake }
}

export const useVaultUnstakeAll = (pid: number) => {
  const { chainId } = useActiveWeb3React()
  const vaultApeContractV1 = useVaultApeV1()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const trxHash = await vaultUnstakeAll(vaultApeContractV1, pid)
      track({
        event: 'vault',
        chain: chainId,
        data: {
          cat: 'unstakeAll',
          amount,
          pid,
        },
      })
      console.info(trxHash)
      return trxHash
    },
    [vaultApeContractV1, chainId, pid],
  )

  return { onUnstakeAll: handleUnstake }
}
