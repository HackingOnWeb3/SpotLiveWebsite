import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import AddLiveInfo from './AddLiveInfo'
import CheckIn from './CheckIn'
import MintPass from './MintPass'
import UploadSpot from './UploadSpot'

export default function SpotOpt() {
  const [showDialog, setShowDialog] = useState(false)
  const [disableClose, setDisableClose] = useState(false)

  const ref = useRef(null)

  const handleClickOutside = () => {
    if (disableClose) {
      return
    }
    setShowDialog(false)
  }

  useOnClickOutside(ref, handleClickOutside)

  const changeDisableClose = useCallback((v: boolean) => {
    setDisableClose(v)
  }, [])

  return (
    <div className=" relative" ref={ref}>
      <Image
        onClick={() => {
          setShowDialog((c) => !c)
        }}
        className="ml-3 cursor-pointer"
        src="/menu-90.png"
        alt=""
        width={40}
        height={40}
      ></Image>
      {showDialog && (
        <div className=" w-60 absolute top-14 right-0 border-primary border border-solid p-2 rounded-lg bg-white shadow-lg">
          <div className="flex text-center mb-4">
            <CheckIn changeDisableClose={changeDisableClose} />
            <AddLiveInfo changeDisableClose={changeDisableClose} />
          </div>
          <div className="flex text-center">
            <UploadSpot changeDisableClose={changeDisableClose} />
            <MintPass changeDisableClose={changeDisableClose} />
          </div>
        </div>
      )}
    </div>
  )
}
