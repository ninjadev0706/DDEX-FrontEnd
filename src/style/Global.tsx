import { createGlobalStyle } from 'styled-components'
import { ApeSwapTheme } from '@ape.swap/uikit'

declare module 'styled-components' {
  export interface DefaultTheme extends ApeSwapTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
