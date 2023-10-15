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
import { useEffect, useState } from 'react'
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

  const account = useAccountStore((state) => state.account)

  const { username } = useUserName()

  // live Info
  const [selectEdCheckInPoint, setSelectEdCheckInPoint] = useState('')
  const [liveName, setLiveName] = useState('')

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 15),
    to: addDays(new Date(2023, 9, 15), 20),
  })

  const [description, setDescription] = useState('')

  useEffect(() => {
    changeDisableClose(open)
  }, [open, changeDisableClose])

  useEffect(() => {
    setShowError('')
  }, [selectEdCheckInPoint, liveName])

  useEffect(() => {
    if (!account) {
      return
    }
    getCheckInList(SPOTLIVE_CONTRACT, [account])
      .then((d) => {
        console.log('check in list', d[0], d[1])
      })
      .catch((e) => console.log(e))
  }, [account, open])

  async function handleUploadSpot() {
    if (!liveName) {
      setShowError('Please inter Live Name')
      return
    }
    if (!selectEdCheckInPoint) {
      setShowError('Please select Check-in point')
      return
    }
    setLoading(true)
    try {
      const { coords } = await getGeoLoaction()

      const address = await checkDistance(SPOTLIVE_CONTRACT, [
        Math.floor(coords.latitude * 10 ** 6),
        Math.floor(coords.longitude * 10 ** 6),
      ])

      await checkIn(SPOTLIVE_CONTRACT, [
        account,
        Math.floor(coords.latitude * 10 ** 6),
        Math.floor(coords.longitude * 10 ** 6),
        Date.now(),
        address === '0x0000000000000000000000000000000000000000',
      ])
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
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
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
              value={liveName}
              type="file"
              onChange={(e) => setLiveName(e.target.value)}
              className="col-span-3"
              placeholder="Please enter"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUploadSpot} disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
