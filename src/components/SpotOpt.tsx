import Image from 'next/image';
import { useState, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export default function SpotOpt() {
  const [showDialog, setShowDialog] = useState(false);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setShowDialog(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div className=" relative" ref={ref}>
      <Image
        onClick={() => {
          setShowDialog((c) => !c);
        }}
        className="ml-3 cursor-pointer"
        src="/menu-90.png"
        alt=""
        width={40}
        height={40}
      ></Image>
      {showDialog && (
        <div className=" w-60 absolute top-14 right-0 border-primary border border-solid p-2 rounded-lg">
          <div className="flex text-center mb-4">
            <div className=" w-1/2	cursor-pointer	">
              <div className="flex justify-center">
                <Image
                  className="ml-3"
                  src="/B_TOJO.svg"
                  alt=""
                  width={40}
                  height={40}
                ></Image>
              </div>
              <div>Check-in</div>
            </div>
            <div className="w-1/2	cursor-pointer	">
              <div className="flex justify-center">
                <Image
                  className="ml-3"
                  src="/B_MEMO.svg"
                  alt=""
                  width={40}
                  height={40}
                ></Image>
              </div>
              <div>Add Live Info</div>
            </div>
          </div>
          <div className="flex text-center">
            <div className=" w-1/2 cursor-pointer		">
              <div className="flex justify-center">
                <Image
                  className="ml-3"
                  src="/B_KARAOKE.svg"
                  alt=""
                  width={40}
                  height={40}
                ></Image>
              </div>
              <div>Upload Spot</div>
            </div>
            <div className="w-1/2	cursor-pointer	">
              <div className="flex justify-center">
                <Image
                  className="ml-3"
                  src="/B_JIDOHAMBAIKI.svg"
                  alt=""
                  width={40}
                  height={40}
                ></Image>
              </div>
              <div>Mint Pass</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
