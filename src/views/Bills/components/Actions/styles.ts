import { Button, Input } from '@apeswapfinance/uikit'
import styled from '@emotion/styled'

export const GetLPButton = styled(Button)`
  height: 44px;
  width: 100%;
  border: 3px solid ${({ theme }) => theme.colors.yellow};
  color: ${({ theme }) => theme.colors.yellow};
  :hover {
    border: 3px solid yellow;
  }
  @media screen and (min-width: 1180px) {
    margin: 0 20px;
  }
`

export const BuyButton = styled(Button)`
  width: 100%;
  height: 44px;
  font-weight: 700;
  @media screen and (min-width: 1180px) {
    margin: 0 20px;
  }
`

export const StyledInput = styled(Input)`
  width: 100%;
  border: none;
  font-size: 22px;
  font-weight: 700;
`

export const styles = {
  buyContainer: {
    width: '100%',
    flexDirection: 'column',
    '@media screen and (min-width: 1180px)': {
      marginRight: '40px',
    },
  },
  detailsContainer: {
    width: '100%',
    flexDirection: 'column-reverse',
    '@media screen and (min-width: 1180px)': {
      marginRight: '40px',
      flexDirection: 'column',
    },
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
    '@media screen and (min-width: 1180px)': {
      flexWrap: 'wrap',
      flexDirection: 'row',
      marginTop: '10px',
    },
  },
  getLpContainer: {
    width: '100%',
    padding: '10px 0 0 0',
    '@media screen and (min-width: 1180px)': {
      width: '50%',
      padding: '0 20px',
    },
  },
  buyButtonContainer: {
    width: '100%',
    padding: '10px 0 0 0',
    '@media screen and (min-width: 1180px)': {
      width: '50%',
      padding: '0 20px',
    },
  },
  updateSlippage: {
    '@media screen and (min-width: 1180px)': {
      '& div': {
        position: 'absolute',
        top: '360px',
        left: '0px',
        background: 'lvl1',
        padding: '10px',
        borderRadius: '10px',
        width: '552px',
      },
    },
  },
}
