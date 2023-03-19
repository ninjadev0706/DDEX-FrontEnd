import { ThemeUIStyleObject } from 'theme-ui'
import { FLEX_DIRECTION_BREAKPOINTS, JUSTIFY_CONTENT_BREAKPOINTS } from 'style/StylesBreakpoints'

export const styles: Record<
  | 'farmInfo'
  | 'cardContent'
  | 'actionContainer'
  | 'expandedContent'
  | 'styledBtn'
  | 'smallBtn'
  | 'depositContainer'
  | 'columnView'
  | 'harvestAllBtn'
  | 'stakeActions'
  | 'onlyDesktop'
  | 'onlyMobile',
  ThemeUIStyleObject
> = {
  farmInfo: {
    width: '100%',
    justifyContent: JUSTIFY_CONTENT_BREAKPOINTS,
    flexDirection: FLEX_DIRECTION_BREAKPOINTS,
    maxWidth: ['', '', '140px'],
  },
  cardContent: {
    flexDirection: ['column', 'column', 'row'],
    width: '100%',
    justifyContent: 'space-between',
  },
  actionContainer: {
    justifyContent: ['space-between', 'space-between', 'space-around'],
    alignItems: 'center',
    mt: ['10px', '10px', '0'],
    width: ['100%', '100%', ''],
    flexDirection: ['row', 'row', 'row-reverse'],
  },
  expandedContent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: ['wrap', 'wrap', 'nowrap'],
    padding: '0 10px',
  },
  styledBtn: {
    fontSize: '16px',
    padding: '10px',
    width: ['130px', '130px', '140px'],
    minWidth: ['130px', '130px', '100px'],
    height: '44px',
    '&:disabled': {
      background: 'white4',
    },
  },
  smallBtn: {
    maxWidth: '60px',
    width: '100%',
    minWidth: '44px',
    height: '44px',
    '&:disabled': {
      background: 'white4',
    },
  },
  depositContainer: {
    width: '100%',
    maxWidth: ['130px', '130px', '140px'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnView: {
    maxWidth: '50%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  harvestAllBtn: {
    height: '36px',
    lineHeight: '18px',
    justifyContent: 'center',
    width: ['100%', '100%', '180px'],
    fontSize: '16px',
  },
  stakeActions: {
    maxWidth: ['', '', '94px'],
    alignItems: 'center',
    width: '100%',
  },
  onlyDesktop: {
    justifyContent: 'space-around',
    display: ['none', 'none', 'flex'],
  },
  onlyMobile: {
    flexDirection: 'column',
    display: ['flex', 'flex', 'none'],
  },
}
