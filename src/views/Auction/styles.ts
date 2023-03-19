import styled from 'styled-components'

export const MoreInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 790px;
    justify-content: flex-start;
  }
`

export const styles = {
  mainContainer: {
    position: 'relative',
    top: '30px',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItem: 'center',
    marginBottom: '30px',
  },
}
