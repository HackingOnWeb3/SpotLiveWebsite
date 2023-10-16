import useOriginList from '@/hooks/useOriginList'
import { timeToYearMonth } from '@/utils'
import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useState } from 'react'
import MemoriesDialog from './MemoriesDialog'
import OngoingDialog from './OngoingDialog'
import Search from './Search'
import { Label } from './ui/label'

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let isInit = false

let map: any = null

const center = { lat: 30.233629, lng: 120.193728 }

export default function Map() {
  const [heatmapData, setHeatmapData] = useState<any>([])

  const [open, onOpenChange] = useState(false)
  const [openGoing, onOpenChangeGoing] = useState(false)

  const { originList } = useOriginList()

  const [c, setC] = useState(0)

  const [selectOrigin, setSelectOrigin] = useState<any>({})

  useEffect(() => {
    if (!map) {
      return
    }
    console.log('originList', originList)
    const tmpList = [...originList]
    tmpList.length = 1
    tmpList.forEach((item: any) => {
      const circle = new window.google.maps.Circle({
        strokeColor: '#1677ff',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'yellow',
        fillOpacity: 0.35,
        map,
        center: { lat: item.lat, lng: item.lng },
        radius: 200,
      })
      window.google.maps.event.addListener(circle, 'click', function () {
        console.log('click')

        if (item.status === 'Ongoing') {
          onOpenChangeGoing(true)
          setSelectOrigin(item)
        } else {
          onOpenChange(true)
        }
      })
      new window.google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: map,
        label: {
          fontWeight: 'bold',
          color: '#1677ff',
          text: `${item.symbol}, ${timeToYearMonth(
            item.startTime
          )}-${timeToYearMonth(item.endTime)}, ${item.status}`,
        },
      })
    })

    // const center1 = {
    //   ...center,
    //   lat: center.lat - 0.0005,
    // }
    // new window.google.maps.Marker({
    //   position: center1,
    //   map: map,
    //   icon: '/transparent.png',
    //   label: {
    //     color: '#506690fe',
    //     text: '2023.10.13-15',
    //     fontSize: '16px',
    //   },
    // })
    // const center2 = {
    //   ...center,
    //   lat: center.lat - 0.001,
    // }
    // new window.google.maps.Marker({
    //   position: center2,
    //   map: map,
    //   icon: '/transparent.png',
    //   label: {
    //     color: '#506690fe',
    //     fontWeight: 'bold',
    //     text: 'Ongoing',
    //     fontSize: '16px',
    //   },
    // })
  }, [originList, c])

  useEffect(() => {
    if (isInit) {
      return
    }
    isInit = true
    const loader = new Loader({
      apiKey: 'AIzaSyAorpo-wJa7zpUyL9-xOO33mRJ2G_i-5Es',
      version: 'weekly',
      libraries: ['visualization'],
    })
    loader.load().then(async () => {
      const { Map } = await window.google.maps.importLibrary('maps')
      map = new Map(document.getElementById('map') as HTMLElement, {
        center: center,
        zoom: 16,
        fullscreenControl: false,
        mapTypeControl: false,
      })
      window._map = map
      const heatmapDataTmp: any = []
      for (let index = 0; index < 20; index++) {
        const num1 = randomIntFromInterval(-100, 100) / 100000
        const num2 = randomIntFromInterval(-100, 100) / 100000
        heatmapDataTmp.push(
          new window.google.maps.LatLng(30.233629 + num1, 120.193728 + num2)
        )
        var heatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapDataTmp,
        })
        heatmap.setMap(map)
      }
      setC((c) => c + 1)
    })
  }, [])
  return (
    <div>
      <div className="w-screen	 h-screen" id="map"></div>
      <MemoriesDialog open={open} onOpenChange={onOpenChange} />
      <OngoingDialog open={openGoing} onOpenChange={onOpenChangeGoing}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Live Name:</Label>
            <span className=" font-bold">{selectOrigin.symbol}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Period:</Label>
            <span>
              {timeToYearMonth(selectOrigin.startTime)} -
              {timeToYearMonth(selectOrigin.endTime)}
            </span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description:</Label>
            <span>{selectOrigin.description}</span>
          </div>
        </div>
      </OngoingDialog>
    </div>
  )
}
