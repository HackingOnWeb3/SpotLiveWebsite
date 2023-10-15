import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useInitConnectWallect } from '@/store/account'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

console.log(process.env.NEXT_PUBLIC_BUILD_ID)

export default function App({ Component, pageProps }: AppProps) {
  useInitConnectWallect()
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Toaster />
    </QueryClientProvider>
  )
}
