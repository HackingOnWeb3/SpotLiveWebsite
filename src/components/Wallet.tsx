import useAccountStore from '@/store/account'
import { Button } from './ui/button'
import { formatAddress } from '@/utils'

import { useState, useRef, useEffect } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useTransactionStore from '@/store/transactionStore'
import Image from 'next/image'
import Jazzicon from 'react-jazzicon'
import useUserName from '@/hooks/useUserName'
import EditUsernameDialog from './EditUsernameDialog'
import usePassesList from '@/hooks/usePassesList'
import MemoriesDialog from './MemoriesDialog'

export default function Wallet() {
  const { account, balance } = useAccountStore((state) => state)

  const transList = useTransactionStore((state) =>
    state.transList.filter((item) => item)
  )

  const [showDialog, setShowDialog] = useState(false)

  const ref = useRef(null)

  const handleClickOutside = (event: MouseEvent) => {
    setShowDialog(false)
  }

  useOnClickOutside(ref, handleClickOutside)

  const [selectTab, setSelectTab] = useState('Passes')

  const { username, setUsername } = useUserName()

  const [showEeditUsername, setEditUsername] = useState(false)

  const passesList = usePassesList()

  const [open, onOpenChange] = useState(false)

  return (
    <div className=" relative" ref={ref}>
      <Button
        className="ml-3"
        variant="outline"
        onClick={() => {
          setShowDialog((c) => !c)
        }}
      >
        {formatAddress(account)}
      </Button>
      {showEeditUsername && (
        <EditUsernameDialog
          username={username}
          close={(v: string) => {
            setUsername(v)
            setEditUsername(false)
          }}
        />
      )}
      <MemoriesDialog open={open} onOpenChange={onOpenChange} />
      {showDialog && (
        <div className=" w-96 h-[500px] absolute top-14 right-0 border-primary border border-solid p-2 rounded-lg bg-white shadow-lg">
          <div className="mb-1">
            <div className="flex items-center">
              <Jazzicon diameter={30} seed={parseInt(account)} />
              <span className="pl-2">{formatAddress(account)}</span>
            </div>
          </div>
          <div className="flex items-center mb-1">
            <span className="text-sm pr-2">Your Name:</span> {username}{' '}
            <Image
              src="/edit-96.png"
              alt="edit"
              width={20}
              height={20}
              className=" cursor-pointer"
              onClick={() => {
                setShowDialog(false)
                setEditUsername(true)
              }}
            ></Image>
          </div>
          <div className="mb-6 flex items-center">
            <span className="text-sm pr-2">Balance:</span> {balance}
          </div>
          <div>
            <Tabs value={selectTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger
                  onClick={() => setSelectTab('Passes')}
                  value="Passes"
                  className="w-full"
                >
                  Passes
                </TabsTrigger>
                {/* <TabsTrigger
                  onClick={() => setSelectTab('Transactions')}
                  value="Transactions"
                >
                  Transactions
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="Passes">
                <div className=" h-[310px] overflow-y-auto">
                  {passesList.length === 0 ? (
                    <div className=" text-center mt-6 ">No passes yet</div>
                  ) : (
                    <div>
                      {passesList.map((item) => {
                        return (
                          <div
                            key={item.key}
                            className="mb-2 bg-gray-300 rounded p-2"
                          >
                            <div className="mb-2">
                              {item.name} #{item.key}
                            </div>
                            <div className="mb-2">
                              {item.num1}/{item.num2} question left
                            </div>
                            <div>
                              <Button
                                className=" mr-2"
                                onClick={() => onOpenChange(true)}
                              >
                                Ask
                              </Button>
                              <Button disabled>Recharge</Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="Transactions">
                <div className=" h-[310px] overflow-y-auto">
                  {transList.length === 0 ? (
                    <div className=" text-center mt-6 ">
                      No transactions yet
                    </div>
                  ) : (
                    <div>
                      {transList.map((item) => {
                        return (
                          <div
                            key={item.hash}
                            className="mb-2 bg-gray-300 rounded p-2"
                          >
                            <div>{item.time}</div>
                            <div className="flex justify-between">
                              <div>
                                <span className=" font-bold">{item.name}</span>
                                <Button variant={'link'}>
                                  @{formatAddress(item.contract)}
                                </Button>
                              </div>
                              {item.value ? <div>-{item.value} ETH</div> : ''}
                            </div>
                            {item.status === 'pending' && (
                              <div className=" text-blue-500">
                                {item.status}
                              </div>
                            )}
                            {item.status === 'success' && (
                              <div className=" text-green-500">
                                {item.status}
                              </div>
                            )}
                            {item.status === 'error' && (
                              <div className=" text-red-500">{item.status}</div>
                            )}
                          </div>
                        )
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
  )
}
