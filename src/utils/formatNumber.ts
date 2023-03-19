export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString('en-US', options)
}

// Formats a number with SI (International System of Units) sufixes
export const formatNumberSI = (number: number, digits = 2) => {
  const lookupSI = [
    { value: 1, symbol: ' ' },
    { value: 1e6, symbol: ' M' },
    { value: 1e9, symbol: ' B' },
    { value: 1e12, symbol: ' T' },
  ]
  const regEx = /\.0+$|(\.[0-9]*[1-9])0+$/

  let formatted: string
  if (number >= 1e18) {
    formatted = '∞'
  } else {
    let i: number
    for (i = lookupSI.length - 1; i > 0; i--) {
      if (number >= lookupSI[i].value) {
        break
      }
    }
    formatted = formatNumber(number / lookupSI[i].value, digits, digits).replace(regEx, '$1') + lookupSI[i].symbol
  }
  return formatted
}
