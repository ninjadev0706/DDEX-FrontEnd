/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, HelpIcon, ListTag, Skeleton, Text, TooltipBubble } from '@ape.swap/uikit'
import { ValueSkeleton } from '../ListViewContent/styles'
import { useTranslation } from '../../contexts/Localization'
import { styles } from './styles'
import { ListViewContentProps } from './types'

const ListViewContent: React.FC<ListViewContentProps> = ({
  tag,
  title,
  value,
  valueIcon,
  valueColor,
  toolTip,
  toolTipPlacement,
  toolTipTransform,
  value2,
  value2Icon,
  value2Secondary,
  style,
  value2Direction = 'row',
  aprCalculator,
}) => {
  const { t } = useTranslation()
  return (
    <Flex sx={style}>
      <>
        {toolTip ? (
          <Flex sx={{ alignItems: 'center' }}>
            <TooltipBubble
              placement={toolTipPlacement}
              transformTip={toolTipTransform}
              body={<Flex>{t(`${toolTip}`)}</Flex>}
              width="180px"
            >
              <Text sx={styles.titleText}>
                {t(`${title}`)}
                <HelpIcon width="12px" ml="5px" />
              </Text>
            </TooltipBubble>
            {aprCalculator}
          </Flex>
        ) : (
          <Flex sx={{ alignItems: 'center' }}>
            {tag ? (
              <Flex sx={{ mr: '5px' }}>
                <ListTag variant={tag} />
              </Flex>
            ) : (
              <Text sx={styles.titleText}>{title}</Text>
            )}
            {aprCalculator}
          </Flex>
        )}
      </>
      <Flex sx={{ flexDirection: value2Direction }}>
        <Text sx={{ ...styles.valueText, color: valueColor }}>
          {valueIcon && valueIcon}
          {value?.includes('NaN') || value?.includes('undefined') || value?.includes('null') ? (
            <ValueSkeleton sx={styles.skeleton} />
          ) : (
            value
          )}
        </Text>
        {value2 && (
          <Text sx={value2Secondary ? styles.secondaryText : { ...styles.valueText, color: valueColor }}>
            {value2Icon && value2Icon}
            {value2?.includes('NaN') || value2?.includes('undefined') || value2?.includes('null') ? (
              <Skeleton sx={styles.skeleton} />
            ) : (
              value2
            )}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(ListViewContent)
