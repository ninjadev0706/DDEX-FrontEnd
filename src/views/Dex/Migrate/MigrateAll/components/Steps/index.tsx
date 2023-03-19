/** @jsxImportSource theme-ui */
import React from 'react'
import { useMigrateAll } from '../../provider'
import ApproveStake from './ApproveStake'
import ApproveMigrate from './ApproveMigrate'
import Migrate from './Migrate'
import Stake from './Stake'
import Unstake from './Unstake'
import { useFarms } from 'state/farms/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const Steps: React.FC = () => {
  const { chainId } = useActiveWeb3React()
  const { activeIndex, migrateStakeLps, migrateWalletLps, apeswapWalletLps } = useMigrateAll()
  const farms = useFarms(null)
  const filteredApeLps = apeswapWalletLps.filter(({ pair }) =>
    farms.find((farm) => pair.liquidityToken.address.toLowerCase() === farm.lpAddresses[chainId].toLowerCase()),
  )

  const stepList = [
    <Unstake migrateList={migrateStakeLps} key="unstake" />,
    <ApproveMigrate migrateList={migrateWalletLps} key="approveMigrate" />,
    <Migrate migrateList={migrateWalletLps} apeswapWalletLps={filteredApeLps} key="migrate" />,
    <ApproveStake apeswapWalletLps={filteredApeLps} key="approveStake" />,
    <Stake apeswapWalletLps={filteredApeLps} key="stake" />,
  ]
  return stepList[activeIndex]
}

export default React.memo(Steps)
