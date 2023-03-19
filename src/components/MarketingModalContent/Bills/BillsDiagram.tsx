/** @jsxImportSource theme-ui */
import React from 'react'
import { BillsM1, BillsM2, BillsM3, Flex, Text, WarningIcon } from '@ape.swap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { Content, RightText, InnerTextButton } from './styles'

const BillsDiagram: React.FC = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Content>
        <BillsM1 width={50} mr={15} />
        {/* <BillsM1 width={50} bgColor={theme.theme.colors.white4} color={theme.theme.colors.text} mr={15} /> */}
        <RightText>
          {t(
            'The token discount is calculated based on several variables: token price, LP price, time, supply, and demand.',
          )}
        </RightText>
      </Content>
      <Content>
        <BillsM2 width={50} mr={15} />
        {/* <BillsM2 width={50} bgColor={theme.theme.colors.white4} color={theme.theme.colors.text} mr={15} /> */}
        <RightText>{t('Use Zap ⚡ to purchase a Bill with a single token or create an LP.')}</RightText>
      </Content>
      <Content>
        <BillsM3 width={50} mr={15} />
        {/* <BillsM3 width={50} bgColor={theme.theme.colors.white4} color={theme.theme.colors.text} mr={15} /> */}
        <RightText>{t('To mint a full color NFT, purchase a Bill with a value of $25 or more.')}</RightText>
      </Content>
      <Flex sx={{ margin: '22px 0 0 0', '@media screen and (min-width: 852px)': { margin: '22px 0 0 63px' } }}>
        <Text size="12px" weight={500}>
          <WarningIcon width="15px" mr="5px" color="text" style={{ transform: 'translate(0px, 3px)' }} />
          {t('Treasury Bills have a limited supply and will sell out. Check out the ')}
          <InnerTextButton
            href="https://apeswap.gitbook.io/apeswap-finance/product-and-features/raise/treasury-bills"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('documentation')}
          </InnerTextButton>
          {t(' for more information.')}
        </Text>
      </Flex>
    </Flex>
  )
}

export default BillsDiagram
