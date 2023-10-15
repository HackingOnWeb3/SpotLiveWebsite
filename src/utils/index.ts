import { getEthereum, getWeb3, isDev } from '@/eth'
import BigNumber from 'bignumber.js'
import { NEXT_PUBLIC_CHAIN_ID, NEXT_PUBLIC_CHAIN_RPC } from './config'

export const getRandom = (length: string | number): number => {
  const num = Math.random() * Number(length)
  return parseInt(String(num), 10)
}

export const formatAddress = (address?: string) => {
  if (!address) {
    return ''
  }
  if (address.length < 10) {
    return address
  }
  return address.slice(0, 6) + '...' + address.slice(-4)
}

export const splitNumber = (num: string, decimals = 18) => {
  const _num = String(num)
  if (!num) {
    return ''
  }
  let result = _num
  if (num.includes('.')) {
    const temp = _num.split('.')
    result = temp[0] + '.' + temp[1].slice(0, decimals)
  }
  return result
}

export const accuracy = (
  num: number | string,
  decimals: number,
  fix: number,
  acc = false
): any => {
  if (Number(num) === 0 || !num) {
    return 0
  }
  const n = new BigNumber(num)
    .div(new BigNumber(10).pow(Number(decimals)))
    .toFixed(Number(fix), BigNumber.ROUND_DOWN)
  if (acc) {
    return n
  }
  return Number(n)
}

export const scala = (num: string | number, decimals: number) => {
  if (Number(num) === 0 || !num) {
    return 0
  }
  return new BigNumber(num)
    .times(new BigNumber(10).pow(Number(decimals)))
    .toFixed(0)
}

export const fixZero = (str: string | number) => {
  return String(str).replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')
}

export const toBN = (num: string | number) => {
  return new BigNumber(num)
}

export const formatBalance = (num: any, length = 6) => {
  if (!num || Number(num) === 0) {
    return 0
  }

  num = num.toString()
  let c
  if (num.toString().indexOf('.') !== -1) {
    const temp = num.split('.')
    c =
      temp[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') +
      '.' +
      temp[1].slice(0, length)
  } else {
    c = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
  return c
}

export const fixedZero = (num: string | number, decimals = 6) => {
  if (Number(num) === 0 || !num) {
    return 0
  }
  return new BigNumber(num).toFixed(Number(decimals), BigNumber.ROUND_DOWN)
}

export const checkEthAddress = (addr: string) => {
  if (!addr) {
    return false
  }
  const web3 = getWeb3()
  return web3.utils.isAddress(addr)
}

export const openBrowser = (addr: string, chain: string) => {
}

export const hashToLink = (hash: string) => {
}

export const sleep = (t: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, t)
  })
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Copyed success.')
    },
    function () {
      console.log('Copyed error.')
    }
  )
}

export async function switchToChain() {
  const toChainId = NEXT_PUBLIC_CHAIN_ID
  const toChainName = 'sepolia test'
  const toChainRpc = NEXT_PUBLIC_CHAIN_RPC
  const ethereum = getEthereum()
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: toChainId,
        },
      ],
    })
    return true
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: toChainId,
              chainName: toChainName,
              rpcUrls: [toChainRpc],
            },
          ],
        })
      } catch (addError) {
        // handle "add" error
        return false
      }
    } else {
      return false
    }
    // handle other "switch" errors
  }
}

export function timeToYearMonth(startTime: number) {
  const d = new Date(Number(startTime))
  return `${d.getMonth() + 1}.${d.getDate()}`
}