import { create } from 'zustand'
import type { NovaSdk } from 'nova-sdk-js'
import { Buffer } from 'buffer'

export interface Confession {
  id: string
  text: string
  timestamp: number
  poolId: string
  ipfsHash: string
  reactions: Record<string, number>
}

interface ConfessionState {
  confessions: Record<string, Confession[]>
  loading: boolean
  fetchConfessions: (poolId: string, sdk: NovaSdk) => Promise<void>
  addConfession: (poolId: string, text: string) => void
  addReaction: (confessionId: string, poolId: string, reaction: string) => void
}

export const useConfessionStore = create<ConfessionState>((set, get) => ({
  confessions: {},
  loading: false,

  fetchConfessions: async (poolId, sdk) => {
    set({ loading: true })
    try {
      const txns = await sdk.getTransactionsForGroup(poolId)
      const items: Confession[] = []

      for (const tx of txns) {
        try {
          const result = await sdk.retrieve(poolId, tx.ipfs_hash)
          const text = Buffer.from(result.data).toString('utf-8')
          let parsed: { text: string; timestamp: number; reactions?: Record<string, number> }
          try {
            parsed = JSON.parse(text)
          } catch {
            parsed = { text, timestamp: Date.now() }
          }
          items.push({
            id: tx.file_hash,
            text: parsed.text,
            timestamp: parsed.timestamp,
            poolId,
            ipfsHash: tx.ipfs_hash,
            reactions: parsed.reactions || { '❤️': 0, '🔥': 0, '🤔': 0, '👻': 0 },
          })
        } catch {
          // Skip failed retrievals
        }
      }

      set((state) => ({
        confessions: { ...state.confessions, [poolId]: items },
        loading: false,
      }))
    } catch {
      set({ loading: false })
    }
  },

  addConfession: (poolId, text) => {
    const newItem: Confession = {
      id: `local-${Date.now()}`,
      text,
      timestamp: Date.now(),
      poolId,
      ipfsHash: `local-${Date.now()}`,
      reactions: { '❤️': 0, '🔥': 0, '🤔': 0, '👻': 0 },
    }
    set((state) => ({
      confessions: {
        ...state.confessions,
        [poolId]: [newItem, ...(state.confessions[poolId] || [])],
      },
    }))
  },

  addReaction: (confessionId, poolId, reaction) => {
    const poolConfessions = get().confessions[poolId] || []
    const updated = poolConfessions.map((c) =>
      c.id === confessionId
        ? { ...c, reactions: { ...c.reactions, [reaction]: (c.reactions[reaction] || 0) + 1 } }
        : c
    )
    set((state) => ({
      confessions: { ...state.confessions, [poolId]: updated },
    }))
  },
}))
