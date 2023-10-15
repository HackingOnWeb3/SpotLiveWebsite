import Web3 from 'web3'
import tokenAbi from './abi-token'
import spotLiveAbi from './abi-SpotLive'

export let web3: Web3

export const isDev = process.env.NODE_ENV === 'development'

export function getEthereum() {
  return window.ethereum
}

/**
 * @returns {web3} @type [object]
 * @throws code: 1, code: 2
 */
export const getWeb3 = (): Web3 => {
  if (web3) {
    return web3
  }
  const ethereum = getEthereum()
  if (ethereum) {
    web3 = new Web3(ethereum)
    window.web3 = web3
  } else {
    throw { code: 2, message: 'Not Install Metamask' }
  }
  return web3
}

/**
 * @param {name} @requires @type [string] contract name
 * @returns {web3.eth.contract} @type [object] contract instance
 * @throws {code: 1, code: 2}
 */
export const getContract = (name: string, tokenAddr: string) => {
  let contract: any
  let web3 = getWeb3()
  if (!web3) {
  }
  if (!web3) {
    throw { code: 2 }
  }

  if (name === 'token') {
    contract = new web3.eth.Contract(tokenAbi as any, tokenAddr)
    return contract
  }

  if (name === 'SpotLive') {
    contract = new web3.eth.Contract(spotLiveAbi as any, tokenAddr)
    return contract
  }

  throw { code: 1, message: 'unknow contract name' }
}
