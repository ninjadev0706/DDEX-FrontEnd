/** @jsxImportSource theme-ui */
import React from 'react'
import ApproveStake from './ApproveStake'
import Stake from './Stake'
import Unstake from './Unstake'
import BigNumber from 'bignumber.js'
import { useActiveIndex, useMergedV1Products, useMergedV2Products } from 'state/masterApeMigration/hooks'
import { ProductTypes } from 'state/masterApeMigration/types'

const Steps = ({ allStepsComplete }: { allStepsComplete: boolean }) => {
  const activeIndex = useActiveIndex()
  const v1Products = useMergedV1Products()
  const v2Products = useMergedV2Products()

  const filteredV1StakedProducts = v1Products.filter(({ stakedAmount }) => new BigNumber(stakedAmount).gt(0))
  // Filter out dust left in vaults
  const filterV1Dust = filteredV1StakedProducts.flatMap((product) => {
    if (product.type === ProductTypes.VAULT || product.type === ProductTypes.VAULT_V1) {
      if (product.singleStakeAsset && new BigNumber(product.stakedAmount).gt(0.5)) {
        return product
      } else if (
        !product.singleStakeAsset &&
        new BigNumber(parseFloat(product.stakedAmount) * product.lpValueUsd).gt(0.25)
      ) {
        return product
      } else {
        return []
      }
    } else {
      return product
    }
  })

  const stepList = [
    <Unstake migrateList={filterV1Dust} key="unstake" />,
    <ApproveStake apeswapWalletLps={v2Products} key="approveStake" />,
    <Stake apeswapWalletLps={v2Products} key="stake" allStepsComplete={allStepsComplete} />,
  ]
  return stepList[activeIndex]
}

export default Steps
