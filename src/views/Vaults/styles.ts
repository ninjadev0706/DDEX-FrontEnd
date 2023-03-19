import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<'maxiContainer' | 'maxiContent', ThemeUIStyleObject> = {
  maxiContainer: {
    position: 'relative',
    top: '30px',
    width: '100%',
    mb: '100px',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  maxiContent: {
    maxWidth: '1130px',
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
}
