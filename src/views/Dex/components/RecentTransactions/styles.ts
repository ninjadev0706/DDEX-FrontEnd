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
  },

  normalRouterContainer: {
    borderRadius: 4,
    height: '16px',
    padding: '2px 6px',
    justifyContent: 'center',
    alignItems: 'center',
    mr: '7px',
  },

  bottomRouterContainer: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    margin: '10px 0px',
    flexDirection: 'column',
  },
}
