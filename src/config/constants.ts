export const NETWORK_ID = 'testnet'

export const NOVA_CONFIG = {
  contractId: 'nova-sdk-6.testnet',
  mcpUrl: 'https://nova-mcp.fastmcp.app',
  rpcUrl: 'https://rpc.testnet.near.org',
}

export const SOCIAL_CONFIG = {
  contractId: 'v1.social08.testnet',
}

export const CONFESSION_POOLS: Record<string, { id: string; name: string; emoji: string; description: string }> = {
  crypto: { id: 'nearclaw-crypto', name: 'Crypto Confessions', emoji: '🪙', description: 'Rug pulls, moon dreams, and wallet regrets' },
  dating: { id: 'nearclaw-dating', name: 'Dating Confessions', emoji: '💘', description: 'Love, heartbreak, and everything in between' },
  life: { id: 'nearclaw-life', name: 'Life Confessions', emoji: '🌊', description: 'The stuff you can\'t tell anyone IRL' },
  campus: { id: 'nearclaw-campus', name: 'Campus Confessions', emoji: '🎓', description: 'University life unfiltered' },
  work: { id: 'nearclaw-work', name: 'Work Confessions', emoji: '💼', description: 'Office drama and career chaos' },
  general: { id: 'nearclaw-general', name: 'General', emoji: '💬', description: 'Anything goes, judgment-free zone' },
}

export const RELAY_URL = import.meta.env.VITE_RELAY_URL || 'http://localhost:3001'
