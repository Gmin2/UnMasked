import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, Ghost, PenTool } from 'lucide-react'
import ConfessionCard from '@/components/ConfessionCard'
import CreateConfessionModal from '@/components/CreateConfessionModal'
import { CONFESSION_POOLS } from '@/config/constants'
import { useNova } from '@/providers/NovaProvider'
import { useWallet } from '@/providers/WalletProvider'
import { useConfessionStore } from '@/store/confessionStore'

export default function PoolDetail() {
  const { poolId } = useParams<{ poolId: string }>()
  const navigate = useNavigate()
  const { sdk } = useNova()
  const { accountId } = useWallet()
  const pool = poolId ? CONFESSION_POOLS[poolId] : null
  const confessions = useConfessionStore((s) => (pool ? s.confessions[pool.id] : undefined))
  const loading = useConfessionStore((s) => s.loading)
  const fetchConfessions = useConfessionStore((s) => s.fetchConfessions)
  const [isMember, setIsMember] = useState(false)
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!sdk || !pool) return
    sdk.isAuthorized(pool.id, accountId).then(setIsMember).catch(() => setIsMember(false))
  }, [sdk, pool, accountId])

  useEffect(() => {
    if (!sdk || !pool || !isMember) return
    fetchConfessions(pool.id, sdk)
  }, [sdk, pool, isMember, fetchConfessions])

  const handleJoin = async () => {
    if (!sdk || !accountId || !pool) return
    setJoining(true)
    setJoinError('')
    try {
      // Ensure group exists (ignore error if already registered or partial failure)
      try { await sdk.registerGroup(pool.id) } catch (e) { console.warn('registerGroup:', e) }
      // Add user as member
      try { await sdk.addGroupMember(pool.id, accountId) } catch (e) { console.warn('addGroupMember:', e) }
      setIsMember(true)
    } catch (err) {
      console.error('Join pool failed:', err)
      setJoinError('Failed to join pool.')
    } finally {
      setJoining(false)
    }
  }

  if (!pool) {
    return (
      <div className="text-center py-20 font-mono text-zinc-400">
        POOL_NOT_FOUND
        <button onClick={() => navigate('/confessions')} className="block mx-auto mt-4 text-sm text-brand-600 underline">
          Back to pools
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-zinc-100 sticky top-6 z-10">
        <button
          onClick={() => navigate('/confessions')}
          className="w-12 h-12 bg-zinc-50 hover:bg-zinc-100 rounded-full flex items-center justify-center transition-colors text-zinc-900"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-xl flex items-center gap-2 text-zinc-900">
            <span>{pool.emoji}</span> {pool.name}
          </h1>
        </div>
        {!isMember && (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="px-5 py-2.5 bg-brand-600 text-white font-mono font-bold text-xs rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {joining ? 'JOINING...' : 'JOIN'}
          </button>
        )}
      </div>

      {joinError && (
        <p className="text-sm text-danger-500 text-center">{joinError}</p>
      )}

      {/* Feed */}
      {!isMember ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-zinc-100">
          <Ghost size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-zinc-400 font-mono text-sm">JOIN_POOL_TO_SEE_CONFESSIONS</p>
          <p className="text-zinc-400 text-xs mt-2">Your membership is private — only the TEE knows.</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : confessions && confessions.length > 0 ? (
        <div className="space-y-4">
          {confessions.map((confession) => (
            <ConfessionCard key={confession.id} confession={confession} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-zinc-100">
          <Ghost size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-zinc-400 font-mono text-sm">NO_CONFESSIONS_FOUND</p>
        </div>
      )}

      {/* FAB */}
      {isMember && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-brand-600 text-white border border-brand-500 rounded-[1.5rem] shadow-lg shadow-brand-200 flex items-center justify-center hover:scale-105 transition-transform z-20"
        >
          <PenTool size={24} />
        </button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && pool && (
          <CreateConfessionModal
            poolId={pool.id}
            onClose={() => setShowModal(false)}
            onSuccess={() => sdk && fetchConfessions(pool.id, sdk)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
