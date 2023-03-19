import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  modalWrapper: {
    flexDirection: 'column',
  },
  swapSwitchButton: {
    backgroundColor: 'yellow',
    height: '30px',
    width: '30px',
    borderRadius: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  confirmDisabledInputContainer: {
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
  },
}
