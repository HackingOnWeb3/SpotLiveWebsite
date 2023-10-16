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
import {
  addLiveInfo,
  checkDistance,
  checkIn,
  getCheckInList,
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

type IAddLiveInfoProps = {
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

export default function AddLiveInfo({ changeDisableClose }: IAddLiveInfoProps) {
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

  const [liveInPointList, setLiveInPointList] = useState<
    { value: string; label: string; key: string }[]
  >([])

  useEffect(() => {
    if (!account) {
      return
    }
    getCheckInList(SPOTLIVE_CONTRACT, [account])
      .then((d) => {
        setLiveInPointList(
          d.map((item: any, index: number) => {
            return {
              label: `${Number(item[0]) / 10 ** 6}, ${
                Number(item[1]) / 10 ** 6
              }`,
              key: item[4] + '_' + index,
              value: item[4] + '_' + index,
            }
          })
        )
      })
      .catch((e) => console.log('add live info'))
  }, [account, open])

  async function handleAddLiveInfo() {
    if (!liveName) {
      setShowError('Please inter Live Name')
      return
    }
    if (!selectEdCheckInPoint) {
      setShowError('Please select Check-in point')
      return
    }
    console.log({
      selectEdCheckInPoint,
      liveName,
      description,
      from: date?.from,
      to: date?.to,
    })
    setLoading(true)
    try {
      await addLiveInfo(SPOTLIVE_CONTRACT, [
        username,
        selectEdCheckInPoint.replace(/_\d$/, ''),
        liveName,
        date?.from?.getTime(),
        date?.to?.getTime(),
        description,
      ])
      setLoading(false)
      setOpen(false)
      toast.success('Add live info success!')
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error((error as any).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" w-1/2	cursor-pointer	">
        <div className="">
          <div className="flex justify-center">
            <Image
              className="ml-3"
              src="/B_MEMO.svg"
              alt=""
              width={40}
              height={40}
            ></Image>
          </div>
          <div>Add Live Info</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Live Info</DialogTitle>
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
            <Label htmlFor="YourName" className="text-right">
              Your Name
            </Label>
            <span>{username}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="Check-in point"
              className="text-right whitespace-nowrap	"
            >
              <span className=" text-red-600">*</span>Check-in point
            </Label>
            <Select
              value={selectEdCheckInPoint}
              onValueChange={(v: string) => {
                setSelectEdCheckInPoint(v)
              }}
              className="col-span-3 w-full"
            >
              <SelectTrigger className="w-[342.5px]">
                <SelectValue placeholder="Please select" />
              </SelectTrigger>
              <SelectContent>
                {liveInPointList.map((item) => {
                  return (
                    <SelectItem key={item.key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Live Name" className="text-right">
              <span className=" text-red-600">*</span>Live Name
            </Label>
            <Input
              id="Live Name"
              value={liveName}
              onChange={(e) => setLiveName(e.target.value)}
              className="col-span-3"
              placeholder="Please enter"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Period" className="text-right">
              <span className=" text-red-600">*</span>Period
            </Label>
            <div className={cn('grid gap-2', 'col-span-3')}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'w-[300px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Description" className="text-right">
              Description
            </Label>
            <Textarea
              id="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="your description here"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddLiveInfo} disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
