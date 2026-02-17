/**
 * Mock Nova SDK — drop-in replacement when testnet is down.
 * Stores everything in memory with realistic seed data.
 * Enable via VITE_MOCK_MODE=true in .env
 */

import { Buffer } from 'buffer'

/* ---------- seed data ---------- */

const SEED_CONFESSIONS: Record<string, Array<{ text: string; timestamp: number; reactions: Record<string, number> }>> = {
  'nearclaw-crypto': [
    { text: 'I mass-sold my NEAR bag at $1.20 and bought back at $7. AMA about pain.', timestamp: Date.now() - 3_600_000 * 2, reactions: { '❤️': 12, '🔥': 34, '🤔': 5, '👻': 0 } },
    { text: 'I mass-bought a memecoin my friend launched and it rugged 20 minutes later. We are no longer friends.', timestamp: Date.now() - 3_600_000 * 5, reactions: { '❤️': 8, '🔥': 21, '🤔': 13, '👻': 2 } },
    { text: 'I pretend to understand ZK proofs in meetings. I have no idea what a polynomial commitment is.', timestamp: Date.now() - 3_600_000 * 8, reactions: { '❤️': 45, '🔥': 12, '🤔': 3, '👻': 7 } },
    { text: 'My "diversified portfolio" is 3 different NEAR ecosystem tokens.', timestamp: Date.now() - 86_400_000, reactions: { '❤️': 22, '🔥': 8, '🤔': 15, '👻': 0 } },
  ],
  'nearclaw-dating': [
    { text: 'I matched with someone on Tinder and we realized we both work at the same DAO. We pretend we don\'t know each other in governance calls.', timestamp: Date.now() - 3_600_000, reactions: { '❤️': 67, '🔥': 23, '🤔': 4, '👻': 1 } },
    { text: 'My partner thinks I\'m working late. I\'m actually yield farming.', timestamp: Date.now() - 3_600_000 * 12, reactions: { '❤️': 15, '🔥': 42, '🤔': 8, '👻': 3 } },
    { text: 'I fell in love with someone\'s Twitter persona. Met IRL. They were a bot account run by 3 people.', timestamp: Date.now() - 86_400_000 * 2, reactions: { '❤️': 31, '🔥': 55, '🤔': 19, '👻': 0 } },
  ],
  'nearclaw-life': [
    { text: 'I quit my six-figure job to build on NEAR. My parents think I joined a cult.', timestamp: Date.now() - 7_200_000, reactions: { '❤️': 89, '🔥': 45, '🤔': 7, '👻': 2 } },
    { text: 'I tell people I\'m "in tech". I\'m actually just really good at copy-pasting from Stack Overflow.', timestamp: Date.now() - 86_400_000, reactions: { '❤️': 120, '🔥': 34, '🤔': 2, '👻': 5 } },
  ],
  'nearclaw-campus': [
    { text: 'My professor asked if anyone knows what a blockchain is. I gave a 20-minute lecture. I got an F on the actual exam.', timestamp: Date.now() - 3_600_000 * 3, reactions: { '❤️': 54, '🔥': 18, '🤔': 22, '👻': 0 } },
    { text: 'I built a dApp for my thesis and my advisor said "just use a database". He was probably right.', timestamp: Date.now() - 86_400_000 * 3, reactions: { '❤️': 33, '🔥': 12, '🤔': 41, '👻': 1 } },
  ],
  'nearclaw-work': [
    { text: 'My company moved to Web3 and nobody understands what we do anymore, including the CEO.', timestamp: Date.now() - 3_600_000 * 6, reactions: { '❤️': 76, '🔥': 29, '🤔': 14, '👻': 3 } },
    { text: 'I automated my entire job with a script 6 months ago. They think I work 60 hour weeks.', timestamp: Date.now() - 86_400_000 * 2, reactions: { '❤️': 140, '🔥': 87, '🤔': 5, '👻': 11 } },
  ],
  'nearclaw-general': [
    { text: 'I accidentally sent 500 NEAR to the wrong address and told everyone it was a "strategic burn".', timestamp: Date.now() - 3_600_000 * 4, reactions: { '❤️': 28, '🔥': 65, '🤔': 12, '👻': 4 } },
    { text: 'I have 47 browser tabs open. 43 of them are blockchain explorers.', timestamp: Date.now() - 86_400_000, reactions: { '❤️': 93, '🔥': 15, '🤔': 3, '👻': 0 } },
  ],
}

const SEED_MATCHES: Array<{ id: string; compatibilityScore: number; status: 'pending' | 'accepted'; groupId?: string }> = [
  { id: 'anon-7f3a2b', compatibilityScore: 92, status: 'pending' },
  { id: 'anon-e91c4d', compatibilityScore: 87, status: 'pending' },
  { id: 'anon-1a8f5e', compatibilityScore: 78, status: 'pending' },
  { id: 'anon-c42d9a', compatibilityScore: 95, status: 'accepted', groupId: 'nearclaw-chat-anon-c42d9a' },
  { id: 'anon-b8e6f1', compatibilityScore: 83, status: 'accepted', groupId: 'nearclaw-chat-anon-b8e6f1' },
]

