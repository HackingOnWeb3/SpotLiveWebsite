import { create } from 'zustand'
import { getEthereum, getWeb3 } from '../eth'
import { accuracy } from '../utils'
import { IS_CONNECT_STORAGE_KEY } from '@/utils/config'
import { useEffect } from 'react'
// import { switchToChain } from '@/components/SwitchChainDialog'

interface AccountState {
  account: string
  chainId: string
  balance: number
  connectLoading: boolean
  changeAccount: (by: string) => void
  changeChainId: (by: string) => void
  disConnectToWallect: () => void
  toggleBalance: () => void
  connectToWallect: () => Promise<void>
}

export const useAccountStore = create<AccountState>((set, get) => ({
  connectLoading: false,
  account: '',
  balance: 0,
  changeAccount: (account: string) => set(() => ({ account })),
  chainId: '-1',
  changeChainId: (chainId: string) => set(() => ({ chainId })),
  connectToWallect: async () => {
    try {
      set(() => ({ connectLoading: true }))
      const ethereum = getEthereum()
      if (!ethereum) {
        set(() => ({ connectLoading: false }))
        return
      }
      let accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      const chainId = await ethereum.request({
        method: 'eth_chainId',
      })
      set(() => ({ account: accounts[0], chainId }))
      get().toggleBalance()
      localStorage.setItem(IS_CONNECT_STORAGE_KEY, '1')
      console.log(chainId)
      set(() => ({ connectLoading: false }))
    } catch (error) {
      set(() => ({ connectLoading: false }))
    }
  },
  disConnectToWallect: () => {
    localStorage.setItem(IS_CONNECT_STORAGE_KEY, '0')
    window.location.reload()
  },
  toggleBalance: async () => {
    const account = get().account
    const web3 = getWeb3()
    const balance = await web3.eth.getBalance(account)
    set(() => ({ balance: accuracy(Number(balance), 18, 6) }))
  },
}))

export default useAccountStore

export function useInitConnectWallect() {
  useEffect(() => {
    const isConnect = localStorage.getItem(IS_CONNECT_STORAGE_KEY) || '0'

    if (isConnect === '1') {
      refresh()
    }
    function refresh() {
      useAccountStore.getState().connectToWallect()
    }
    const ethereum = getEthereum()
    if (ethereum && typeof ethereum.on === 'function') {
      ethereum.on('accountsChanged', refresh)
      ethereum.on('chainChanged', refresh)
    }
  }, [])
}
