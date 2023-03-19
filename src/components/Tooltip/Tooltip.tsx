/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, LinkExternal, Text } from '@ape.swap/uikit'
import { useTranslation } from '../../contexts/Localization'
import { styles } from './styles'
import { BLOCK_EXPLORER } from '../../config/constants/chains'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { JungleFarm, Pool } from 'state/types'
import JungleFarmsEndsIn from './JungleFarmsEndsIn'
import ButtonsRow from './ButtonsRow'
import PoolsEndsIn from './PoolsEndsIn'

export interface TooltipProps {
  valueTitle?: string
  valueContent?: string
  value2Title?: string
  value2Content?: string
  tokenContract: string
  secondURL?: string
  secondURLTitle?: string
  projectLink?: string
  twitter?: string
  audit?: string
  jungleFarm?: JungleFarm
  pool?: Pool
}

const Tooltip: React.FunctionComponent<TooltipProps> = ({
  valueTitle,
  valueContent,
  value2Title,
  value2Content,
  tokenContract,
  secondURL,
  secondURLTitle,
  projectLink,
  twitter,
  audit,
  jungleFarm,
  pool,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const explorerLink = BLOCK_EXPLORER[chainId]
  const tokenLink = `${explorerLink}/address/${tokenContract}`

  return (
    <>
      {projectLink && twitter && (
        <ButtonsRow twitter={twitter} projectLink={projectLink} bubble={tokenContract} audit={audit} />
      )}
      {valueTitle && (
        <Flex sx={styles.infoRow}>
          <Text sx={styles.titleText}>{valueTitle}: </Text>
          <Text sx={styles.contentText}>{valueContent}</Text>
        </Flex>
      )}
      {value2Title && (
        <Flex sx={styles.infoRow}>
          <Text sx={styles.titleText}>{value2Title}: </Text>
          <Text sx={styles.contentText}>{value2Content}</Text>
        </Flex>
      )}
      {jungleFarm && <JungleFarmsEndsIn farm={jungleFarm} />}
      {pool && <PoolsEndsIn pool={pool} />}
      <Flex sx={{ justifyContent: 'center' }}>
        <Flex sx={{ width: '144px', flexDirection: 'column' }}>
          <Flex sx={styles.linkRow}>
            <LinkExternal href={tokenLink} sx={{ fontSize: '12px', lineHeight: '14px' }}>
              {t('View Token Contract')}
            </LinkExternal>
          </Flex>
          {secondURL && (
            <Flex sx={styles.linkRow}>
              <LinkExternal href={secondURL} sx={{ fontSize: '12px', lineHeight: '14px' }}>
                {secondURLTitle}
              </LinkExternal>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default Tooltip
