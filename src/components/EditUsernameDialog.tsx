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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useUserName from '@/hooks/useUserName'
import { Button } from './ui/button'

type IEditUsernameDialogProps = {
  username: string
  close: (v: string) => void
}
export default function EditUsernameDialog({
  username,
  close,
}: IEditUsernameDialogProps) {
  const [value, setValue] = useState(username)
  const [error, setShowError] = useState(false)
  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        close(username)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update username</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setShowError(false)
              }}
              className="col-span-3"
            />
          </div>
          {error && <p className=" text-red-600">Please input username</p>}
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!value) {
                setShowError(true)
                return
              }
              close(value)
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
