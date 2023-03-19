import { ApiResponse, Bill, Chain, Iao } from '../types'

export type Vested = (Bill | Iao) & { chain: Chain }

export function rawToVested({ userStats }: ApiResponse) {
  const vestedEarnings: Vested[] = []

  userStats.forEach(({ bills, iaos, chainId }) => {
    bills?.forEach((bill) => bill.earnedBalance > 0 && vestedEarnings.push({ ...bill, chain: chainId }))
    iaos?.forEach((iao) => iao.earnedBalance > 0 && vestedEarnings.push({ ...iao, chain: chainId }))
  })

  return vestedEarnings.sort((a, b) => (a.vestingTimeRemaining > b.vestingTimeRemaining ? -1 : 1))
}
