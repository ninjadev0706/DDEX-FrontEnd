import { ThemeUIStyleObject } from 'theme-ui'
import { textUnderlineHover } from 'views/Dex/styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  // Token selector container
  dexNavContainer: {
    position: 'relative',
    width: '100%',
    height: '30px',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  navLinkContainer: {
    width: '100%',
    maxWidth: '225px',
    paddingRight: '20px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  navIconContainer: {
    width: '100%',
    maxWidth: ['80px', '', 'none'],
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  underline: {
    display: 'inline-block',
    position: 'relative',
    background: 'primaryBright',
    height: '1px',
    width: '100%',
    borderRadius: '10px',
  },
  navLink: {
    position: 'relative',
    cursor: 'pointer',
    ...textUnderlineHover,
  },
  iconCover: {
    mr: ['6px', '6px', '10px'],
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
