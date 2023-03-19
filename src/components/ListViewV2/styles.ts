/** @jsxImportSource theme-ui */
import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<
  | 'listCardContainer'
  | 'listViewContainer'
  | 'titleContainer'
  | 'infoContentMobile'
  | 'tokensContainer'
  | 'titleText'
  | 'skeleton'
  | 'valueText'
  | 'secondaryText'
  | 'cardContentContainer'
  | 'animationDiv'
  | 'expandedWrapper',
  ThemeUIStyleObject
> = {
  listCardContainer: {
    borderRadius: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: (theme) => theme?.colors?.white2,
    borderBottom: '1px solid rgba(226, 226, 226, .2)',
    padding: '10px 20px 10px 20px',
    margin: '0 10px 0 10px',
    maxWidth: '500px',
    minWidth: '300px',
    width: '100%',
    '@media screen and (min-width: 852px)': {
      flexDirection: 'row',
      height: '86px',
      padding: '0 30px 0 30px',
      maxWidth: '100%',
    },
  },
  listViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
    '& > div:first-of-type': {
      borderRadius: '10px 10px 0 0',
    },
    '& > div:last-of-type': {
      borderRadius: '0 0 10px 10px',
      border: 'none',
    },
    '& > div:first-of-type:last-of-type': {
      borderRadius: '10px 10px 10px 10px',
      border: 'none',
    },
  },
  titleContainer: {
    width: '100%',
    justifyContent: 'space-between',
    my: '5px',
  },
  infoContentMobile: {
    display: ['flex', 'flex', 'none'],
    alignItems: 'center',
  },
  tokensContainer: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  titleText: {
    opacity: 0.6,
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
  },
  skeleton: {
    width: '60px',
    maxHeight: '18px',
    minHeight: '18px',
  },
  valueText: {
    fontSize: ['12px', '12px', '16px'],
    color: 'primaryBright',
    lineHeight: '16px',
    fontWeight: 700,
    mr: '5px',
    display: 'flex',
  },
  secondaryText: {
    fontSize: '12px',
    color: 'gray',
    lineHeight: '16px',
    fontWeight: 400,
  },
  cardContentContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  animationDiv: {
    position: 'relative',
    width: '100%',
    maxWidth: ['500px', '500px', '100%'],
    minWidth: '300px',
  },
  expandedWrapper: {
    background: 'white3',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px 10px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
}
