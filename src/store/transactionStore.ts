import { create, StateCreator } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
// import useAccountStore from './account'

type ITransItem = {
  hash: string
  account: string
}

interface TransactionState {
  transList: ITransItem[]
  add: (item: ITransItem) => void
  remove: (hash: string) => void
}
type MyPersist = (
  config: StateCreator<TransactionState>,
  options: PersistOptions<TransactionState>
) => StateCreator<TransactionState>
const useTransactionStore = create<TransactionState>(
  (persist as MyPersist)(
    (set) => ({
      transList: [],
      add: (item: ITransItem) =>
        set((state) => {
          return { transList: [item, ...state.transList] }
        }),
      remove: (hash: string) =>
        set((state) => {
          return {
            transList: state.transList.filter((item) => item.hash !== hash),
          }
        }),
    }),
    {
      name: '_TRANSACTION_KEY',
    }
  )
)

export default useTransactionStore

export function useAccountTransList() {
  const transList = useTransactionStore((state) => state.transList)
  // const account = useAccountStore((state) => state.account)
  // if (!account) {
  //   return []
  // }
  return transList // .filter((item) => item.account === account)
}
