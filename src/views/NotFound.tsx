import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, Text } from '@ape.swap/uikit'
import notFoundLottie from 'config/constants/lottie/not-found-page.json'
import Page from 'components/layout/Page'
import { useTranslation } from 'contexts/Localization'
import Lottie from 'lottie-react'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 164px);
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <Flex sx={{ maxWidth: '600px', widht: '100%' }}>
          <Lottie animationData={notFoundLottie} loop />
        </Flex>
        <Heading>404</Heading>
        <Text mb="16px">{t('Oops, page not found.')}</Text>
        <Button as="a" href="/" size="sm">
          {t('Back Home')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
