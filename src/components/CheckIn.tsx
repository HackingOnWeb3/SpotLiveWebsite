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
import { checkDistance, checkIn } from '@/eth/method'
import { SPOTLIVE_CONTRACT } from '@/utils/config'
import useAccountStore from '@/store/account'

type ICheckInProps = {
  changeDisableClose: (v: boolean) => void
}

function getGeoLoaction() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position)
      },
      () => {
        reject(new Error('Unable to retrieve your location'))
      }
    )
  })
}

export default function CheckIn({ changeDisableClose }: ICheckInProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const account = useAccountStore((state) => state.account)

  useEffect(() => {
    changeDisableClose(open)
  }, [open, changeDisableClose])

  async function handleCheckIn() {
    setLoading(true)
    try {
      const { coords } = await getGeoLoaction()

      // const address = await checkDistance(SPOTLIVE_CONTRACT, [
      //   Math.floor(coords.latitude * 10 ** 6),
      //   Math.floor(coords.longitude * 10 ** 6),
      // ])

      await checkIn(SPOTLIVE_CONTRACT, [
        account,
        Math.floor(coords.latitude * 10 ** 6),
        Math.floor(coords.longitude * 10 ** 6),
        Date.now(),
        true
        // address === '0x0000000000000000000000000000000000000000',
      ])
      setLoading(false)
      setOpen(false)
      toast.success('Check in success!')
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
              onClick={() => changeDisableClose(true)}
              className="ml-3"
              src="/B_TOJO.svg"
              alt=""
              width={40}
              height={40}
            ></Image>
          </div>
          <div>Check-in</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check-in here?</DialogTitle>
          <DialogDescription>
            Check-in now, recording your attendence of the Live event.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCheckIn} disabled={loading}>
            {loading ? 'Loading...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
