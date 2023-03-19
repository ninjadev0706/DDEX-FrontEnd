import { useCallback } from 'react'
import { useVaultApeV1, useVaultApeV2, useVaultApeV3 } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { stakeVaultV1, stakeVaultV2 } from 'utils/callHelpers'
import track from 'utils/track'
import { VaultVersion } from 'config/constants/types'

export const useVaultStake = (pid: number, version: VaultVersion, lpValue: number) => {
  const { chainId } = useActiveWeb3React()
  const vaultApeContractV1 = useVaultApeV1()
  const vaultApeContractV2 = useVaultApeV2()
  const vaultApeContractV3 = useVaultApeV3()

  const handleStake = useCallback(
    async (amount: string) => {
      try {
        const trxHash =
          version === VaultVersion.V1
            ? await stakeVaultV1(vaultApeContractV1, pid, amount)
            : version === VaultVersion.V2
            ? await stakeVaultV2(vaultApeContractV2, pid, amount)
            : await stakeVaultV2(vaultApeContractV3, pid, amount)
        track({
          event: 'vault',
          chain: chainId,
          data: {
            cat: 'stake',
            amount,
            pid,
            usdAmount: parseFloat(amount) * lpValue,
          },
        })
        console.info(trxHash)
        return trxHash
      } catch (e) {
        console.error(e)
      }
      return null
    },
    [vaultApeContractV1, vaultApeContractV2, vaultApeContractV3, version, pid, lpValue, chainId],
  )

  return { onStake: handleStake }
}
