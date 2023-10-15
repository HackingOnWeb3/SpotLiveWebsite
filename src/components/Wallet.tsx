import useAccountStore from '@/store/account';
import { Button } from './ui/button';
import { formatAddress } from '@/utils';

import { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTransactionStore from '@/store/transactionStore';

export default function Wallet() {
  const { account, balance } = useAccountStore((state) => state);

  const transList = useTransactionStore((state) =>
    state.transList.filter((item) => item)
  );

  const [showDialog, setShowDialog] = useState(true);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setShowDialog(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const [selectTab, setSelectTab] = useState('Passes');

  console.log(transList);

  return (
    <div className=" relative" ref={ref}>
      <Button
        className="ml-3"
        variant="outline"
        onClick={() => {
          setShowDialog((c) => !c);
        }}
      >
        {formatAddress(account)}
      </Button>
      {showDialog && (
        <div className=" w-96 h-[500px] absolute top-14 right-0 border-primary border border-solid p-2 rounded-lg">
          <div>
            <div>{formatAddress(account)}</div>
          </div>
          <div>Your Name: User1</div>
          <div className="mb-10">Balance: {balance}</div>
          <div>
            <Tabs value={selectTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger
                  onClick={() => setSelectTab('Passes')}
                  value="Passes"
                >
                  Passes
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setSelectTab('Transactions')}
                  value="Transactions"
                >
                  Transactions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Passes">
                <div>passes list</div>
              </TabsContent>
              <TabsContent value="Transactions">
                <div className=' h-[310px] overflow-y-auto'>
                  {transList.length === 0 ? (
                    <div className=" text-center mt-6 ">
                      No transactions yet
                    </div>
                  ) : (
                    <div>
                      {transList.map((item) => {
                        return (
                          <div key={item.hash} className="mb-2 bg-gray-300 rounded p-2">
                            <div>{item.time}</div>
                            <div className='flex justify-between'>
                              <div>
                                {item.name} @<Button variant={"link"}>{formatAddress(item.contract)}</Button>
                              </div>
                              {item.value ? <div>-{item.value} ETH</div> : ''}
                            </div>
                            <div>{item.status}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
