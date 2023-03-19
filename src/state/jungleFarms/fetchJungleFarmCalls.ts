import { JungleFarmConfig } from 'config/constants/types'
import { Call } from 'utils/multicall'

const fetchJungleFarmCalls = (farm: JungleFarmConfig, chainId: number): Call[] => {
  const perSecondCalls = [
    {
      address: farm.contractAddress[chainId],
      name: 'startTime',
    },
    // Get end block
    {
      address: farm.contractAddress[chainId],
      name: 'bonusEndTime',
    },
    {
      address: farm.contractAddress[chainId],
      name: 'totalStaked',
    },
  ]

  // Calls if the jungle farm is a per block
  const perBlockCalls = [
    {
      address: farm.contractAddress[chainId],
      name: 'startBlock',
    },
    // Get end block
    {
      address: farm.contractAddress[chainId],
      name: 'bonusEndBlock',
    },
    {
      address: farm.contractAddress[chainId],
      name: 'totalStaked',
    },
  ]

  return farm?.rewardsPerSecond ? perSecondCalls : perBlockCalls
}

export default fetchJungleFarmCalls
