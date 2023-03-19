/** @jsxImportSource theme-ui */
import { Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { ReactNode } from 'react'
import { useAppDispatch } from 'state'
import { MIGRATION_STEPS } from 'state/masterApeMigration/constants'
import { useActiveIndex, useIsMigrationLoading, useMigrateStatus } from 'state/masterApeMigration/hooks'
import { setActiveIndex } from 'state/masterApeMigration/reducer'
import { MigrateStatus } from 'state/masterApeMigration/types'
import { styles } from './styles'
import { useTranslation } from 'contexts/Localization'

interface MigrateProcessBarInterface {
  activeLineMargin?: number
  children: ReactNode
}

const MigrateProgress: React.FC<MigrateProcessBarInterface> = ({ activeLineMargin, children }) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { allDataLoaded: migrationLoaded } = useIsMigrationLoading()
  const migrateLpStatus = useMigrateStatus()
  const activeIndex = useActiveIndex()
  const isComplete = migrateLpStatus?.map((item) =>
    Object.entries(item.status).map((each) => each[1] === MigrateStatus.COMPLETE),
  )
  const noAccountOrLoading = account && migrationLoaded
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        {MIGRATION_STEPS.map(({ title, description }, i) => {
          const isIndexComplete = isComplete.filter((loFlag) => !loFlag[i]).length === 0
          return (
            <>
              <Flex
                key={title}
                onClick={() => dispatch(setActiveIndex(i))}
                sx={{
                  ...styles.desktopStepContainer,
                  background: activeIndex >= i && noAccountOrLoading ? 'gradient' : 'white2',
                }}
              >
                <Flex sx={styles.desktopProgressCircleContainer}>
                  {isIndexComplete && migrationLoaded ? (
                    <Flex sx={{ backgroundColor: 'primaryBright', borderRadius: '30px', maxWidth: '60px' }}>
                      <Svg icon="success" width="100%" />
                    </Flex>
                  ) : (
                    <Text
                      size="35px"
                      color={activeIndex === i && noAccountOrLoading ? 'smartGradient' : 'text'}
                      weight={700}
                      sx={styles.migrateText}
                    >
                      {i + 1}
                    </Text>
                  )}
                </Flex>
                <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    size="20px"
                    weight={700}
                    mr="5px"
                    color={activeIndex >= i && noAccountOrLoading ? 'primaryBright' : 'text'}
                  >
                    {t(`${title}`)}
                  </Text>
                  <Flex sx={{ mt: '2.5px' }}>
                    <TooltipBubble
                      placement="bottomRight"
                      body={t(`${description}`)}
                      transformTip="translate(10%, 0%)"
                      width="200px"
                    >
                      <Svg
                        icon="question"
                        width="16.5px"
                        color={activeIndex >= i && noAccountOrLoading ? 'primaryBright' : 'text'}
                      />
                    </TooltipBubble>
                  </Flex>
                </Flex>
              </Flex>
              {i !== MIGRATION_STEPS.length - 1 && (
                <Flex
                  sx={{
                    background: activeIndex >= i && noAccountOrLoading ? 'gradient' : 'white2',
                    width: `${10 - MIGRATION_STEPS.length}%`,
                    height: '10px',
                  }}
                />
              )}
            </>
          )
        })}
      </Flex>
      <Flex sx={{ width: '100%', position: 'relative', flexDirection: 'column' }}>
        {noAccountOrLoading && (
          <Flex
            sx={{
              ...styles.desktopStepLineIndicator,
              left: `${(activeIndex / MIGRATION_STEPS.length) * 100 + activeIndex + (activeLineMargin || 15)}%`,
            }}
          />
        )}
        <Flex sx={styles.desktopChildContainer}>
          <Flex
            sx={{ height: '100%', width: '100%', background: 'white2', borderRadius: '10px', padding: '40px 50px' }}
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(MigrateProgress)
