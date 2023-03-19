import useCurrentTime from 'hooks/useTimer'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { State } from 'state/types'
import { setMigrationPhase } from '.'
import { MigrationPhases } from './types'

export const useMigrationTimes = () => {
  return useSelector((state: State) => state.migrationTimer.data.migrationPhaseTimes)
}

export const useMonitorMigrationPhase = () => {
  const time = useCurrentTime() / 1000
  const migrationPhaseTimes = useMigrationTimes()
  const dispatch = useAppDispatch()
  if (time > migrationPhaseTimes.migrate_phase_2) {
    dispatch(setMigrationPhase(MigrationPhases.MIGRATE_PHASE_2))
    return
  }
  if (time > migrationPhaseTimes.migrate_phase_1) {
    dispatch(setMigrationPhase(MigrationPhases.MIGRATE_PHASE_1))
    return
  }
  if (time > migrationPhaseTimes.migrate_phase_0) {
    dispatch(setMigrationPhase(MigrationPhases.MIGRATE_PHASE_0))
    return
  }
}

export const useMigrationPhase = () => {
  return useSelector((state: State) => state.migrationTimer.data.migrationPhase)
}
