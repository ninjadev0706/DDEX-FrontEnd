import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  // Token selector container
  primaryFlex: {
    minWidth: 'max-content',
    height: '40px',
    background: 'white4',
    padding: '5px 10px',
    borderRadius: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all .3s linear',
    '&:active': {
      transform: 'scale(0.9)',
    },
    ':hover': { background: 'navMenuLogo' },
  },

  // Token selected text
  tokenText: {
    fontSize: '14px',
    margin: '0px 7.5px',
    textTransform: 'uppercase',
  },
}
