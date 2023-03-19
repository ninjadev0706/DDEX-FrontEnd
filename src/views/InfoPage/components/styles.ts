import styled from 'styled-components'
import { Link } from '@ape.swap/uikit'

interface ShowcaseProps {
  background: string
}

export const FigureWrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  padding: 3px;
  border-radius: 5px;
  margin-bottom: 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 33.33%;
    margin-bottom: 0px;
  }
  
  .value {
    font-weight: 600;
  }

  &.highlighted {
    background-color: ${({ theme }) => theme.colors.white4};
  }

  &.clickable {
    cursor: pointer;
  }

  .date-selector {
    margin-left: 15px;
    cursor: pointer;
    &:not(.live) {
      opacity: 50%;
    }
`

export const RangeSelectorsWrapper = styled.div`
  margin-top: 10px;
  ul {
    list-style-type: none;
  }
  li {
    float: left;
    margin-left: 15px;
    cursor: pointer;
    &:not(.active) {
      opacity: 50%;
    }
  }

  &.transctionSelector {
    margin-top: 8px;
    position: absolute;

    li {
      margin-left: 0px;
      margin-right: 10px;
    }
  }
`

export const ShowcaseWrapper = styled.div<ShowcaseProps>`
  width: 100%;
  max-width: 100%;
  margin-bottom: 10px;
  height: 214px;
  background: url(${(props) => props.background});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;
  border-radius: 10px;
  padding: 15px 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: calc(50% - 10px);
  }

  .showcaseItem {
    background: rgba(255, 255, 255, 0.7);
    width: 100%;
    height: 60px;
    border-radius: 10px;
    padding: 10px;
    margin: 8px 0;
  }
  .showcaseLink {
    width: 100%;
    text-align: center;
  }
`

export const ChartWrapper = styled.div`
  height: 330px;
  width: 100%;
  min-width: 100%;
  flex: 1 0 100%;
`

export const IconBox = styled.div`
  border-radius: 5px;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.white3};
  position: relative;
  flex-shrink: 0;
  float: left;
  margin-right: 10px;
`

export const CenteredImage = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const Bubble = styled.div<{ isActive?: boolean }>`
  background: ${({ isActive, theme }) =>
    isActive ? 'linear-gradient(53.53deg, #a16552 15.88%, #e1b242 92.56%)' : theme.colors.white4};
  height: 14px;
  width: 14px;
  border-radius: 50px;
  margin: 0px 2.5px 0px 2.5px;
  cursor: pointer;
`
export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.yellow};
`

export const Section = styled.div`
  position: relative;

  background: ${({ theme }) => theme.colors.white2};
  border-radius: 10px;

  &.smallSection {
    width: 300px;
    padding: 0px 0px 5px 0px;
    box-shadow: 0px 0px 10px ${(props) => props.theme.colors.gray};

    .header {
      padding: 10px 0;
      background: ${({ theme }) => theme.colors.white3};
      width: 100%;
      border-radius-topleft: 10px;
      border-radius-topright: 10px;

      margin-bottom: 5px;
      .wrapper {
        font-weight: 600;
      }
    }

    .body {
      padding: 10px 0;
    }
    .wrapper {
      width: 300px;
      padding: 5px 18px;
      font-weight: 500;
      font-size: 12px;

      .value {
        float: right;
      }
      .indicator {
        width: 10px;
        height: 10px;
        margin: 1px 5px 0 0;
        float: left;
        border-radius: 50%;
        &.eth {
          background: #637dea;
        }

        &.bnb {
          background: #fab701;
        }

        &.telos {
          background: #9d68e8;
        }

        &.polygon {
          background: #637dea;
        }

        &.arbitrum {
          background: #2d374a;
        }
      }
    }
  }
`
