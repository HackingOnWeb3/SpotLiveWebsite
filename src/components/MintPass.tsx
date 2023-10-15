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
import {
  checkDistance,
  checkIn,
  getCheckInList,
  getPriceByLive,
  mintPASS,
} from '@/eth/method'
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

type IMintPassProps = {
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

export default function MintPass({ changeDisableClose }: IMintPassProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showError, setShowError] = useState('')

  const account = useAccountStore((state) => state.account)

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

  const [price, setPrice] = useState('0')

  useEffect(() => {
    if (!account || !selectEdCheckInPoint) {
      return
    }
    getPriceByLive(SPOTLIVE_CONTRACT, [selectEdCheckInPoint, 1])
      .then((d) => {
        console.log('price', d)
        setPrice(d)
      })
      .catch((e) => console.log('add live info'))
  }, [account, open, selectEdCheckInPoint])

  useEffect(() => {
    changeDisableClose(open)
  }, [open, changeDisableClose])

  const inputRef = useRef<any>()

  async function handleMintPass() {
    setLoading(true)
    try {
      await mintPASS(SPOTLIVE_CONTRACT, [selectEdCheckInPoint, 1, ''])
      setLoading(false)
      setOpen(false)
      toast.success('Mint pass success!')
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error((error as any).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" w-1/2	cursor-pointer	">
        <div>
          <div className="flex justify-center">
            <Image
              className="ml-3"
              src="/B_JIDOHAMBAIKI.svg"
              alt=""
              width={40}
              height={40}
            ></Image>
          </div>
          <div>Mint Pass</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mint Pass</DialogTitle>
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

          <div className=" text-sm text-[#377DFF] mb-0">
            You will mint 1 Pass cards from the memory for free, to adward your
            contribution.
          </div>
          <div className=" text-sm text-[#377DFF]">
            Current Pass minting price: {price}
          </div>
        </div>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleMintPass} disabled={loading}>
            {loading ? 'Loading...' : 'Mint'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
