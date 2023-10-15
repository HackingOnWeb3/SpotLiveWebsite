import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
// import useAccountStore from './account'

type ITransItem = {
  hash: string;
  time: number;
  status: string;
  value: number;
  contract: string;
  name: string;
};

interface TransactionState {
  transList: ITransItem[];
  add: (item: ITransItem) => void;
  remove: (hash: string) => void;
}
type MyPersist = (
  config: StateCreator<TransactionState>,
  options: PersistOptions<TransactionState>
) => StateCreator<TransactionState>;
const useTransactionStore = create<TransactionState>(
  (persist as MyPersist)(
    (set) => ({
      transList: [
        {
          hash: '0x8f9c49ab553831fb28cea839c50efdd98c24b17ef00253772707e30a5490f345',
          time: Date.now(),
          status: 'pending',
          value: 0,
          contract: '0xCB66E1621A0ED2e2aFE24bb8E34766bB011AD14C',
          name: 'Mint',
        },
      ],
      add: (item: ITransItem) =>
        set((state) => {
          console.log('addddd', item)
          return { transList: [item, ...state.transList] };
        }),
      remove: (hash: string) =>
        set((state) => {
          return {
            transList: state.transList.filter((item) => item.hash !== hash),
          };
        }),
    }),
    {
      name: '_TRANSACTION_KEY',
    }
  )
);

export default useTransactionStore;

export function useAccountTransList() {
  const transList = useTransactionStore((state) => state.transList);
  // const account = useAccountStore((state) => state.account)
  // if (!account) {
  //   return []
  // }
  return transList; // .filter((item) => item.account === account)
}
