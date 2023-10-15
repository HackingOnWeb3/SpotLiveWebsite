import useAccountStore from '@/store/account';
import { useIsClient } from 'usehooks-ts';
import { Button } from './ui/button';
import { formatAddress, switchToChain } from '@/utils';
import { getEthereum } from '@/eth';

const destChainId = process.env.NEXT_PUBLIC_CHAIN_ID || '';

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

  return (
    <header className="p-10">
      <div className="flex justify-between">
        <div className="flex">
          <div>
            {account && (
              <div>
                {chainId === destChainId ? (
                  'ok'
                ) : (
                  <div onClick={() => switchToChain()}>unsupported.</div>
                )}
              </div>
            )}
          </div>
          {isClient && (
            <>{account ? formatAddress(account) : <Button>Connect</Button>}</>
          )}
        </div>
      </div>
    </header>
  );
}