const SEED_MESSAGES: Record<string, Array<{ id: string; text: string; sender: string; timestamp: number }>> = {
  'nearclaw-chat-anon-c42d9a': [
    { id: 'm1', text: 'Hey! 95% match, that\'s wild 👀', sender: 'anon-c42d9a', timestamp: Date.now() - 3_600_000 * 2 },
    { id: 'm2', text: 'Right?? The TEE doesn\'t lie I guess', sender: '__SELF__', timestamp: Date.now() - 3_600_000 * 1.9 },
    { id: 'm3', text: 'So what pools are you in? I\'m guessing crypto for sure', sender: 'anon-c42d9a', timestamp: Date.now() - 3_600_000 * 1.5 },
    { id: 'm4', text: 'Lol guilty. Also life confessions. Some of those hit hard.', sender: '__SELF__', timestamp: Date.now() - 3_600_000 },
  ],
  'nearclaw-chat-anon-b8e6f1': [
    { id: 'm5', text: 'Matched! This anonymous chat thing is actually cool', sender: 'anon-b8e6f1', timestamp: Date.now() - 86_400_000 },
    { id: 'm6', text: 'Yeah encrypted channels are the way. What brings you to UnMasked?', sender: '__SELF__', timestamp: Date.now() - 82_800_000 },
  ],
}

/* ---------- in-memory store ---------- */

interface Tx { ipfs_hash: string; file_hash: string }

// deep-clone seed so mutations don't pollute originals
const confessionStore: Record<string, Array<{ text: string; timestamp: number; reactions: Record<string, number> }>> =
  JSON.parse(JSON.stringify(SEED_CONFESSIONS))

const matchStore: Record<string, typeof SEED_MATCHES> = {}

const messageStore: Record<string, Array<{ id: string; text: string; sender: string; timestamp: number }>> =
  JSON.parse(JSON.stringify(SEED_MESSAGES))

const membershipSet = new Set<string>()
const registeredGroups = new Set<string>()

let txCounter = 1000

/* ---------- mock SDK class ---------- */

export class MockNovaSdk {
  accountId: string

  constructor(accountId: string) {
    this.accountId = accountId
    // seed matches for this user
    if (!matchStore[accountId]) {
      matchStore[accountId] = JSON.parse(JSON.stringify(SEED_MATCHES))
    }
  }

  /* ---- group management ---- */

  async registerGroup(groupId: string): Promise<void> {
    registeredGroups.add(groupId)
    membershipSet.add(`${groupId}::${this.accountId}`)
  }

  async addGroupMember(groupId: string, memberId: string): Promise<void> {
    membershipSet.add(`${groupId}::${memberId}`)
  }

  async revokeGroupMember(groupId: string, memberId: string): Promise<void> {
    membershipSet.delete(`${groupId}::${memberId}`)
  }

  async isAuthorized(groupId: string, _userId?: string): Promise<boolean> {
    const uid = _userId || this.accountId
    return membershipSet.has(`${groupId}::${uid}`)
  }

  /* ---- data ---- */

  async getTransactionsForGroup(groupId: string): Promise<Tx[]> {
    // confessions
    if (confessionStore[groupId]) {
      return confessionStore[groupId].map((_, i) => ({
        ipfs_hash: `mock-ipfs-${groupId}-${i}`,
        file_hash: `mock-hash-${groupId}-${i}`,
      }))
    }

    // matches
    if (groupId.startsWith('nearclaw-matches-')) {
      const matches = matchStore[this.accountId] || []
      return matches.map((_, i) => ({
        ipfs_hash: `mock-match-${i}`,
        file_hash: `mock-mhash-${i}`,
      }))
    }

    // chat messages
    if (messageStore[groupId]) {
      return messageStore[groupId].map((_, i) => ({
        ipfs_hash: `mock-msg-${groupId}-${i}`,
        file_hash: `mock-msghash-${groupId}-${i}`,
      }))
    }

    return []
  }

  async retrieve(groupId: string, ipfsHash: string): Promise<{ data: Uint8Array }> {
    // confessions
    if (confessionStore[groupId]) {
      const idx = parseInt(ipfsHash.split('-').pop() || '0', 10)
      const item = confessionStore[groupId][idx]
      if (item) return { data: Buffer.from(JSON.stringify(item)) }
    }

    // matches
    if (groupId.startsWith('nearclaw-matches-')) {
      const matches = matchStore[this.accountId] || []
      const idx = parseInt(ipfsHash.split('-').pop() || '0', 10)
      const m = matches[idx]
      if (m) return { data: Buffer.from(JSON.stringify(m)) }
    }

    // chat messages
    if (messageStore[groupId]) {
      const idx = parseInt(ipfsHash.split('-').pop() || '0', 10)
      const msg = messageStore[groupId][idx]
      if (msg) {
        const resolved = { ...msg, sender: msg.sender === '__SELF__' ? this.accountId : msg.sender }
        return { data: Buffer.from(JSON.stringify(resolved)) }
      }
    }

    throw new Error('Not found')
  }

  async upload(groupId: string, data: Buffer | Uint8Array, _filename: string): Promise<{ cid: string; trans_id: string }> {
    const parsed = JSON.parse(Buffer.from(data).toString('utf-8'))
    const id = `mock-tx-${++txCounter}`

    // chat message
    if (groupId.startsWith('nearclaw-chat-')) {
      if (!messageStore[groupId]) messageStore[groupId] = []
      messageStore[groupId].push(parsed)
    }

    return { cid: id, trans_id: id }
  }

  /* ---- stubs ---- */
  async getGroupChecksum(_groupId: string): Promise<string> { return 'mock-checksum' }
  async estimateFee(_action: string): Promise<string> { return '0' }
}

/* ---------- helpers for relay server mock ---------- */

export function mockJoinPool(poolId: string, accountId: string) {
  membershipSet.add(`${poolId}::${accountId}`)
}

export function mockPostConfession(poolId: string, text: string) {
  if (!confessionStore[poolId]) confessionStore[poolId] = []
  confessionStore[poolId].unshift({
    text,
    timestamp: Date.now(),
    reactions: { '❤️': 0, '🔥': 0, '🤔': 0, '👻': 0 },
  })
}
