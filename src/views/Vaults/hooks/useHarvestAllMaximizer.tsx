import { useCallback } from 'react'
import { useVaultApeV3 } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { harvestMaximizer } from 'utils/callHelpers'
import track from 'utils/track'

const useHarvestAllMaximizer = (pids: number[]) => {
  const { chainId } = useActiveWeb3React()
  const vaultApeContractV3 = useVaultApeV3()

  const handleHarvestAll = useCallback(async () => {
    try {
      const harvestPromises = pids.map((pid) => {
        return harvestMaximizer(vaultApeContractV3, pid)
      })

      track({
        event: 'vault',
        chain: chainId,
        data: {
          cat: 'harvestAll',
        },
      })
      return Promise.all(harvestPromises)
    } catch (e) {
      console.error(e)
    }
    return null
  }, [vaultApeContractV3, pids, chainId])

  return { onHarvestAll: handleHarvestAll }
}

export default useHarvestAllMaximizer
