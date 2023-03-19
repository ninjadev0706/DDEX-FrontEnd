export const MIGRATION_STEPS: { title: string; description: string }[] = [
  {
    title: 'UNSTAKE',
    description: 'Unstake all tokens from the MasterApe v1 smart contracts',
  },
  { title: 'APPROVE', description: 'Approve the MasterApe v2 smart contracts' },
  { title: 'STAKE', description: 'Stake all tokens using the MasterApe v2 smart contracts' },
]
