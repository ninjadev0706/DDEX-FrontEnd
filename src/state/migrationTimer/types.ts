export enum MigrationPhases {
  MIGRATE_PHASE_0 = 'migrate_phase_0',
  MIGRATE_PHASE_1 = 'migrate_phase_1',
  MIGRATE_PHASE_2 = 'migrate_phase_2',
}

interface MigrationPhaseTimes {
  [MigrationPhases.MIGRATE_PHASE_0]: number
  [MigrationPhases.MIGRATE_PHASE_1]: number
  [MigrationPhases.MIGRATE_PHASE_2]: number
}

export interface MigrationTimer {
  migrationPhaseTimes: MigrationPhaseTimes
  migrationPhase: MigrationPhases
}

export interface MigrationTimerState {
  data: MigrationTimer
}
