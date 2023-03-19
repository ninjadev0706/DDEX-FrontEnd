/** @jsxImportSource theme-ui */
import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, AutoRenewIcon, Text, Flex } from '@ape.swap/uikit'
import ModalInput from 'components/ModalInput'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface WithdrawModalProps {
  max: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  title: string
  withdrawFee?: string
}

const modalProps = {
  sx: {
    zIndex: 11,
    maxHeight: 'calc(100% - 30px)',
    minWidth: ['90%', '400px'],
    width: '200px',
    maxWidth: '425px',
  },
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, title, withdrawFee }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(max))
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={title} onDismiss={onDismiss} {...modalProps}>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        inputTitle={t('Unstake')}
      />
      {withdrawFee && (
        <Flex sx={{ padding: '20px 0 10px 0', justifyContent: 'center' }}>
          <Text>{t(`Withdrawing will have a %withdrawFee%% fee`, { withdrawFee })}</Text>
        </Flex>
      )}
      <Button
        disabled={pendingTx || parseFloat(fullBalance) < parseFloat(val)}
        onClick={async () => {
          setPendingTx(true)
          try {
            await onConfirm(val)
            onDismiss()
          } catch (e) {
            console.error('Transaction Failed')
          } finally {
            setPendingTx(false)
          }
        }}
        fullWidth
        endIcon={pendingTx && <AutoRenewIcon spin color="currentColor" />}
        style={{
          borderRadius: '10px',
          marginTop: '10px',
        }}
      >
        {pendingTx ? t('Pending Confirmation') : t('Confirm')}
      </Button>
    </Modal>
  )
}

export default React.memo(WithdrawModal)
