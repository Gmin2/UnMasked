import { create } from 'zustand'
import type { NovaSdk } from 'nova-sdk-js'
import { Buffer } from 'buffer'

export interface MatchPreferences {
  interests: string[]
  values: string[]
  dealBreakers: string
  ageRange: { min: number; max: number }
}

export interface Match {
  id: string
  compatibilityScore: number
  status: 'pending' | 'accepted' | 'rejected'
  groupId?: string
}

interface MatchingState {
  preferences: MatchPreferences | null
  matches: Match[]
  loading: boolean
  submitPreferences: (prefs: MatchPreferences, sdk: NovaSdk, accountId: string) => Promise<void>
  fetchMatches: (sdk: NovaSdk, accountId: string) => Promise<void>
  acceptMatch: (id: string) => void
  rejectMatch: (id: string) => void
}

export const useMatchingStore = create<MatchingState>((set) => ({
  preferences: null,
  matches: [],
  loading: false,

  submitPreferences: async (prefs, sdk, accountId) => {
    set({ loading: true })
    try {
      const groupId = `nearclaw-prefs-${accountId}`
      try {
        await sdk.registerGroup(groupId)
      } catch {
        // Group may already exist
      }
      const data = Buffer.from(JSON.stringify(prefs))
      await sdk.upload(groupId, data, 'preferences.json')
      set({ preferences: prefs, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchMatches: async (sdk, accountId) => {
    set({ loading: true })
    try {
      const groupId = `nearclaw-matches-${accountId}`
      const txns = await sdk.getTransactionsForGroup(groupId)
      const matches: Match[] = []

      for (const tx of txns) {
        try {
          const result = await sdk.retrieve(groupId, tx.ipfs_hash)
          const data = JSON.parse(Buffer.from(result.data).toString('utf-8'))
          matches.push(data)
        } catch {
          // Skip
        }
      }

      set({ matches, loading: false })
    } catch {
      set({ matches: [], loading: false })
    }
  },

  acceptMatch: (id) => {
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === id ? { ...m, status: 'accepted' as const } : m
      ),
    }))
  },

  rejectMatch: (id) => {
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === id ? { ...m, status: 'rejected' as const } : m
      ),
    }))
  },
}))
