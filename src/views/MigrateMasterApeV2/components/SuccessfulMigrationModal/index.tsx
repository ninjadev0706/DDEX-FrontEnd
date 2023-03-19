import { Flex, Modal, Svg, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import { MigrationCompleteLog } from 'state/masterApeMigration/types'
import { Image, Link } from 'theme-ui'
import track from 'utils/track'

const SuccessfulMigrationModal: React.FC<{ migrationCompleteLog: MigrationCompleteLog[] }> = ({
  migrationCompleteLog,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  try {
    track({
      event: 'masterApeMigration',
      chain: chainId,
      data: {
        cat: 'SUCCESS',
      },
    })
  } catch {}
  return (
    <Modal maxWidth="400px" minWidth="350px" zIndex={98} title="Successful Migration! 🎉" onDismiss={null}>
      <Flex sx={{ background: 'white2', flexDirection: 'column', width: '100%' }}>
        <Flex sx={{ margin: '10px 0px' }}>
          <Text size="14px" weight={500}>
            {t('Your tokens have been migrated to the MasterApe v2 smart contracts.')}
          </Text>
        </Flex>
        <Text mt="10px" weight={700}>
          {t('Migration Summary')}
        </Text>
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
                      background: location === 'pool' ? 'blue' : location === 'farm' ? 'green' : 'orange',
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
        <Text margin="30px 0px 10px 0px" weight={700}>
          {' '}
          {t('Want to earn more?')}
        </Text>
        <Link href="/maximizers" sx={{ width: '100%', color: 'primaryBright' }}>
          <Flex
            sx={{
              backgroundImage: 'url(/images/cta/maximizers-banner.svg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100px',
              borderRadius: '10px',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'primaryBright',
            }}
          >
            <Image src="/images/cta/maximizers-icon.svg" width="100px" />
            <Flex sx={{ flexDirection: 'column', mr: '10px', color: 'primaryBright' }}>
              <Text mr="50px" weight={600} size="20px">
                {t('MAXIMIZERS')}
              </Text>
              <Text weight={500} size="11px">
                {t('Maximize your yields automatically')}
              </Text>
            </Flex>
          </Flex>
        </Link>
        <Link href="/treasury-bills" sx={{ width: '100%', color: 'primaryBright' }}>
          <Flex
            sx={{
              mt: '20px',
              backgroundImage: 'url(/images/new-banners/56-treasury-bills-night.svg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100px',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '10px',
            }}
          >
            <Flex sx={{ flexDirection: 'column', ml: '30px', color: 'primaryBright' }}>
              <Text weight={600} size="20px">
                {t('BILLS')}
              </Text>
              <Text weight={500} size="11px">
                {t('Access Discounted Tokens')}
              </Text>
            </Flex>
          </Flex>
        </Link>
      </Flex>
    </Modal>
  )
}

export default React.memo(SuccessfulMigrationModal)
