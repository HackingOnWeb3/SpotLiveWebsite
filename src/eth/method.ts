import useAccountStore from '@/store/account'
import { getContract, getWeb3 } from '.'
import { NEXT_PUBLIC_CHAIN_RPC } from '@/utils/config'

export const checkDistance = async (contractAddr: string, params: any) => {
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.checkDistance(...params).call()
  return result
}
export const getCheckInList = async (contractAddr: string, params: any) => {
  console.log({contractAddr, params})
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.getCheckInList(...params).call()
  return result
}

export const getOriginList = async (contractAddr: string, params: any) => {
  console.log({ contractAddr, params })
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.getOriginList(...params).call()
  return result
}

export const liveEvenInfoMap = async (contractAddr: string, params: any) => {
  console.log({ contractAddr, params })
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.liveEvenInfoMap(...params).call()
  return result
}

export const scopeMap = async (contractAddr: string, params: any) => {
  console.log({ contractAddr, params })
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.scopeMap(...params).call()
  return result
}

export const getPriceByLive = async (contractAddr: string, params: any) => {
  console.log({ contractAddr, params })
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.getPriceByLive(...params).call()
  return result
}

export const getUserTokenList = async (contractAddr: string, params: any) => {
  console.log({ contractAddr, params })
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.getUserTokenList(...params).call()
  return result
}

export const tokenIdToScope = async (contractAddr: string, params: any) => {
  console.log({ contractAddr, params })
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.tokenIdToScope(...params).call()
  return result
}

export const tokenPoints = async (contractAddr: string, params: any) => {
  console.log({ contractAddr, params })
  const contract = getContract('SpotLive', contractAddr)
  const result = await contract.methods.tokenPoints(...params).call()
  return result
}


export const checkIn = async (contractAddr: string, params: any) => {
  return executeMethod('SpotLive', contractAddr, 'checkIn', params)
}

export const addLiveInfo = async (contractAddr: string, params: any) => {
  return executeMethod('SpotLive', contractAddr, 'addLiveInfo', params)
}

export const mintPASS = async (contractAddr: string, params: any) => {
  return executeMethod('SpotLive', contractAddr, 'mintPASS', params)
}



async function callRpc(method: string, params?: any) {
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1,
    }),
  }
  const rpc = NEXT_PUBLIC_CHAIN_RPC
  const res = await fetch(rpc, options)
  const response = await res.json()
  return response.result
}

async function executeMethod(
  contractName: string,
  contractAddr: string,
  methodName: string,
  params: any
) {
  console.log('params', params, methodName)
  const contract = getContract(contractName, contractAddr)
  const web3 = getWeb3()
  const functionSelector = contract.methods[methodName](...params).encodeABI()
  let estimatedGas = await web3.eth.estimateGas({
    to: contractAddr,
    data: functionSelector,
    from: useAccountStore.getState().account,
  })
  // const maxPriorityFeePerGasVal = await callRpc('eth_maxPriorityFeePerGas')
  const gasPrice = await web3.eth.getGasPrice()
  console.log(gasPrice.toString())
  const result = await contract.methods[methodName](...params).send({
    gas: Math.floor(Number(estimatedGas) * 1.2),
    from: useAccountStore.getState().account,
    gasPrice: gasPrice.toString(),
    // maxPriorityFeePerGas: maxPriorityFeePerGasVal,
  })
  useAccountStore.getState().toggleBalance()
  return result
}
