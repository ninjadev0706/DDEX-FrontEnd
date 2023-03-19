import { useCallback } from 'react'
import { useVaultApeV2 } from 'hooks/useContract'

const useCompound = () => {
  const vaultApeContractV2 = useVaultApeV2()

  const handleCompound = useCallback(async () => {
    try {
      const txHash = await vaultApeContractV2.earnAll().then((trx) => trx.wait())
      return txHash
    } catch (e) {
      console.error(e)
    }
    return null
  }, [vaultApeContractV2])

  return { onCompound: handleCompound }
}

export default useCompound
