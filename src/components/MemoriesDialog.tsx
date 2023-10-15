import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import GetAPass from './GetAPass'
import Memories from './Memories'

type IMemoriesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MemoriesDialog(props: IMemoriesDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[625px]">
        <Tabs defaultValue="Memories" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-1/3" value="Memories">
              Memories
            </TabsTrigger>
            <TabsTrigger className="w-1/3" value="Get a Pass">
              Get a Pass
            </TabsTrigger>
            <TabsTrigger className="w-1/3" value="Pass Market">
              Pass Market
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Memories">
            <div className=" text-center min-h-[500px] pt-10">
              <Memories />
            </div>
          </TabsContent>
          <TabsContent value="Get a Pass">
            <div className=" text-center min-h-[500px] pt-10">
              <GetAPass />
            </div>
          </TabsContent>
          <TabsContent value="Pass Market">
            <div className=" text-center min-h-[500px] pt-10">
              <div className=" flex justify-center ">
                <Image
                  src="/u115.png"
                  alt="Under development"
                  width={448}
                  height={448}
                ></Image>
              </div>
              <p className="mt-6 text-gray-400">
                Under development, please stay tuned.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
