/** @jsxImportSource theme-ui */
import { Button } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMasterchef } from 'hooks/useContract'
import React, { useState } from 'react'
import { useAppDispatch } from 'state'
import { updateFarmUserStakedBalances, updateFarmUserTokenBalances } from 'state/farms'
import { updateFarmV2UserTokenBalances } from 'state/farmsV2'
import { unstake } from 'utils/callHelpers'

const Unstake = ({ pid, rawTokenAmount, farmV2Pid }: { pid: number; rawTokenAmount: string; farmV2Pid: number }) => {
  const [txPending, setTxPending] = useState(false)
  const { chainId, account } = useActiveWeb3React()
  const masterChef = useMasterchef()
  const dispatch = useAppDispatch()

  return (
    <Button
      fullWidth
      disabled={txPending}
      load={txPending}
      onClick={() => {
        setTxPending(true)
        unstake(masterChef, pid, rawTokenAmount)
          .then(() => {
            setTxPending(false)
            dispatch(updateFarmV2UserTokenBalances(chainId, farmV2Pid, account))
            dispatch(updateFarmUserStakedBalances(chainId, pid, account))
            dispatch(updateFarmUserTokenBalances(chainId, pid, account))
          })
          .catch(() => {
            setTxPending(false)
          })
      }}
    >
      Withdraw
    </Button>
  )
}

export default Unstake
