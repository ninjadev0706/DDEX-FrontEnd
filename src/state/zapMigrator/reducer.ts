import { SmartRouter } from '@ape.swap/sdk'
import { createReducer } from '@reduxjs/toolkit'
import { Field, replaceZapMigratorState, typeInput, setMigrator } from './actions'

export interface ZapMigratorState {
  readonly independentField: Field
  readonly typedValue: string
  readonly smartRouter: SmartRouter
  readonly pairAddress: string
}

const initialState: ZapMigratorState = {
  independentField: Field.LIQUIDITY_PERCENT,
  smartRouter: null,
  pairAddress: '',
  typedValue: '0',
}

export default createReducer<ZapMigratorState>(initialState, (builder) =>
  builder
    .addCase(replaceZapMigratorState, (state, { payload: { field, typedValue, smartRouter, pairAddress } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
        smartRouter,
        pairAddress,
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(setMigrator, (state, { payload: { pairAddress, smartRouter } }) => {
      return {
        ...state,
        smartRouter,
        pairAddress,
      }
    }),
)
