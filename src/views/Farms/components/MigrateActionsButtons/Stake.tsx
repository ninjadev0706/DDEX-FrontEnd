/** @jsxImportSource theme-ui */
import { Button } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMasterChefV2Contract } from 'hooks/useContract'
import React, { useState } from 'react'
import { useAppDispatch } from 'state'
import { updateFarmV2UserStakedBalances, updateFarmV2UserTokenBalances } from 'state/farmsV2'
import { stakeMasterChefV2 } from 'utils/callHelpers'

const Stake = ({ pid, rawTokenBalance }: { pid: number; rawTokenBalance: string }) => {
  const [txPending, setTxPending] = useState(false)
  const { chainId, account } = useActiveWeb3React()
  const masterChefV2 = useMasterChefV2Contract()
  const dispatch = useAppDispatch()
  return (
    <Button
      fullWidth
      disabled={txPending}
      load={txPending}
      onClick={() => {
        setTxPending(true)
        stakeMasterChefV2(masterChefV2, pid, rawTokenBalance)
          .then(() => {
            setTxPending(false)
            dispatch(updateFarmV2UserStakedBalances(chainId, pid, account))
            dispatch(updateFarmV2UserTokenBalances(chainId, pid, account))
          })
          .catch(() => {
            setTxPending(false)
          })
      }}
    >
      Deposit
    </Button>
  )
}

export default Stake
