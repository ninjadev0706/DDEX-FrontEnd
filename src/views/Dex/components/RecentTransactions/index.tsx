/** @jsxImportSource theme-ui */
import { AutoRenewIcon, BlockIcon, Flex, Text, CheckmarkCircleIcon, Svg } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { orderBy } from 'lodash'
import React from 'react'
import { useAppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { Grid } from 'theme-ui'
import { getEtherscanLink } from 'utils'
import { dexStyles, textUnderlineHover } from 'views/Dex/styles'

const renderIcon = (tx: TransactionDetails) => {
  if (!tx.receipt) {
    return <AutoRenewIcon spin width="20px" />
  }

  return tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined' ? (
    <CheckmarkCircleIcon color="success" width="20px" />
  ) : (
    <BlockIcon color="error" width="20px" />
  )
}

const RecentTransactions: React.FC = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const allTransactions = useAllTransactions()
  const sortedTransactions = orderBy(Object.values(allTransactions).filter(isTransactionRecent), 'addedTime', 'desc')
  const { t } = useTranslation()

  const handleClearAll = () => {
    if (chainId) {
      dispatch(clearAllTransactions({ chainId }))
    }
  }
  return (
    <Flex sx={{ ...dexStyles.dexContainer, marginTop: '10px' }}>
      <Flex sx={{ maxWidth: '100%', width: '420px' }} />
      {sortedTransactions.length > 0 ? (
        sortedTransactions.map((tx) => {
          return (
            <Grid columns=".2fr 2fr 0fr" sx={{ width: '100%', alignItems: 'center', margin: '2px 0px' }} key={tx.hash}>
              {renderIcon(tx)}
              <Text size="12px" weight={600}>
                {tx.summary ?? tx.hash}
              </Text>
              <a href={getEtherscanLink(tx.hash, 'transaction', chainId)} target="_blank" rel="noopener noreferrer">
                <Svg icon="external" width="12px" />
              </a>
            </Grid>
          )
        })
      ) : (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Text>{t('No recent transactions')}</Text>
        </Flex>
      )}
      {sortedTransactions.length > 0 && (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
          <Text
            size="12px"
            weight={700}
            sx={{ position: 'relative', cursor: 'pointer', ...textUnderlineHover }}
            onClick={handleClearAll}
          >
            {t('Clear all')}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default React.memo(RecentTransactions)
