import useAccountStore from '@/store/account'
import { getContract, getWeb3 } from '.'
import { NEXT_PUBLIC_CHAIN_RPC } from '@/utils/config'

export const checkDistance = async (contractAddr: string, params: any) => {
  const contract = getContract('SpotLive', contractAddr)
  try {
    const result = await contract.methods.checkDistance(...params).call()
    return result
  } catch (error) {
    console.error('checkDistance', error)
    return false
  }
}

export const checkIn = async (contractAddr: string, params: any) => {
  return executeMethod('SpotLive', contractAddr, 'checkIn', params)
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
