import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<'poolContainer' | 'poolContent', ThemeUIStyleObject> = {
  poolContainer: {
    position: 'relative',
    top: '30px',
    width: '100%',
    mb: '100px',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  poolContent: {
    maxWidth: '1130px',
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
}
