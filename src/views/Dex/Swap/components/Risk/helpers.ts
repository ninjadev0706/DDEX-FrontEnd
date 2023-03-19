import { v4 as uuid } from 'uuid'
import HmacSHA256 from 'crypto-js/hmac-sha256'
import EncodeHex from 'crypto-js/enc-hex'
import { ChainId } from '@ape.swap/sdk'
import { TOKEN_RISK_MAPPING } from './constants'

const host = 'https://avengerdao.org'
const url = '/api/v1/address-security'
const endpoint = host + url

const apeId = '0349f0caec831010f5ec0704bd11524c4810eeb6f335a7c67e1a21ea3926f4002f'
const apiKey = process.env.AVENGER_API_KEY

export const fetchRiskData = async (chainId, address_) => {
  const address = address_.toLowerCase()
  const timeStamp = new Date().valueOf().toString()
  const nonce = uuid().replaceAll('-', '')
  const body = JSON.stringify({
    chainId,
    address,
  })
  const method = 'POST'

  const hasSecret = !!apiKey

  let headers: HeadersInit = {
    'Content-Type': 'application/json;charset=UTF-8',
  }

  if (hasSecret) {
    const data = [apeId, timeStamp, nonce, method, url, body].join(';')
    const sig = EncodeHex.stringify(HmacSHA256(data, apiKey))
    headers = {
      ...headers,
      'X-Signature-appid': apeId,
      'X-Signature-timestamp': timeStamp,
      'X-Signature-nonce': nonce,
      'X-Signature-signature': sig,
    }
  }

  const response = await fetch(endpoint, {
    headers,
    body,
    method,
  })

  return await response.json()
}

export const parsedRiskData = async (chainId: ChainId, address: string) => {
  let risk
  try {
    const { data } = await fetchRiskData(chainId, address)
    risk = data?.band
  } catch (e) {
    console.info(e)
  }
  return {
    address,
    chainId,
    risk: TOKEN_RISK_MAPPING[risk],
  }
}
