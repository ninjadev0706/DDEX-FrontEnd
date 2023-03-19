import { useCallback } from 'react'
import { useVaultApeV3 } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { harvestMaximizer } from 'utils/callHelpers'
import track from 'utils/track'

const useHarvestMaximizer = (pid: number) => {
  const { chainId } = useActiveWeb3React()
  const vaultApeContractV3 = useVaultApeV3()

  const handleHarvest = useCallback(async () => {
    try {
      const txHash = await harvestMaximizer(vaultApeContractV3, pid)
      track({
        event: 'vault',
        chain: chainId,
        data: {
          cat: 'harvest',
          pid,
        },
      })
      console.info(txHash)
      return txHash
    } catch (e) {
      console.error(e)
    }
    return null
  }, [vaultApeContractV3, pid, chainId])

  return { onHarvest: handleHarvest }
}

export default useHarvestMaximizer
