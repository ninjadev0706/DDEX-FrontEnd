import styled from '@emotion/styled'
import { Flex, Text } from '@apeswapfinance/uikit'
import { ThemeUIStyleObject } from 'theme-ui'

export const MainContainer = styled(Flex)`
  position: relative;
  flex-direction: column;
`

export const SearchText = styled(Text)`
  font-weight: 700;
  font-size: 16px !important;
  display: none;
  align-items: center;
  @media screen and (min-width: 1050px) {
    display: inherit;
  }
`

export const styles: Record<string, ThemeUIStyleObject> = {
  menuContainer: {
    borderRadius: '10px',
    justifyContent: 'space-between',
    padding: '10px 20px',
    zIndex: 2,
    backgroundColor: 'white2',
    minWidth: '300px',
    width: '100%',
    marginTop: '20px',
    '@media screen and (min-width: 852px)': {
      padding: '10px 10px',
    },
  },
  mobileContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  expandedButton: {
    backgroundColor: 'lvl1',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  mobileRow: {
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    maxWidth: '353px',
    marginTop: '15px',
  },
  inputContainer: {
    width: '50%',
    justifyContent: 'center',
  },
  select: {
    height: '36px',
    display: 'flex',
    width: '100%',
  },
  networkWrapper: {
    marginTop: '15px',
    width: '100%',
    '& button': {
      width: '100%',
      justifyContent: 'space-between',
      '& span': { width: '100%', textAlign: 'left' },
    },
  },
  input: {
    borderRadius: '10px',
    fontWeight: 800,
    border: 'none',
    width: '100%',
    '@media screen and (min-width: 852px)': {
      width: '150px',
    },
    '@media screen and (min-width: 1000px)': {
      width: '240px',
    },
  },
}
