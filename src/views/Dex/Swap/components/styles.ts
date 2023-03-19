import { ThemeUIStyleObject } from 'theme-ui'
import { buttonHover } from 'views/Dex/styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  swapSwitchButton: {
    position: 'absolute',
    right: 'calc(50% - 15px)',
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
