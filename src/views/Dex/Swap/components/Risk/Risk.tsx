/** @jsxImportSource theme-ui */
import React, { useEffect, useState } from 'react'
import { Flex, Text, TooltipBubble } from '@ape.swap/uikit'
import { parsedRiskData } from './helpers'
import { Currency, Token } from '@ape.swap/sdk'
import { styles } from './styles'
import { useTranslation } from 'contexts/Localization'
import { riskSupportedChains, TAG_COLOR, TAG_TOKEN_RISK_VALUES, TOKEN_RISK_VALUES } from './constants'
import Dots from 'components/Loader/Dots'

const Risk = ({ chainId, currency }: { chainId: number; currency: Currency }) => {
  const isChainSupported = riskSupportedChains.includes(chainId)
  const [risk, setRisk] = useState(null)
  const [hide, setHide] = useState(isChainSupported)
  const { t } = useTranslation()

  useEffect(() => {
    setRisk(null)
    const isToken = currency instanceof Token
    const token = currency as Token
    if (isToken && isChainSupported) {
      setHide(false)
      parsedRiskData(chainId, token?.address).then((res) => {
        setRisk(res?.risk)
      })
    } else {
      setHide(true)
    }
  }, [chainId, currency, isChainSupported])

  return (
    <>
      {!hide && (
        <Flex sx={styles.riskContainer}>
          <Flex sx={{ minWidth: '150px', justifyContent: 'flex-end' }}>
            <TooltipBubble
              placement="bottomRight"
              transformTip="translate(0%, -4%)"
              width="226px"
              style={{ padding: ' 10px' }}
              body={
                <Flex sx={{ flexWrap: 'wrap' }}>
                  <Text
                    sx={{
                      ...styles.title,
                      fontWeight: 700,
                    }}
                  >
                    {TOKEN_RISK_VALUES[risk] ? (
                      TAG_TOKEN_RISK_VALUES[risk]
                    ) : (
                      <>
                        Scanning <Dots />
                      </>
                    )}
                  </Text>
                  <Text sx={styles.title}>
                    {t('Risk scan results are provided by a third party')}{' '}
                    <Text sx={styles.yellow}>
                      <a href="https://www.avengerdao.org/" target="_blank" rel="noreferrer noopener">
                        Avenger DAO
                      </a>
                    </Text>
                  </Text>
                  <Text sx={styles.title}>
                    {t(
                      'It is a tool for indicative purposes only to allow users to check the reference risk level of a BNB Chain Smart Contract. Please do your own research - interactions with any BNB Chain Smart Contract is at your own risk.',
                    )}
                  </Text>
                  <Text sx={styles.title}>
                    {t('Learn more about risk rating')}{' '}
                    <Text sx={styles.yellow}>
                      <a
                        href="https://www.avengerdao.org/docs/meter/consumer-api/RiskBand"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {t('here')}
                      </a>
                    </Text>
                    .
                  </Text>
                </Flex>
              }
            >
              <Flex sx={{ ...styles.tag, borderColor: risk ? TAG_COLOR[risk] : '#A09F9C' }}>
                <Text sx={{ ...styles.text, color: risk ? TAG_COLOR[risk] : '#A09F9C' }}>
                  {TOKEN_RISK_VALUES[risk] ? (
                    TAG_TOKEN_RISK_VALUES[risk]
                  ) : (
                    <>
                      Scanning <Dots />
                    </>
                  )}
                </Text>
              </Flex>
            </TooltipBubble>
          </Flex>
        </Flex>
      )}
    </>
  )
}

export default React.memo(Risk)
