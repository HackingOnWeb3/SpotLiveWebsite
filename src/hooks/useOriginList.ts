import { getOriginList, liveEvenInfoMap, scopeMap } from '@/eth/method'
import useAccountStore from '@/store/account'
import { SPOTLIVE_CONTRACT } from '@/utils/config'
import { useCallback, useEffect, useState } from 'react'
import { useInterval } from 'usehooks-ts'

export default function useOriginList() {
  const [originList, setList] = useState<any>([])

  const { connectLoading, account, chainId, connectToWallect } =
    useAccountStore((state) => state)

  const updateOriginList = useCallback(() => {
    if (!account) {
      return
    }
    getOriginList(SPOTLIVE_CONTRACT, [])
      .then((d) => {
        console.log(d)
        d[0].forEach((item: string) => {
          Promise.all([
            liveEvenInfoMap(SPOTLIVE_CONTRACT, [item]),
            scopeMap(SPOTLIVE_CONTRACT, [item]),
          ])
            .then((s) => {
              console.log('s', s)
              if (!s[0] || !s[1]) {
                return
              }
              setList((l: any) => {
                if (l.filter((item: any) => item.key === s[1][4]).length > 0) {
                  return l
                }
                return [
                  ...l,
                  {
                    description: s[0][4],
                    endTime: s[0][3],
                    startTime: s[0][2],
                    symbol: s[0][1],
                    // lat: s[1][0] / 10 ** 6,
                    // lng: s[1][1] / 10 ** 6,
                    status: Number(s[0][3]) > Date.now() ? 'Ongoing ' : 'End',
                    key: s[1][4],
                    lat: 30.233629,
                    lng: 120.193728,
                  },
                ]
              })
            })
            .catch((e) => {
              console.log('liveEvenInfoMap')
            })
        })
      })
      .catch((e) => {
        console.log('getoriginlist', e)
      })
  }, [account])

  useEffect(() => {
    updateOriginList()
  }, [updateOriginList])

  return {
    originList,
    updateOriginList,
  }
}
