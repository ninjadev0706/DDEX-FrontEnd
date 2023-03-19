import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<'farmContainer' | 'farmContent' | 'harvestAllBtn', ThemeUIStyleObject> = {
  farmContainer: {
    position: 'relative',
    top: '30px',
    width: '100%',
    mb: '100px',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  farmContent: {
    maxWidth: '1130px',
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  harvestAllBtn: {
    height: '36px',
    lineHeight: '18px',
    justifyContent: 'center',
    width: '100%',
    fontSize: '16px',
    '@media screen and (min-width: 852px)': {
      width: '180px',
    },
  },
}
