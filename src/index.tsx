import { MulticallUpdater } from 'lib/state/multicall'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Providers from './Providers'
import ListsUpdater from './state/lists/updater'
import TransactionUpdater from './state/transactions/updater'
import MigrateV2Updater from './state/masterApeMigration/updater'

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <MigrateV2Updater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
      <Updaters />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
