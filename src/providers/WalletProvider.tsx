import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { WalletSelector, AccountState } from '@near-wallet-selector/core'
import { setupWalletSelector } from '@near-wallet-selector/core'
import type { WalletSelectorModal } from '@near-wallet-selector/modal-ui'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'
import { setupHereWallet } from '@near-wallet-selector/here-wallet'
import { NETWORK_ID } from '@/config/constants'
import '@near-wallet-selector/modal-ui/styles.css'

interface WalletContextValue {
  selector: WalletSelector | null
  modal: WalletSelectorModal | null
  accountId: string | null
  signIn: () => void
  signOut: () => Promise<void>
}

const WalletContext = createContext<WalletContextValue>({
  selector: null,
  modal: null,
  accountId: null,
  signIn: () => {},
  signOut: async () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null)
  const [modal, setModal] = useState<WalletSelectorModal | null>(null)
  const [accountId, setAccountId] = useState<string | null>(null)

  useEffect(() => {
    setupWalletSelector({
      network: NETWORK_ID,
      modules: [
        setupMyNearWallet(),
        setupMeteorWallet(),
        setupHereWallet(),
      ],
    }).then((sel) => {
      const m = setupModal(sel, { contractId: '' })
      setSelector(sel)
      setModal(m)

      const state = sel.store.getState()
      const active = state.accounts.find((a: AccountState) => a.active)
      if (active) setAccountId(active.accountId)

      const sub = sel.store.observable.subscribe((s) => {
        const act = s.accounts.find((a: AccountState) => a.active)
        setAccountId(act?.accountId ?? null)
      })

      return () => sub.unsubscribe()
    })
  }, [])

  const signIn = useCallback(() => {
    modal?.show()
  }, [modal])

  const signOut = useCallback(async () => {
    if (!selector) return
    const wallet = await selector.wallet()
    await wallet.signOut()
    setAccountId(null)
  }, [selector])

  return (
    <WalletContext.Provider value={{ selector, modal, accountId, signIn, signOut }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
