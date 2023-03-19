import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  poolContainer: {
    height: 'fit-content',
    width: '100%',
    background: 'white3',
    borderRadius: '10px',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0px 10px',
    cursor: 'pointer',
    flexDirection: 'column',
    marginBottom: '10px',
  },
  innerContainer: {
    height: '60px',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    background: 'white4',
    borderRadius: '10px',
    padding: '5px 10px',
  },
}
