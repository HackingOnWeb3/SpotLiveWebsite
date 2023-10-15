import { NEXT_PUBLIC_API_HOST } from '@/utils/config'

const apiHost = NEXT_PUBLIC_API_HOST

export async function get(url: string, config: any = {}) {
  const response = await fetch(apiHost + url, {
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    ...config,
  })
  const res = await response.json()
  if (res.message === 'OK') {
    return res.data
  }
  throw new Error(res.message)
}

export async function postFile(url: string, data: any = {}, config: any = {}) {
  const response = await fetch(apiHost + url, {
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    ...config,
    method: 'POST',
    mode: 'cors',
    body: data,
  })
  const res = await response.text()
  return res
}
