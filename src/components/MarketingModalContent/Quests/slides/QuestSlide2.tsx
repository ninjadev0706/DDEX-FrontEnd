/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide2 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading sx={styles.first}>{t('Connect to Genki').toUpperCase()}</Heading>
        <Heading sx={styles.second}>{t('You Have New Quests!')}</Heading>
      </Box>
      <Box sx={styles.thirdWrapper}>
        <Text color="yellow" sx={styles.third}>
          <a
            href="https://box.genki.io/FZSY2H"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('Visit GENKI')}
          </a>
        </Text>{' '}
        <Text sx={styles.third}>
          {' '}
          {t('and connect your wallet to access the newly available Quests we have for you.')}
        </Text>
        <br />
        <br />
      </Box>
    </>
  )
}

export default QuestSlide2
