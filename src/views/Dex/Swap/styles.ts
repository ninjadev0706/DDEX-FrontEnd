import { ThemeUIStyleObject } from 'theme-ui'

export const swapStyles: Record<string, ThemeUIStyleObject> = {
  // Token selector container
  inputContainer: {
    position: 'relative',
    width: '100%',
    height: '94px',
    background: 'white3',
    padding: '10px',
    borderRadius: '10px',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },

  swapDirectionText: {
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'translate(0px, -30px)',
  },
}
