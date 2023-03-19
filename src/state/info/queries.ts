// export const tokensQuery = (amount: number) => {
//   return {
//     query:
//       'query tokens { tokens(first: ' +
//       amount +
//       ', orderBy: tradeVolumeUSD orderDirection: desc) {  id name symbol tradeVolumeUSD totalLiquidity derivedETH }  }',
//   }
// }

export const tokensQuery = (amount: number, block: string, token: string) => {
  return {
    query:
      'query { tokens(subgraphError: allow, ' +
      (token !== '' ? 'where: {id:"' + token + '"}' : '') +
      (block !== '0' ? 'block: { number:' + block + '}' : '') +
      'first: ' +
      amount +
      ', orderBy: tradeVolumeUSD orderDirection: desc) {  id name symbol tradeVolumeUSD totalLiquidity derivedETH }  ' +
      '}',
  }
}

export const transactionsQuery = (amount: number, token: string) => {
  return {
    query:
      'query transactions {' +
      '    transactions(subgraphError: allow, first: ' +
      amount +
      ', orderBy: timestamp, orderDirection: desc' +
      ') {' +
      '      swaps(orderBy: timestamp, orderDirection: desc' +
      ') {' +
      '        transaction {' +
      '          id' +
      '          timestamp' +
      '        }' +
      '        pair {' +
      '          token0 {' +
      '            id' +
      '            symbol' +
      '          }' +
      '          token1 {' +
      '            id' +
      '            symbol' +
      '          }' +
      '        }' +
      '        amount0In' +
      '        amount0Out' +
      '        amount1In' +
      '        amount1Out' +
      '        amountUSD' +
      '        to' +
      '      }' +
      'mints(orderBy: timestamp, orderDirection: desc) {\n' +
      '      transaction {\n' +
      '        id\n' +
      '        timestamp\n' +
      '      }\n' +
      '      pair {\n' +
      '        token0 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '        token1 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '      }\n' +
      '      to\n' +
      '      liquidity\n' +
      '      amount0\n' +
      '      amount1\n' +
      '      amountUSD\n' +
      '      __typename\n' +
      '    }\n' +
      '    burns(orderBy: timestamp, orderDirection: desc) {\n' +
      '      transaction {\n' +
      '        id\n' +
      '        timestamp\n' +
      '      }\n' +
      '      pair {\n' +
      '        token0 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '        token1 {\n' +
      '          id\n' +
      '          symbol\n' +
      '        }\n' +
      '      }\n' +
      '      sender\n' +
      '      liquidity\n' +
      '      amount0\n' +
      '      amount1\n' +
      '      amountUSD\n' +
      '    }' +
      '    }' +
      '  }',
  }
}

export const nativePricesQuery = {
  query: 'query bundles { bundles(subgraphError: allow) {id ethPrice }}',
}

export const daysDataQuery = (oneDayBack: number) => {
  return {
    query:
      'query uniswapDayDatas {' +
      '    uniswapDayDatas(subgraphError: allow, first: 1, skip: 0, where: { date_gt: ' +
      oneDayBack +
      ' }, orderBy: date, orderDirection: asc) {' +
      '      id' +
      '      date' +
      '      totalVolumeUSD' +
      '      dailyVolumeUSD' +
      '      dailyVolumeETH' +
      '      totalLiquidityUSD' +
      '      totalLiquidityETH' +
      '      txCount' +
      '    }' +
      '  }',
  }
}

export const blocksQuery = (startTimestamp: number, currentTimestamp: number) => {
  return {
    query:
      'query blocks { blocks(subgraphError: allow, first: 1 orderBy: timestamp orderDirection: asc where: { timestamp_gt: ' +
      startTimestamp +
      ', timestamp_lt: ' +
      currentTimestamp +
      '}' +
      '    ) {' +
      '      id' +
      '      number' +
      '      timestamp' +
      '    }' +
      '  }',
  }
}

export const uniswapFactoriesQuery = (chainId: string, block: string) => {
  return {
    query:
      'query uniswapFactories { uniswapFactories(subgraphError: allow, ' +
      (block !== '0' ? 'block: { number:' + block + '}' : '') +
      ' where: {id: "' +
      chainId +
      '"}) { id totalVolumeUSD totalVolumeETH untrackedVolumeUSD totalLiquidityUSD totalLiquidityETH txCount pairCount } }',
  }
}

export const pairsQuery = (amount: number, block: string, token: string, pair: string) => {
  return {
    query:
      'query pairs { pairs: pairs(subgraphError: allow, ' +
      (pair !== '' ? 'where: {id:"' + pair + '"}' : '') +
      (block !== '0' ? 'block: { number:' + block + '}' : '') +
      'first: ' +
      amount +
      ', orderBy: trackedReserveETH, orderDirection: desc, ' +
      (token !== '' ? 'where: {token0: "' + token + '"} ' : '') +
      // (token !== '' ? 'where: {_or: [{token0: "' + token + '"}, {token1: "' + token + '"}] } ' : '') +
      ') {\n' +
      '  id\n' +
      'token0Price\n' +
      '    token1Price' +
      '  token0 {\n' +
      '    id\n' +
      '    symbol\n' +
      '    name\n' +
      '  }\n' +
      '  token1 {\n' +
      '    id\n' +
      '    symbol\n' +
      '    name\n' +
      '  }\n' +
      '  reserveUSD\n' +
      '  volumeUSD\n' +
      '  reserve0\n' +
      '  reserve1\n' +
      '  }\n' +
      (token !== ''
        ? 'pairs1: pairs(' +
          (pair !== '' ? 'where: {id:"' + pair + '"}' : '') +
          (block !== '0' ? 'block: { number:' + block + '}' : '') +
          'first: ' +
          amount +
          ', orderBy: trackedReserveETH, orderDirection: desc, ' +
          (token !== '' ? 'where: {token1: "' + token + '"} ' : '') +
          // (token !== '' ? 'where: {_or: [{token0: "' + token + '"}, {token1: "' + token + '"}] } ' : '') +
          ') {\n' +
          '  id\n' +
          'token0Price\n' +
          '    token1Price' +
          '  token0 {\n' +
          '    id\n' +
          '    symbol\n' +
          '    name\n' +
          '  }\n' +
          '  token1 {\n' +
          '    id\n' +
          '    symbol\n' +
          '    name\n' +
          '  }\n' +
          '  reserveUSD\n' +
          '  volumeUSD\n' +
          '  reserve0\n' +
          '  reserve1\n' +
          '  }\n'
        : '') +
      '}\n',
  }
}

export const tokenDaysDataQuery = (address: string, amount: number) => {
  return {
    query:
      'query tokenDayDatas {\n' +
      '  tokenDayDatas(subgraphError: allow, first: ' +
      amount +
      ' orderBy: date, orderDirection: desc, where: {token: "' +
      address +
      '"}) {\n' +
      '    id\n' +
      '    token {\n' +
      '      name\n' +
      '      symbol\n' +
      '    }\n' +
      '    date\n' +
      '    priceUSD\n' +
      '    totalLiquidityToken\n' +
      '    totalLiquidityUSD\n' +
      '    totalLiquidityETH\n' +
      '    dailyVolumeETH\n' +
      '    dailyVolumeToken\n' +
      '    dailyVolumeUSD\n' +
      '    dailyTxns\n' +
      '    __typename\n' +
      '  }\n' +
      '}',
  }
}

export const pairDaysDataQuery = (address: string, amount: number) => {
  return {
    query:
      'query pairDayDatas {\n' +
      '  pairDayDatas(subgraphError: allow, first: ' +
      amount +
      ' orderBy: date, orderDirection: desc, where: {pairAddress: "' +
      address +
      '"}) {\n' +
      ' id\n' +
      '  dailyVolumeUSD\n' +
      '  reserveUSD' +
      '  date' +
      '  }\n' +
      '}',
  }
}

export const graphQuery = (amount: number) => {
  return {
    query:
      'query uniswapDayDatas { uniswapDayDatas(subgraphError: allow, orderBy: date, orderDirection: desc first: ' +
      amount +
      ') {id date totalVolumeUSD dailyVolumeUSD dailyVolumeETH totalLiquidityUSD totalLiquidityETH } }',
  }
}
