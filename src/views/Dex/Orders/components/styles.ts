import { Text } from '@ape.swap/uikit'
import styled from '@emotion/styled'
import { ThemeUIStyleObject } from 'theme-ui'
import { buttonHover } from 'views/Dex/styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  swapSwitchContainer: {
    width: '100%',
    height: '50px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapSwitchButton: {
    background: 'yellow',
    height: '30px',
    width: '30px',
    borderRadius: '30px',
    justifyContent: 'center',
    paddingRight: '1px',
    cursor: 'pointer',
    transition: 'all .3s linear',
    '&:active': {
      transform: 'scale(0.9)',
    },
    ':hover': buttonHover,
  },
  SwapConfirmDisabledInputContainer: {
    backgroundColor: 'white3',
    borderRadius: '10px',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    height: '60px',
  },
  outerLogoCircle: {
    zIndex: 1,
    height: '30px',
    width: '30px',
    borderRadius: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white2',
    flexDirection: 'column',
  },
  innerLogoCircle: {
    height: '22.5px',
    width: '22.5px',
    borderRadius: '22.5px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    paddingRight: '.6px',
  },
}

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  font-size: 12px;
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.colors.error
      : severity === 2
      ? theme.colors.yellow
      : severity === 1
      ? theme.colors.text
      : theme.colors.success};
`
