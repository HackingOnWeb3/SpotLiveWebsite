import { Button } from "./ui/button";

export default function GetAPass() {
  return (
    <div className=" text-center">
      <div className="flex mb-10">
        <div className=" w-1/3">
          <div className="text-gray-400 mb-3">Total Minted Pass</div>
          <div className="text-3xl">1,245</div>
        </div>
        <div className=" w-1/3">
          <div className="text-gray-400 mb-3">Total Pass in Circulation</div>
          <div className="text-3xl">1,245</div>
        </div>
        <div className=" w-1/3">
          <div className="text-gray-400 mb-3">Current Mint Price</div>
          <div className="text-3xl">1,245</div>
        </div>
      </div>
      <div className="flex">
        <div className=" w-1/3">
          <div className="text-gray-400 mb-3">Total Holders</div>
          <div className="text-3xl">1,245</div>
        </div>
        <div className=" w-1/3">
          <div className="text-gray-400 mb-3">Total Value Locked</div>
          <div className="text-3xl">1,245</div>
        </div>
        <div className=" w-1/3">
          <Button>Mint</Button>
        </div>
      </div>
    </div>
  )
}