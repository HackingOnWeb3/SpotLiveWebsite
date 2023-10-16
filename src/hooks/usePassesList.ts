import {
  getUserTokenList,
  liveEvenInfoMap,
  tokenIdToScope,
  tokenPoints,
} from '@/eth/method'
import useAccountStore from '@/store/account'
import { SPOTLIVE_CONTRACT } from '@/utils/config'
import { useEffect, useState } from 'react'

type PassItem = {
  num1: string
  num2: string
  name: string
  key: string
  time: string
  scopId: string
}

export default function usePassesList() {
  const { connectLoading, account, chainId, connectToWallect } =
    useAccountStore((state) => state)
  const [passesList, setPassesList] = useState<any>({})
  useEffect(() => {
    getUserTokenList(SPOTLIVE_CONTRACT, [account])
      .then((d) => {
        console.log('usePassesList', d[0])
        const res: any = {}
        d[0].forEach((item: any) => {
          if (res[item] && res[item]['key']) {
            return
          }
          res[item] = {
            num1: '0',
            num2: '10',
            name: '',
            time: '',
            key: item,
            scopId: '',
          }

          tokenIdToScope(SPOTLIVE_CONTRACT, [item])
            .then((scopId) => {
              console.log('scopId', scopId)
              res[item].scopId = scopId
              liveEvenInfoMap(SPOTLIVE_CONTRACT, [scopId])
                .then((liveInfo) => {
                  console.log('liveInfo', liveInfo)
                  res[item].name = liveInfo.symbol
                  tokenPoints(SPOTLIVE_CONTRACT, [item])
                    .then((point) => {
                      console.log('point', point)
                      res[item].num1 = point
                      setPassesList(res)
                    })
                    .catch((e) => {
                      console.log('tokenPoints')
                    })
                })
                .catch((e) => {
                  console.log('get liveInfo')
                })
            })
            .catch((e) => {
              console.log('getscopid')
            })
        })
      })
      .catch((e) => {
        console.log('getUserTokenList')
      })
  }, [account])

  return Object.keys(passesList).map((item) => {
    return passesList[item] as PassItem
  })
}
