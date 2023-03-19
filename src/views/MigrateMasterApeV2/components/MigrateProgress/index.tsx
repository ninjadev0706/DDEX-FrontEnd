import useIsMobile from 'hooks/useIsMobile'
import React, { ReactNode } from 'react'
import MigrateProgressDesktop from './MigrateProgressDesktop'
import MigrateProgressMobile from './MigrateProgressMobile'

const MigrateProgress: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile()
  return isMobile ? (
    <MigrateProgressMobile>{children}</MigrateProgressMobile>
  ) : (
    <MigrateProgressDesktop>{children}</MigrateProgressDesktop>
  )
}

export default MigrateProgress
