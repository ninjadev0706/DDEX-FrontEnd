import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useERC20 } from 'hooks/useContract'
import { useVaultApeAddressV1, useVaultApeAddressV2, useVaultApeAddressV3 } from 'hooks/useAddress'
import { VaultVersion } from 'config/constants/types'

// Approve a vault
const useApproveVault = (stakeTokenAddress: string, version: VaultVersion) => {
  const vaultApeAddressV1 = useVaultApeAddressV1()
  const vaultApeAddressV2 = useVaultApeAddressV2()
  const vaultApeAddressV3 = useVaultApeAddressV3()
  const tokenContract = useERC20(stakeTokenAddress)
  const handleApprove = useCallback(async () => {
    const tx = await tokenContract
      .approve(
        version === VaultVersion.V1
          ? vaultApeAddressV1
          : version === VaultVersion.V2
          ? vaultApeAddressV2
          : vaultApeAddressV3,
        ethers.constants.MaxUint256,
      )
      .then((trx) => trx.wait())
    return tx
  }, [vaultApeAddressV1, version, vaultApeAddressV2, vaultApeAddressV3, tokenContract])
  return { onApprove: handleApprove }
}

export default useApproveVault
