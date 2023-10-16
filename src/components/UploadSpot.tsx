import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import toast from 'react-hot-toast'
import { checkDistance, checkIn, getCheckInList } from '@/eth/method'
import { SPOTLIVE_CONTRACT } from '@/utils/config'
import useAccountStore from '@/store/account'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useUserName from '@/hooks/useUserName'
import { Textarea } from './ui/textarea'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DateRange } from 'react-day-picker'

import { addDays, format } from 'date-fns'

import { CalendarIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { upload } from '@/api'
import useOriginList from '@/hooks/useOriginList'

type IUploadSpotProps = {
  changeDisableClose: (v: boolean) => void
}

function getGeoLoaction() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position)
      },
      () => {
        reject('Unable to retrieve your location')
      }
    )
  })
}

export default function UploadSpot({ changeDisableClose }: IUploadSpotProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showError, setShowError] = useState('')

  // live Info
  const [selectEdCheckInPoint, setSelectEdCheckInPoint] = useState('')

  const { originList, updateOriginList } = useOriginList()

  useEffect(() => {
    updateOriginList()
  }, [open, updateOriginList])

  const liveInPointList = originList.map((item: any) => {
    return {
      label: `${item.symbol}`,
      key: item.key,
      value: item.key,
    }
  })

  useEffect(() => {
    changeDisableClose(open)
  }, [open, changeDisableClose])

  const inputRef = useRef<any>()

  async function handleUploadSpot() {
    setLoading(true)
    try {
      var data = new FormData()
      data.append('file', inputRef.current.files[0])
      data.append('filename', selectEdCheckInPoint)
      const res = await upload(data)
      if (res.indexOf('success') > -1) {
        toast.success('Upload success!')
      } else {
        toast.error(res)
      }
      setLoading(false)
      setOpen(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error((error as any).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" w-1/2	cursor-pointer	">
        <div className=" ">
          <div className="flex justify-center">
            <Image
              className="ml-3"
              src="/B_KARAOKE.svg"
              alt=""
              width={40}
              height={40}
            ></Image>
          </div>
          <div>Upload Spot</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Spot</DialogTitle>
        </DialogHeader>
        {showError && (
          <Alert variant="destructive">
            <AlertTitle className="flex justify-between">
              <span>Error</span>
              <span
                className=" cursor-pointer"
                onClick={() => setShowError('')}
              >
                X
              </span>
            </AlertTitle>
            <AlertDescription>{showError}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="Check-in point"
              className="text-right whitespace-nowrap	"
            >
              <span className=" text-red-600">*</span>Live Name:
            </Label>
            <Select
              value={selectEdCheckInPoint}
              onValueChange={(v: string) => setSelectEdCheckInPoint(v)}
              id="Check-in point"
              className="col-span-3 w-full"
            >
              <SelectTrigger className="w-[342.5px]">
                <SelectValue placeholder="Please select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {liveInPointList.map((item: any) => {
                    return (
                      <SelectItem key={item.key} value={item.value}>
                        {item.label}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Live Name" className="text-right">
              <span className=" text-red-600">*</span>Materials
            </Label>
            <Input
              id="Live Name"
              type="file"
              className="col-span-3"
              placeholder="Please enter"
              ref={inputRef}
            />
          </div>
          <div className=" text-sm text-[#377DFF]">
            You will receive 1 Pass cards after the memory is created.
          </div>
        </div>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUploadSpot} disabled={loading}>
            {loading ? 'Loading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
