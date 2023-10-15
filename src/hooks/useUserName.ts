import { useCallback, useEffect, useState } from 'react';

const SPOT_USERNAME = '_SPOT_USERNAME';

export default function useUserName() {
  const [username, _setUsername] = useState('');
  useEffect(() => {
    const v = localStorage.getItem(SPOT_USERNAME);
    if (v) {
      _setUsername(v);
    } else {
      _setUsername('User');
    }
  }, []);

  const setUsername = useCallback((u: string) => {
    _setUsername(u);
    localStorage.setItem(SPOT_USERNAME, u);
  }, []);

  return { username, setUsername };
}
