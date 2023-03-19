import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  // Token selector container
  dexActionsContainer: {
    position: 'relative',
    width: '100%',
    marginTop: '10px',
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
    maxWidth: '60px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  navLink: {
    cursor: 'pointer',
  },
}
