import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useWallet } from './WalletProvider'
import { NOVA_CONFIG } from '@/config/constants'

const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SdkLike = any

interface NovaContextValue {
  sdk: SdkLike | null
  isReady: boolean
}

const NovaContext = createContext<NovaContextValue>({ sdk: null, isReady: false })

export function NovaProvider({ children }: { children: ReactNode }) {
  const { accountId } = useWallet()
  const [sdk, setSdk] = useState<SdkLike | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!accountId) {
      setSdk(null)
      setIsReady(false)
      return
    }

    if (MOCK_MODE) {
      import('@/mock/mockSdk').then(({ MockNovaSdk }) => {
        setSdk(new MockNovaSdk(accountId))
        setIsReady(true)
      })
    } else {
      import('nova-sdk-js').then(({ NovaSdk }) => {
        const operator = import.meta.env.VITE_NOVA_OPERATOR || accountId
        const isDev = import.meta.env.DEV
        const instance = new NovaSdk(operator, {
          contractId: NOVA_CONFIG.contractId,
          mcpUrl: isDev ? '/nova-mcp' : NOVA_CONFIG.mcpUrl,
          authUrl: isDev ? '/nova-auth' : 'https://nova-auth-proxy.mintugogoi567.workers.dev',
          rpcUrl: NOVA_CONFIG.rpcUrl,
          apiKey: import.meta.env.VITE_NOVA_API_KEY || undefined,
        })
        setSdk(instance)
        setIsReady(true)
      })
    }
  }, [accountId])

  return (
    <NovaContext.Provider value={{ sdk, isReady }}>
      {children}
    </NovaContext.Provider>
  )
}

export function useNova() {
  return useContext(NovaContext)
}
