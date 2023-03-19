/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { CloseIcon, Flex, Newsletter } from '@ape.swap/uikit'
import { internalStyles } from './styles'
import { mailChimpUrl } from 'config/constants'
import { NewsModalProps } from './types'

const NewsletterModal: React.FC<NewsModalProps> = ({ onDismiss, isNewsModal, t }) => {
  return (
    <Flex className="newsletter-modal-con">
      <CloseIcon width={22} onClick={onDismiss} sx={{ cursor: 'pointer', position: 'absolute', right: '20px' }} />
      <Flex sx={internalStyles.modalBody}>
        <Box sx={internalStyles.showApe} />
        <Newsletter mailChimpUrl={mailChimpUrl} t={t} isNewsModal={isNewsModal} />
      </Flex>
    </Flex>
  )
}

export default NewsletterModal
