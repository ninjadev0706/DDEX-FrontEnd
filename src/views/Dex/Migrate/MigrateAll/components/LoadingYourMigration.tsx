import React from 'react'
import Lottie from 'lottie-react'
import typingMonkey from 'config/constants/lottie/typing-monkey.json'
import { Flex, Text } from '@ape.swap/uikit'
import Dots from 'components/Loader/Dots'
import useIsMobile from 'hooks/useIsMobile'

const LoadingYourMigration: React.FC = () => {
  const isMobile = useIsMobile()
  return (
    <Flex
      sx={{
        height: '100vh',
        width: '100%',
        background: 'white1',
        borderRadius: '10px',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        mt: isMobile ? '0px' : '20px',
      }}
    >
      <Text size={isMobile ? '16px' : '30px'} weight={700}>
        Loading Your Custom Migration Experience <Dots />
      </Text>
      <Flex sx={{ width: isMobile ? '290px' : '400px' }}>
        <Lottie animationData={typingMonkey} loop />
      </Flex>
    </Flex>
  )
}

export default LoadingYourMigration
