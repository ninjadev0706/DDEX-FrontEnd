import { ThemeUIStyleObject } from 'theme-ui'
import { ArrowDropDownIcon, Flex, Text } from '@apeswapfinance/uikit'
import styled from 'styled-components'

// TODO: Change everything to theme ui

export const styles: Record<string, ThemeUIStyleObject> = {
  titleContainer: {
    alignItems: 'center',
    height: '100%',
    maxWidth: '290px',
    width: '100%',
  },
}

export const ListExpandedContainer = styled(Flex)<{ size?: number; justifyContent?: string }>`
  height: ${({ size }) => size || 234}px;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  flex-wrap: wrap;
  padding: 10px;
  background: ${({ theme }) => theme.colors.white3};
  min-width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 30px 0px 30px;
    height: 100px;
    max-width: 100%;
    flex-wrap: no-wrap;
  }
`

export const ListCardContainer = styled(Flex)<{ backgroundColor: string; forMigrationList?: boolean }>`
  border-radius: 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme, backgroundColor }) =>
    backgroundColor === 'white3' ? theme.colors.white3 : theme.colors.white2};
  border-bottom: ${({ backgroundColor }) =>
    `1px solid ${backgroundColor === 'white3' ? 'rgba(226, 226, 226, .7)' : 'rgba(226, 226, 226, .2)'}`};
  padding: 10px 20px 10px 20px;
  margin: 0px 10px 0px 10px;
  max-width: 500px;
  min-width: ${({ forMigrationList }) => (forMigrationList ? '250px' : '300px')};
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    height: 86px;
    padding: 0px 30px 0px 30px;
    max-width: 100%;
  }
`
export const ListViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  z-index: 1;
  & ${ListCardContainer}:first-child {
    border-radius: 10px 10px 0px 0px;
  }
  & ${ListCardContainer}:last-child {
    border-radius: 0px 0px 10px 10px;
    border: none;
  }
  & ${ListCardContainer}:first-child:last-child {
    border-radius: 10px 10px 10px 10px;
    border: none;
  }
`

export const DropDownIcon = styled(ArrowDropDownIcon)<{ open: boolean; width?: string }>`
  width: ${({ width }) => width || '10px'};
  transform: ${({ open }) => (open ? 'rotate(-180deg)' : '')};
  transition: transform 0.3s ease;
  right: 0;
  cursor: pointer;
`

export const TagContainer = styled(Flex)<{ backgroundColor: string }>`
  align-items: center;
  justify-content: center;
  height: 15px;
  border-radius: 7px;
  color: white;
  font-weight: 800;
  line-height: 0px;
  font-size: 10px;
  padding: 9px 5px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`

export const ContentContainer = styled(Flex)`
  position: relative;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.md} {
    height: 60px;
  }
`

export const TitleText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`
