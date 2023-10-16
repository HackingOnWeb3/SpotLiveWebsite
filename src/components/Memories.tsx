import usePassesList from '@/hooks/usePassesList'
import ComponentChat from './ComponentChat'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

export default function Memories() {
  const passesList = usePassesList()
  const [selectEdCheckInPoint, setSelectEdCheckInPoint] = useState('')
  const [u, setU] = useState(false)

  useEffect(() => {
    if (u) {
      return
    }
    if (passesList.length > 0) {
      setSelectEdCheckInPoint(passesList[0].key + passesList[0].name)
      setU(true)
    }
  }, [passesList, u])

  let num = '10'
  const selectItem = passesList.filter(
    (item) => item.key === selectEdCheckInPoint
  )[0]
  if (selectItem) {
    num = selectItem.num1
  }
  return (
    <div>
      <p className=" text-left">Pick your Live Pass here</p>
      <div className="flex items-center">
        <Select
          value={selectEdCheckInPoint}
          onValueChange={(v: string) => setSelectEdCheckInPoint(v)}
          className="col-span-3 w-full"
        >
          <SelectTrigger className="w-[242.5px]">
            <SelectValue placeholder="Please select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {passesList.map((item) => {
                return (
                  <SelectItem key={item.key} value={item.key + item.name}>
                    {item.name}#{item.key}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span className=" ml-2">{num} Questions Left to ask</span>
      </div>
      <ComponentChat></ComponentChat>
    </div>
  )
}
