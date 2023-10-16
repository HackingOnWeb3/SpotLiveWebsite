import Image from 'next/image'
import { useState } from 'react'
import { Input } from './ui/input'

export default function Search() {
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)

  return (
    <div className="fixed z-[60] p-10">
      <div className='relative'>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => {
            setFocus(false)
          }, 300)}
          placeholder="Search live"
          className="w-[300px]"
        />
        <Image src="/search.svg" alt="search" width={20} height={20} className="absolute right-2 top-[10px]"></Image>
      </div>
      {focus && (
        <div className=" bg-slate-900 text-white mt-3 rounded-md px-3 py-2">
          <div className="border-b pb-2 mb-2 text-gray-400">
            Hot in this area
          </div>
          <p className="flex justify-between cursor-pointer" onClick={() => {
            if (window._map) {
              const center = new window.google.maps.LatLng(
                30.233629,
                120.193728
              )
              // using global variable:
              window._map.panTo(center)
            }
          }}>
            <span>ETH Hangzhou</span>
            <span>100 Peoples</span>
          </p>
        </div>
      )}
    </div>
  )
}
