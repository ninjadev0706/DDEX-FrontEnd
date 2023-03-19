/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide4 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading sx={styles.first}>{t('Are you ready?').toUpperCase()}</Heading>
        <Heading sx={styles.second}>{t('Good Luck!')}</Heading>
      </Box>
      <Box sx={styles.thirdWrapper}>
        <Text sx={styles.third}>{t('The Telos Jungle is full of opportunities awaiting for you,')}</Text>{' '}
        <Text color="yellow" sx={styles.third}>
          <a
            href="https://box.genki.io/FZSY2H"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {' '}
            {t('enter Genki')}
          </a>
        </Text>
        {'! '}
        <Text sx={styles.third}>{t('Just remember to always keep spare $TLOS in your backpack!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide4
