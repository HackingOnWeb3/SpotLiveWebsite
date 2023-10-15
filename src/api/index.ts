import { postFile } from './utils'

export async function upload(data: any) {
  return postFile('/upload', data, {
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  })
}

export function latlngToAddress(latlng: string) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=AIzaSyAorpo-wJa7zpUyL9-xOO33mRJ2G_i-5Es`
  )
}
