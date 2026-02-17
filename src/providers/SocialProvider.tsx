import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Social } from 'near-social-js'
import { Near, fromWalletSelector } from 'near-kit'
import { useWallet } from './WalletProvider'
import { SOCIAL_CONFIG, NETWORK_ID } from '@/config/constants'

interface SocialContextValue {
  social: Social | null
  isReady: boolean
}

const SocialContext = createContext<SocialContextValue>({ social: null, isReady: false })

export function SocialProvider({ children }: { children: ReactNode }) {
  const { selector, accountId } = useWallet()
  const [social, setSocial] = useState<Social | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!selector || !accountId) {
      // Read-only instance (no wallet for signing)
      const readOnly = new Social({
        contractId: SOCIAL_CONFIG.contractId,
        network: NETWORK_ID,
      })
      setSocial(readOnly)
      setIsReady(true)
      return
    }

    // Wallet-connected instance for read + write
    const setup = async () => {
      try {
        const wallet = await selector.wallet()
        const near = new Near({
          network: NETWORK_ID,
          wallet: fromWalletSelector(wallet),
        })
        setSocial(new Social({
          contractId: SOCIAL_CONFIG.contractId,
          near,
        }))
        setIsReady(true)
      } catch (err) {
        console.error('Failed to setup Social with wallet:', err)
        // Fallback to read-only
        setSocial(new Social({
          contractId: SOCIAL_CONFIG.contractId,
          network: NETWORK_ID,
        }))
        setIsReady(true)
      }
    }
    setup()
  }, [selector, accountId])

  return (
    <SocialContext.Provider value={{ social, isReady }}>
      {children}
    </SocialContext.Provider>
  )
}

export function useSocial() {
  return useContext(SocialContext)
}
