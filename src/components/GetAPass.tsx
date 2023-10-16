import { mintPASS } from "@/eth/method";
import usePassesList from "@/hooks/usePassesList";
import { SPOTLIVE_CONTRACT } from "@/utils/config";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

export default function GetAPass() {

  const [loading, setLoading] = useState(false)

  const passesList = usePassesList()
  async function handleMintPass() {


    setLoading(true)
    try {
      
      await mintPASS(SPOTLIVE_CONTRACT, [passesList[0].scopId, 1, ''])
      setLoading(false)
      toast.success('Mint success!')
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error((error as any).message)
    }
  }

  return (
    <div className=" text-center">
      <div className="flex">
        <div className="w-2/3">
          <div className="flex mb-10">
            <div className=" w-1/2">
              <div className="text-gray-400 mb-3">Total Minted Pass</div>
              <div className="text-3xl">1,245</div>
            </div>
            <div className=" w-1/2">
              <div className="text-gray-400 mb-3">
                Total Pass in Circulation
              </div>
              <div className="text-3xl">1,003</div>
            </div>
          </div>
          <div className="flex">
            <div className=" w-1/2">
              <div className="text-gray-400 mb-3">Total Holders</div>
              <div className="text-3xl">345</div>
            </div>
            <div className=" w-1/2">
              <div className="text-gray-400 mb-3">Total Value Locked</div>
              <div className="text-3xl">4,234</div>
            </div>
          </div>
        </div>
        <div className="w-1/3 border border-solid border-slate-400 rounded-lg pt-3">
          <div className=" mb-10">
            <div className="">
              <div className="text-gray-400 mb-3">Current Mint Price</div>
              <div className="text-3xl">1.33</div>
            </div>
          </div>
          <div className="">
            <div className="">
              <Button onClick={handleMintPass} disabled={loading}>
                {
                  loading ? 'Loading...' : 'Mint'
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}