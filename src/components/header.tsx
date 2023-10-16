import useAccountStore from '@/store/account';
import { useIsClient } from 'usehooks-ts';
import { Button } from './ui/button';
import { formatAddress, switchToChain } from '@/utils';
import { getEthereum } from '@/eth';
import { NEXT_PUBLIC_CHAIN_ID } from '@/utils/config';
import Image from 'next/image';
import { Badge } from './ui/badge';
import SpotOpt from './SpotOpt';
import Wallet from './Wallet';

const destChainId = NEXT_PUBLIC_CHAIN_ID;

export default function Header() {
  const { connectLoading, account, chainId, connectToWallect } =
    useAccountStore((state) => state);

  const isClient = useIsClient();

  function connect() {
    const ethereum = getEthereum();

    if (!ethereum) {
      window.open('https://metamask.io/', 'blank');
      return;
    }
    connectToWallect();
  }

  console.log('chainId', chainId)

  return (
    <header className="p-10 fixed w-full z-50	">
      <div>
        <div className="flex justify-end">
          <>
            {account && (
              <>
                {chainId === destChainId ? (
                  <>
                    <SpotOpt />
                    <Badge className="ml-3">Goerli</Badge>
                  </>
                ) : (
                  <>
                    <Button
                      className="ml-3"
                      onClick={() => switchToChain()}
                      variant={'destructive'}
                    >
                      Wrong network...
                    </Button>
                  </>
                )}
              </>
            )}
          </>
          {isClient && (
            <>
              {account ? (
                <Wallet></Wallet>
              ) : (
                <Button className="ml-3" onClick={connect}>
                  Connect
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
