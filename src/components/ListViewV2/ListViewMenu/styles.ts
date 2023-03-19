import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<
  | 'menuContainer'
  | 'toogle'
  | 'searchText'
  | 'expandedButton'
  | 'container'
  | 'selectContainer'
  | 'searchInput'
  | 'expandedContainer'
  | 'onlyDesktop'
  | 'onlyMobile'
  | 'monkey',
  ThemeUIStyleObject
> = {
  menuContainer: {
    borderRadius: '10px',
    justifyContent: 'space-between',
    padding: '10px 20px',
    zIndex: 2,
    backgroundColor: 'white2',
    minWidth: '300px',
    width: '100%',
    alignItems: 'center',
    flexDirection: ['column', 'column', 'row'],
  },
  toogle: {
    height: '36px',
    alignItems: 'center',
    width: '100%',
    '& div': { width: '90px', textAlign: 'center' },
  },
  searchText: {
    fontWeight: 700,
    fontSize: '16px !important',
    display: 'none',
    alignItems: 'center',
    '@media screen and (min-width: 1100px)': {
      display: 'inherit',
      margin: '0 10px',
    },
  },
  expandedButton: {
    display: ['flex', 'flex', 'none'],
    backgroundColor: 'lvl1',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  container: {
    width: ['100%', '100%', 'unset'],
    justifyContent: 'space-between',
    maxWidth: '353px',
    marginTop: ['15px', '15px', '0'],
  },
  selectContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  searchInput: {
    borderRadius: '10px',
    fontWeight: 800,
    border: 'none',
    width: '100%',
    '@media screen and (min-width: 852px)': {
      width: '120px',
    },
    '@media screen and (min-width: 1000px)': {
      width: '240px',
    },
  },
  expandedContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
  },
  onlyDesktop: {
    display: ['none', 'none', 'flex'],
  },
  onlyMobile: {
    display: ['flex', 'flex', 'none'],
  },
  monkey: {
    height: '187px',
    width: '134px',
    position: 'absolute',
    display: ['none', 'none', 'block'],
    right: '10px',
    top: '14vw',
    '@media screen and (min-width: 1130px)': {
      top: '175px',
    },
  },
}
