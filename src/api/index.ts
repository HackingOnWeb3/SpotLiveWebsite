import { post } from './utils'

export async function test() {
  return post('/v1/test', {})
}

export function latlngToAddress(latlng: string) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=AIzaSyAorpo-wJa7zpUyL9-xOO33mRJ2G_i-5Es`
  )
}
