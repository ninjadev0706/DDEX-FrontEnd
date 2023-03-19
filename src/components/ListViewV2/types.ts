import React from 'react'
import { ListTagVariants } from '@ape.swap/uikit'
import { ThemeUIStyleObject } from 'theme-ui'

export interface TokenDisplayProps {
  token1: string
  token2: string
  token3?: string
  token4?: string
  billArrow?: boolean
  stakeLp?: boolean
  earnLp?: boolean
  noEarnToken?: boolean
}

export interface ListProps {
  id?: string | number
  title: React.ReactNode
  titleWidth?: string
  iconsContainer?: string
  infoContent?: React.ReactNode
  cardContent: React.ReactNode
  expandedContent?: React.ReactNode
  open?: boolean
}

export interface ListViewProps {
  tokenDisplayProps: TokenDisplayProps
  listProps: ListProps
}

export interface ListCardProps extends ListProps {
  serviceTokenDisplay: React.ReactNode
}

export interface ListViewContentProps {
  tag?: ListTagVariants
  title?: string
  value: string
  valueIcon?: React.ReactNode
  valueColor?: string
  value2?: string
  value2Icon?: React.ReactNode
  value2Secondary?: boolean
  value2Direction?: 'column' | 'row'
  toolTip?: string
  aprCalculator?: React.ReactNode
  toolTipPlacement?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
  toolTipTransform?: string
  style?: ThemeUIStyleObject
}
