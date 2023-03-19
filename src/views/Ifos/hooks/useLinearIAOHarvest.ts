import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import track from 'utils/track'
import { Contract } from 'ethers'

const useLinearIAOHarvest = (contract: Contract, setPendingTx: (f: boolean) => unknown, tokenValue: number) => {
  const { chainId } = useActiveWeb3React()

  const handleClaim = useCallback(
    async (amount) => {
      try {
        setPendingTx(true)
        const tx = await contract.harvest()
        await tx.wait()

        track({
          event: 'iao',
          chain: chainId,
          data: {
            cat: 'claim',
            amount,
            contract: contract.address,
            usdAmount: parseFloat(amount) * tokenValue,
          },
        })
      } catch (e) {
        console.error('Claim error', e)
      }

      setPendingTx(false)
    },
    [setPendingTx, contract, chainId, tokenValue],
  )

  return handleClaim
}

export default useLinearIAOHarvest
