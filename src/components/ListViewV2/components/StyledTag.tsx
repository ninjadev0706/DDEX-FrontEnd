/** @jsxImportSource theme-ui */
import React from 'react'
import { Tag } from '@ape.swap/uikit'

const StyledTag: React.FC<{ text: string; variant: any }> = ({ text, variant }) => {
  const styles = {
    style: {
      fontSize: '10px',
      padding: '0px 6px',
      fontWeight: 700,
      border: 'none',
      borderRadius: '10px',
      height: 'auto',
      width: 'max-content',
    },
  }
  return (
    <Tag variant={variant} {...styles}>
      {text}
    </Tag>
  )
}

export default StyledTag
