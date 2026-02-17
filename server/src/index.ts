import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { NovaSdk } from 'nova-sdk-js'
import { Buffer } from 'buffer'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = Number(process.env.PORT) || 3001
const OPERATOR_ACCOUNT = process.env.POOL_OPERATOR_ACCOUNT || 'mintug.nova-sdk-6.testnet'

function getOperatorSdk(): NovaSdk {
  return new NovaSdk(OPERATOR_ACCOUNT, {
    apiKey: process.env.NOVA_API_KEY || undefined,
    contractId: 'nova-sdk-6.testnet',
    mcpUrl: 'https://nova-mcp.fastmcp.app',
    rpcUrl: 'https://rpc.testnet.near.org',
  })
}

// POST /api/join-pool — pool operator adds member
app.post('/api/join-pool', async (req, res) => {
  const { poolId, accountId } = req.body
  if (!poolId || !accountId) {
    res.status(400).json({ error: 'Missing poolId or accountId' })
    return
  }

  try {
    const sdk = getOperatorSdk()
    // Ensure group exists
    try { await sdk.registerGroup(poolId) } catch { /* may already exist */ }
    // Add member
    await sdk.addGroupMember(poolId, accountId)
    res.json({ success: true, message: `Added ${accountId} to ${poolId}` })
  } catch (err) {
    console.error('join-pool error:', err)
    res.status(500).json({ error: 'Failed to join pool' })
  }
})

// POST /api/post-confession — strip identity, upload as pool operator
app.post('/api/post-confession', async (req, res) => {
  const { poolId, text, accountId } = req.body
  if (!poolId || !text || !accountId) {
    res.status(400).json({ error: 'Missing poolId, text, or accountId' })
    return
  }

  try {
    const sdk = getOperatorSdk()

    // Verify membership
    const authorized = await sdk.isAuthorized(poolId, accountId)
    if (!authorized) {
      res.status(403).json({ error: 'Not a member of this pool' })
      return
    }

    // Strip identity — post as operator (anonymous)
    const confession = {
      text,
      timestamp: Date.now(),
      reactions: { '❤️': 0, '🔥': 0, '🤔': 0, '👻': 0 },
    }
    const data = Buffer.from(JSON.stringify(confession))
    const result = await sdk.upload(poolId, data, `confession-${Date.now()}.json`)

    res.json({ success: true, cid: result.cid, txId: result.trans_id })
  } catch (err) {
    console.error('post-confession error:', err)
    res.status(500).json({ error: 'Failed to post confession' })
  }
})

// POST /api/anonymous-tip — relay anonymous NEAR tip
app.post('/api/anonymous-tip', async (req, res) => {
  const { confessionId, amount } = req.body
  if (!confessionId || !amount) {
    res.status(400).json({ error: 'Missing confessionId or amount' })
    return
  }

  // In production, this would use a NEAR RPC call to transfer tokens
  // For now, acknowledge the tip
  res.json({
    success: true,
    message: `Tip of ${amount} NEAR acknowledged for confession ${confessionId}`,
    note: 'Token transfer requires operator wallet signing — integrate NEAR RPC for production',
  })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', operator: OPERATOR_ACCOUNT })
})

app.listen(PORT, () => {
  console.log(`NearClaw relay server running on http://localhost:${PORT}`)
  console.log(`Operator: ${OPERATOR_ACCOUNT}`)
})
