import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 24px;
  }
`
