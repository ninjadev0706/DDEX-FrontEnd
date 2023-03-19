import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  mainContainer: {
    width: '100%',
    background: 'white2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
  },
  subContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 20px',
  },
  title: {
    width: '100%',
    justifyContent: 'center',
    marginTop: '10px',
  },
  availableBills: {
    mt: '5px',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkButton: {
    padding: '5px 10px',
    background: 'white3',
    alignItems: 'center',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '5px 5px',
  },
}
