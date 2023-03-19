/** @jsxImportSource theme-ui */
import { Flex, Svg, Text, Link } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

export const AboutMigrating = () => {
  const [expanded, setExpanded] = useState(true)
  const { t } = useTranslation()
  return (
    <Flex
      sx={{
        width: '100%',
        height: 'fit-content',
        minHeight: '80px',
        background: 'white2',
        borderRadius: '10px',
        padding: '0px 20px',
        margin: '20px 0px',
        flexDirection: 'column',
      }}
    >
      <Flex
        sx={{ alignItems: 'center', justifyContent: 'space-between', height: '80px', width: '100%', cursor: 'pointer' }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Text size="25px" ml="10px">
          {t('ABOUT MIGRATION')}
        </Text>
        <Svg icon="caret" direction={expanded ? 'up' : 'down'} />
      </Flex>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'fit-content' }}
            transition={{ opacity: { duration: 0.2 } }}
            exit={{ height: 0 }}
            sx={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              cursor: 'auto',
            }}
          >
            <Flex
              sx={{
                flexDirection: 'column',
                width: '100%',
                padding: '0px 10px 30px 10px',
                flexWrap: 'no-wrap',
                alignItems: 'flexStart',
              }}
            >
              <Text weight={500} size="14px">
                {t(
                  'ApeSwap is upgrading MasterApe, our primary smart contract, to a new MasterApeV2 smart contract on January 26th, 2023, 22:00 UTC.',
                )}
              </Text>
              <br />
              <Text weight={500} size="14px">
                {t('This upgraded contract will allow ApeSwap to:')}
              </Text>
              <Flex sx={{ flexDirection: 'column', ml: '15px' }}>
                <ul>
                  <li>
                    <Text weight={500} size="14px">
                      {t('Implement the hard cap on BANANA that was passed through governance on August 31, 2022')}
                    </Text>
                  </li>
                  <li>
                    <Text weight={500} size="14px">
                      {t(
                        'Fine-tune BANANA emissions for BANANA Farms, BANANA Maximizers, and the BANANA-BANANA Staking Pool',
                      )}
                    </Text>
                  </li>
                  <li>
                    <Text weight={500} size="14px">
                      {t(
                        'Make any future changes to BANANA emissions in order to preserve the long-term health of the protocol',
                      )}
                    </Text>
                  </li>
                </ul>
              </Flex>
              <br />
              <Text weight={500} size="14px">
                {t('In order to continue earning rewards on staked assets,')}{' '}
                {/* <span sx={{ fontWeight: 800 }}> */}
                <span>
                  {t('users must migrate them to the new MasterApeV2 smart contract.')}
                </span>
              </Text>
              <br />
              <Text weight={500} size="14px">
                {t(
                  'Follow the steps above to ensure that all of your positions are successfully migrated to the new smart contract so that you can continue earning rewards.',
                )}
              </Text>
              <Flex
                sx={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-start',
                  '@media screen and (max-width: 365px)': { flexDirection: 'column' },
                }}
              >
                <Text weight={500} size="14px">
                  {t('Want more information?')}{' '}
                </Text>
                <Link
                  href="https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake/hard-cap-migration-masterapev2"
                  target="_blank"
                  sx={{
                    textDecoration: 'underline',
                    fontSize: '14px',
                    ml: '5px',
                    '@media screen and (max-width: 365px)': { ml: '0px', mt: '5px' },
                  }}
                >
                  {t('Visit our docs')}
                </Link>
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  )
}
