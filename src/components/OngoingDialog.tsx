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

type IOngoingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: any
}

export default function OngoingDialog(props: IOngoingDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[625px]">
        {props.children}
      </DialogContent>
    </Dialog>
  )
}
