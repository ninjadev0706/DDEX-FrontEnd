/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide3 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading sx={styles.first}>{t('Earn points').toUpperCase()}</Heading>
        <Heading sx={styles.second}>{t('Can You Complete Them All?')}</Heading>
      </Box>
      <Box sx={styles.thirdWrapper}>
        <Text sx={styles.third}>{t('Every week, rewards will be given away to 10 lucky participants.')}</Text>
        <Text sx={styles.third}> {t('The more')}</Text>
        <Text color="yellow" sx={styles.third}>
          {' '}
          <a
            href="https://box.genki.io/FZSY2H"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('quests')}
          </a>
        </Text>{' '}
        <Text sx={styles.third}> {t('you complete, the more chances you get!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide3
