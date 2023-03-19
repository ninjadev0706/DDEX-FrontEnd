import { Flex, Modal, Svg, Text } from '@ape.swap/uikit'
import React from 'react'
import { MigrationCompleteLog } from '../../provider/types'

const SuccessfulMigrationModal: React.FC<{ migrationCompleteLog: MigrationCompleteLog[] }> = ({
  migrationCompleteLog,
}) => {
  return (
    <Modal maxWidth="400px" minWidth="350px" zIndex={98} title="Successful Migration!" onDismiss={null}>
      <Flex sx={{ background: 'white2', flexDirection: 'column', width: '100%' }}>
        <Flex sx={{ margin: '10px 0px' }}>
          <Text size="14px">
            You have successfully migrated LPs, congratulations! Here is a summary of your migration:
          </Text>
        </Flex>
        <Flex
          sx={{
            flexDirection: 'column',
            width: '100%',
            mt: '10px',
            background: 'white3',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          {migrationCompleteLog?.map(({ lpSymbol, location, stakeAmount }) => {
            return (
              <Flex key={lpSymbol} sx={{ justifyContent: 'space-between', margin: '2.5px 0px' }}>
                <Flex sx={{ alignItems: 'center' }}>
                  <Svg icon="success" width="15px" />
                  <Text margin="0px 5px" weight={600}>
                    {lpSymbol}
                  </Text>
                  <Flex
                    sx={{
                      width: 'fit-content',
                      padding: '0px 7.5px',
                      height: '17px',
                      borderRadius: '10px',
                      background: location === 'farm' ? 'green' : 'orange',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text size="11px" weight={700} color="primaryBright">
                      {location.toUpperCase()}
                    </Text>
                  </Flex>
                </Flex>
                <Text>{stakeAmount?.substring(0, 8)}</Text>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </Modal>
  )
}

export default React.memo(SuccessfulMigrationModal)
