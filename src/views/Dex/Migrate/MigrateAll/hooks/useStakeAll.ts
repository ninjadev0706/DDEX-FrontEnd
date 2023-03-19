import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { ApeswapWalletLpInterface, MigrateStatus } from '../provider/types'
import { useMigrateAll } from '../provider'
import { useVaults } from 'state/vaults/hooks'
import { useMasterchef, useVaultApeV2 } from 'hooks/useContract'
import { useFarms } from 'state/farms/hooks'
import { calculateGasMargin } from 'utils'
import track from 'utils/track'

const useStakeAll = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const { handleUpdateMigrateLp, migrateMaximizers, handleAddMigrationCompleteLog } = useMigrateAll()
  const masterChefContract = useMasterchef()
  const vaultApeV2Contract = useVaultApeV2()
  const { vaults: fetchedVaults } = useVaults()
  // We need to filter out the innactive vaults
  const vaults = fetchedVaults.filter((vault) => !vault.inactive)
  const farms = useFarms(account)

  const handleStakeAll = useCallback(
    (apeswapWalletLps: ApeswapWalletLpInterface[]) => {
      apeswapWalletLps.map(async ({ pair, balance, id }) => {
        try {
          const { address: lpAddress } = pair.liquidityToken
          // If maximizers is selected we need to check if one exists first. Otherwise approve the farm
          const matchedVault = vaults.find(
            (vault) => vault.stakeToken.address[chainId].toLowerCase() === lpAddress.toLowerCase(),
          )
          const matchedFarm = farms.find((farm) => farm.lpAddresses[chainId].toLowerCase() === lpAddress.toLowerCase())
          // Estimate gas to make sure transactions dont fail
          const gasEstimate =
            migrateMaximizers && matchedVault
              ? vaultApeV2Contract.estimateGas.deposit(matchedVault.pid, balance.raw.toString())
              : masterChefContract.estimateGas.deposit(matchedFarm.pid, balance.raw.toString())
          const call =
            migrateMaximizers && matchedVault
              ? vaultApeV2Contract.deposit(matchedVault.pid, balance.raw.toString(), {
                  gasLimit: calculateGasMargin(await gasEstimate),
                })
              : masterChefContract.deposit(matchedFarm.pid, balance.raw.toString(), {
                  gasLimit: calculateGasMargin(await gasEstimate),
                })
          handleUpdateMigrateLp(id, 'stake', MigrateStatus.PENDING, 'Staking in progress')
          call
            .then((tx) =>
              library
                .waitForTransaction(tx.hash)
                .then(() => {
                  handleUpdateMigrateLp(id, 'stake', MigrateStatus.COMPLETE, 'Stake complete')
                  handleAddMigrationCompleteLog({
                    lpSymbol: `${pair.token0.getSymbol(chainId)} - ${pair.token1.getSymbol(chainId)}`,
                    location: migrateMaximizers && matchedVault ? 'max' : 'farm',
                    stakeAmount: balance.toExact(),
                  })
                  track({
                    event: 'migrate_stake',
                    chain: chainId,
                    data: {
                      cat: migrateMaximizers && matchedVault ? 'max' : 'farm',
                      symbol: matchedFarm.lpSymbol,
                      amount: balance.toExact(),
                    },
                  })
                })
                .catch((e) => handleUpdateMigrateLp(id, 'stake', MigrateStatus.INVALID, e.message)),
            )
            .catch((e) => {
              handleUpdateMigrateLp(id, 'stake', MigrateStatus.INVALID, e.message)
            })
        } catch {
          handleUpdateMigrateLp(id, 'stake', MigrateStatus.INVALID, 'Something went wrong please try refreshing')
        }
      })
    },
    [
      handleUpdateMigrateLp,
      handleAddMigrationCompleteLog,
      chainId,
      masterChefContract,
      vaultApeV2Contract,
      migrateMaximizers,
      farms,
      library,
      vaults,
    ],
  )
  return handleStakeAll
}

export default useStakeAll
