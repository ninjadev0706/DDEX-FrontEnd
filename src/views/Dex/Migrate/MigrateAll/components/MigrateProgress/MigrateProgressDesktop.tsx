/** @jsxImportSource theme-ui */
import { Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import React, { ReactNode } from 'react'
import { useMigrateAll } from '../../provider'
import { MIGRATION_STEPS } from '../../provider/constants'
import { MigrateStatus } from '../../provider/types'
import { styles } from './styles'

interface MigrateProcessBarInterface {
  activeLineMargin?: number
  children: ReactNode
}

const MigrateProgress: React.FC<MigrateProcessBarInterface> = ({ activeLineMargin, children }) => {
  const { activeIndex, migrateLpStatus, handleActiveIndexCallback } = useMigrateAll()
  const isComplete = migrateLpStatus?.map((item) =>
    Object.entries(item.status).map((each) => each[1] === MigrateStatus.COMPLETE),
  )
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        {MIGRATION_STEPS.map(({ title, description }, i) => {
          const isIndexComplete = isComplete.filter((loFlag) => !loFlag[i]).length === 0
          return (
            <>
              <Flex
                key={title}
                onClick={() => handleActiveIndexCallback(i)}
                sx={{ ...styles.desktopStepContainer, background: activeIndex >= i ? 'gradient' : 'white2' }}
              >
                <Flex sx={styles.desktopProgressCircleContainer}>
                  {isIndexComplete ? (
                    <Flex sx={{ backgroundColor: 'primaryBright', borderRadius: '30px', maxWidth: '60px' }}>
                      <Svg icon="success" width="100%" />
                    </Flex>
                  ) : (
                    <Text
                      size="35px"
                      color={activeIndex === i ? 'smartGradient' : 'text'}
                      weight={700}
                      sx={styles.migrateText}
                    >
                      {i + 1}
                    </Text>
                  )}
                </Flex>
                <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="20px" weight={700} mr="5px" color={activeIndex >= i ? 'primaryBright' : 'text'}>
                    {title}
                  </Text>
                  <Flex sx={{ mt: '2.5px' }}>
                    <TooltipBubble
                      placement="bottomRight"
                      body={description}
                      transformTip="translate(10%, 0%)"
                      width="200px"
                    >
                      <Svg icon="info" width="16.5px" color={activeIndex >= i ? 'primaryBright' : 'text'} />
                    </TooltipBubble>
                  </Flex>
                </Flex>
              </Flex>
              {i !== MIGRATION_STEPS.length - 1 && (
                <Flex
                  sx={{
                    background: activeIndex >= i ? 'gradient' : 'white2',
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
        <Flex
          sx={{
            ...styles.desktopStepLineIndicator,
            left: `${(activeIndex / MIGRATION_STEPS.length) * 100 + activeIndex + activeLineMargin || 15}%`,
          }}
        />
        <Flex sx={styles.desktopChildContainer}>
          <Flex sx={{ height: '100%', width: '100%', background: 'white2', borderRadius: '10px', padding: '50px' }}>
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(MigrateProgress)
