import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  tokenContainer: {
    position: 'relative',
    borderRadius: '10px',
    width: '100%',
    background: 'white3',
    padding: '10px 0px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addContainer: {
    height: '30px',
    width: '30px',
    borderRadius: '30px',
    background: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  swapDirectionText: {
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'translate(0px, -30px)',
  },

  // Token selected text
  tokenText: {
    fontSize: '14px',
    margin: '0px 7.5px',
    textTransform: 'uppercase',
  },
}
