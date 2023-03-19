import { ThemeUIStyleObject } from 'theme-ui'
import { buttonHover } from 'views/Dex/styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  pricePanelContainer: {
    padding: '10px 0px',
    alignItems: 'center',
    '@media screen and (max-width: 370px)': {
      flexWrap: 'wrap',
    },
  },
  priceInputContainer: {
    width: '100%',
    minWidth: '250px',
    height: '55px',
    background: 'white3',
    borderRadius: '10px',
    alignItems: 'center',
    marginLeft: '7px',
    '@media screen and (max-width: 370px)': {
      marginTop: '10px',
      minWidth: '100%',
      marginLeft: '0px',
    },
  },
  currentButton: {
    background: 'yellow',
    height: 'fit-content',
    width: '110px',
    maxWidth: '100%',
    padding: '5px',
    borderRadius: '10px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    transition: 'all .3s linear',
    '&:active': {
      transform: 'scale(0.9)',
    },
    ':hover': buttonHover,
  },
  messageContainer: {
    background: 'white3',
    padding: '20px',
    borderRadius: '10px',
  },
}
