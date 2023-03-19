import { ChainId } from '@ape.swap/sdk'

export const riskSupportedChains = [ChainId.BSC]

export const TOKEN_RISK = {
  VERY_LOW: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
}

export const TOKEN_RISK_MAPPING = {
  '5/5': TOKEN_RISK.VERY_LOW,
  '4/5': TOKEN_RISK.LOW,
  '3/5': TOKEN_RISK.MEDIUM,
  '2/5': TOKEN_RISK.HIGH,
  '1/5': TOKEN_RISK.VERY_HIGH,
}

export const TAG_COLOR: Record<number, string> = {
  [TOKEN_RISK.VERY_LOW]: '#38A611',
  [TOKEN_RISK.LOW]: '#38A611',
  [TOKEN_RISK.MEDIUM]: '#FFB300',
  [TOKEN_RISK.HIGH]: '#DF4141',
  [TOKEN_RISK.VERY_HIGH]: '#DF4141',
}

export const TOKEN_RISK_VALUES = {
  [TOKEN_RISK.VERY_LOW]: 'Very Low Risk',
  [TOKEN_RISK.LOW]: 'Low Risk',
  [TOKEN_RISK.MEDIUM]: 'Medium Risk',
  [TOKEN_RISK.HIGH]: 'High Risk',
  [TOKEN_RISK.VERY_HIGH]: 'Very High Risk',
}

export const TAG_TOKEN_RISK_VALUES = {
  [TOKEN_RISK.VERY_LOW]: 'Low Risk',
  [TOKEN_RISK.LOW]: 'Low Risk',
  [TOKEN_RISK.MEDIUM]: 'Medium Risk',
  [TOKEN_RISK.HIGH]: 'High Risk',
  [TOKEN_RISK.VERY_HIGH]: 'High Risk',
}
