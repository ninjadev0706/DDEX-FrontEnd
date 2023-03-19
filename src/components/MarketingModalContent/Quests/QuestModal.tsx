/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { SET_DEF_MOD_KEY, SHOW_DEF_MOD_KEY } from 'config/constants'
import useIsMobile from 'hooks/useIsMobile'
import MobileModal from './Mobile'
import DesktopModal from './Desktop'

const TelosQuestModal: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const isMobile = useIsMobile()
  const [hideDefault, setHideDefault] = useState(false)

  const sdmk = localStorage.getItem(SET_DEF_MOD_KEY)

  const alreadySet = JSON.parse(sdmk)

  const setDefaultNoShow = () => {
    if (hideDefault) {
      setHideDefault(false)
      localStorage.removeItem(SET_DEF_MOD_KEY)
    } else {
      localStorage.setItem(SET_DEF_MOD_KEY, JSON.stringify('TRUE'))
      localStorage.removeItem(SHOW_DEF_MOD_KEY)
      setHideDefault(!hideDefault)
    }
  }

  return isMobile ? (
    <MobileModal
      onDismiss={onDismiss}
      setDefaultNoShow={setDefaultNoShow}
      hideDefault={hideDefault}
      alreadySet={alreadySet}
    />
  ) : (
    <DesktopModal
      onDismiss={onDismiss}
      setDefaultNoShow={setDefaultNoShow}
      hideDefault={hideDefault}
      alreadySet={alreadySet}
    />
  )
}

export default React.memo(TelosQuestModal)
