import useAccountStore from '@/store/account';

export default function Wallet() {
  const account = useAccountStore((state) => state.account);

  return (
    <div>
      <div>Wallet</div>
      <div>
        <div>{account}</div>
      </div>
      <div>
        <span>tokens</span>
        <span>Transcations</span>
      </div>
    </div>
  );
}
