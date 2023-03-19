import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  dexTradeInfoContainer: {
    border: '2px solid',
    marginTop: '10px',
    borderRadius: '10px',
    borderColor: 'white3',
    background: 'white3',
    padding: '5px 10px',
    width: '100%',
    flexDirection: 'column',
    height: 'fit-content',
    cursor: 'pointer',
    overflow: 'hidden',
  },

  normalRouterContainer: {
    borderRadius: 4,
    padding: '4px 6px',
    margin: '2px 0px',
    minHeight: '16px',
    mr: '7px',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomRouterContainer: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    margin: '10px 0px',
    flexDirection: 'column',
  },
}
