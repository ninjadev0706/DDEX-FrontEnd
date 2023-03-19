import { ThemeUIStyleObject } from 'theme-ui'
import { FLEX_DIRECTION_BREAKPOINTS, JUSTIFY_CONTENT_BREAKPOINTS } from 'style/StylesBreakpoints'

export const poolStyles: Record<
  | 'buttonsContainer'
  | 'container'
  | 'farmInfo'
  | 'aprInfo'
  | 'earnedColumn'
  | 'cardContent'
  | 'actionContainer'
  | 'expandedContent'
  | 'styledBtn'
  | 'smallBtn'
  | 'depositContainer'
  | 'columnView'
  | 'stakeActions'
  | 'harvestAllBtn'
  | 'apeHarder'
  | 'fixedSizedBtn'
  | 'onlyBigScreen'
  | 'onlyDesktop'
  | 'onlyMobile',
  ThemeUIStyleObject
> = {
  buttonsContainer: {
    justifyContent: 'space-around',
    width: '100%',
    display: ['none', 'none', 'flex'],
    maxWidth: ['', '', '90px'],
  },
  container: {
    position: 'relative',
    width: '100%',
  },
  farmInfo: {
    width: '100%',
    justifyContent: JUSTIFY_CONTENT_BREAKPOINTS,
    flexDirection: FLEX_DIRECTION_BREAKPOINTS,
    maxWidth: ['', '', '110px'],
  },
  aprInfo: {
    width: '100%',
    justifyContent: JUSTIFY_CONTENT_BREAKPOINTS,
    flexDirection: FLEX_DIRECTION_BREAKPOINTS,
    maxWidth: ['', '', '80px'],
  },
  earnedColumn: {
    width: '100%',
    justifyContent: JUSTIFY_CONTENT_BREAKPOINTS,
    flexDirection: FLEX_DIRECTION_BREAKPOINTS,
    maxWidth: ['', '', '150px'],
  },
  cardContent: {
    flexDirection: ['column', 'column', 'row'],
    width: '100%',
    justifyContent: 'space-between',
    maxWidth: 'unset',
  },
  actionContainer: {
    justifyContent: ['space-between', 'space-between', 'space-around'],
    alignItems: 'center',
    width: '100%',
    mt: ['10px', '10px', '0'],
    flexWrap: ['wrap', 'wrap', 'nowrap'],
    flexDirection: ['row', 'row', 'row-reverse'],
  },
  expandedContent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: ['wrap', 'wrap', 'nowrap'],
    padding: '0 10px',
    justifyContent: 'space-between',
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
  stakeActions: {
    maxWidth: ['', '', '94px'],
    alignItems: 'center',
    width: '100%',
  },
  harvestAllBtn: {
    height: '36px',
    lineHeight: '18px',
    justifyContent: 'center',
    width: ['100%', '100%', '180px'],
    fontSize: '16px',
  },
  apeHarder: {
    fontSize: '16px',
    padding: '10px',
    minWidth: ['130px', '130px', '125px'],
    width: ['100%', '100%', '125px'],
    height: '44px',
    '&:disabled': {
      background: 'white4',
    },
  },
  fixedSizedBtn: {
    fontSize: '16px',
    padding: '10px',
    minWidth: ['130px', '130px', '125px'],
    width: ['130px', '130px', '125px'],
    height: '44px',
    '&:disabled': {
      background: 'white4',
    },
  },
  onlyBigScreen: {
    display: ['none', 'none', 'none', 'flex'],
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
