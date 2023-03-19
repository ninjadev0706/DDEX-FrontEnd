import { Tag } from '@ape.swap/uikit'
import styled from '@emotion/styled'

import { ThemeUIStyleObject } from 'theme-ui'
import { textUnderlineHover } from '../../styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  liquiditySelector: {
    position: 'relative',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    '@media (max-width: 350px)': {
      fontSize: '12px',
    },
    ...textUnderlineHover,
  },
  liquiditySelectorContainer: {
    marginBottom: '20px',
    justifyContent: 'center',
    fontSize: '14px',
    alignItems: 'space-between',
    justifyItems: 'space-between',
    marginTop: '20px',
  },
  migrate: { margin: '0 15px', position: 'relative', alignItems: 'center', color: 'textDisabled' },
}

export const StyledTag = styled(Tag)`
  font-size: 10px;
  padding: 0px 6px !important;
  margin-left: 5px;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  height: auto;
  width: max-content;
`
