import useAccountStore from '@/store/account'
import { getContract, getWeb3 } from '.'

export const test = async (
  contractAddr: string,
  account: string
) => {
  const contract = getContract('test', contractAddr)
  try {
    const result: any = await contract.methods.test().call()
    return result.toLowerCase() === account.toLowerCase()
  } catch (error) {
    console.error('test', error)
    return false
  }
}

export const setTest = async (contractAddr: string, params: any) => {
  return executeMethod('test', contractAddr, 'setTest', params)
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
  const rpc = process.env.NEXT_PUBLIC_CHAIN_RPC || ''
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
  const maxPriorityFeePerGasVal = await callRpc('eth_maxPriorityFeePerGas')

  const result = await contract.methods[methodName](...params).send({
    gas: Math.floor(Number(estimatedGas) * 1.2),
    from: useAccountStore.getState().account,
    maxPriorityFeePerGas: maxPriorityFeePerGasVal,
  })
  useAccountStore.getState().toggleBalance()
  return result
}
