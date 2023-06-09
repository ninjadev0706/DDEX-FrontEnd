import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'

const PoolTabButtons = () => {
  const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={!isExact ? 1 : 0} size="sm" variant="yellow">
        <ButtonMenuItem as={Link} to={`${url}`} fontSize="12px">
          {t('Active')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`} fontSize="12px">
          {t('Inactive')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default PoolTabButtons

const Wrapper = styled.div`
  margin-right: 10px;
  margin-left: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 44px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 34px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 55px;
  }
`
