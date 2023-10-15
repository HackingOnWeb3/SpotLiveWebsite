import { Loader } from '@googlemaps/js-api-loader'
import { useEffect } from 'react'

export default function Map() {
  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyAorpo-wJa7zpUyL9-xOO33mRJ2G_i-5Es',
      version: 'weekly',
    })
    loader.load().then(async () => {
      const { Map } = await window.google.maps.importLibrary('maps')
      const map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 30.233629, lng: 120.193728 },
        zoom: 16,
        fullscreenControl: false,
        mapTypeControl: false,
      })
    })
  }, [])
  return <div className="w-screen	 h-screen	bg-slate-600" id="map"></div>
}
