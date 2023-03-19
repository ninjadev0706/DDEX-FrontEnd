/** @jsxImportSource theme-ui */
import React from 'react'
import { Modal, ModalProps } from '@ape.swap/uikit'

import NewsletterModal from './NewsletterModal'
import { useTranslation } from 'contexts/Localization'

import { modalProps } from './styles'

const SubscribeModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  return (
    <Modal zIndex={10} onDismiss={onDismiss} {...modalProps}>
      <NewsletterModal onDismiss={onDismiss} t={t} isNewsModal />
    </Modal>
  )
}

export default SubscribeModal
