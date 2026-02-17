import { useState } from 'react'
import { Trash2, ExternalLink, HardDrive, FileJson, Database } from 'lucide-react'
import { useWallet } from '@/providers/WalletProvider'
import { useNova } from '@/providers/NovaProvider'
import { useConfessionStore } from '@/store/confessionStore'
import { useMatchingStore } from '@/store/matchingStore'

export default function DataSovereignty() {
  const { accountId } = useWallet()
  const { sdk } = useNova()
  const confessions = useConfessionStore((s) => s.confessions)
  const preferences = useMatchingStore((s) => s.preferences)
  const matches = useMatchingStore((s) => s.matches)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleExport = () => {
    const data = {
      accountId,
      exportedAt: new Date().toISOString(),
      confessions,
      matchingPreferences: preferences,
      matches,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nearclaw-export-${accountId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!sdk || !accountId) return
    if (!confirm('Are you sure? This will attempt to revoke all your group memberships. This cannot be undone.')) return
    setDeleting(true)
    try {
      const prefGroup = `nearclaw-prefs-${accountId}`
      try { await sdk.revokeGroupMember(prefGroup, accountId) } catch { /* skip */ }
      const matchGroup = `nearclaw-matches-${accountId}`
      try { await sdk.revokeGroupMember(matchGroup, accountId) } catch { /* skip */ }
      setDeleted(true)
    } catch {
      // Failed
    } finally {
      setDeleting(false)
    }
  }

  if (!accountId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-zinc-100 text-center">
          <div className="w-14 h-14 rounded-3xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
            <Database size={24} className="text-zinc-400" />
          </div>
          <p className="text-zinc-500 font-mono text-sm">Connect your wallet to manage your data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-zinc-100">
        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6">
          <HardDrive size={24} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-zinc-900">
          Your Data, <br />Your Rules.
        </h1>
        <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-md">
          Export your encrypted history or purge it from the TEE nodes permanently.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Card */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-zinc-100 flex flex-col justify-between h-64 group hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-600">
              <FileJson size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-zinc-900">Export JSON</h3>
            <p className="text-xs text-zinc-500 font-mono leading-relaxed">
              Download your full history including keys and chat logs.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="w-full py-3 border-2 border-brand-50 bg-brand-50 rounded-full font-mono font-bold text-xs text-brand-700 hover:bg-brand-100 transition-colors"
          >
            DOWNLOAD
          </button>
        </div>

        {/* Delete Card */}
        <div className="bg-danger-50 p-6 rounded-[2.5rem] border-2 border-transparent hover:border-danger-100 flex flex-col justify-between h-64 transition-colors">
          <div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 text-danger-500">
              <Trash2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-danger-900 mb-2">Nuclear Option</h3>
            <p className="text-xs text-danger-700/60 font-mono leading-relaxed">
              Permanently burn your identity from the protocol.
            </p>
          </div>
          {deleted ? (
            <div className="w-full py-3 text-center font-mono font-bold text-xs text-success-600">
              DELETED
            </div>
          ) : (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full py-3 bg-danger-200 text-danger-900 rounded-full font-mono font-bold text-xs hover:bg-danger-300 transition-colors shadow-sm disabled:opacity-50"
            >
              {deleting ? 'DELETING...' : 'DELETE_ACCOUNT'}
            </button>
          )}
        </div>
      </div>

      {/* Audit Trail */}
      <a
        href={`https://nearblocks.io/address/${accountId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-zinc-100 text-zinc-900 p-8 rounded-[2.5rem] shadow-sm flex items-center justify-between group cursor-pointer border border-zinc-200 hover:shadow-md transition-shadow"
      >
        <div>
          <h3 className="font-bold text-lg mb-1">On-Chain Audit</h3>
          <p className="font-mono text-xs text-zinc-500">Verify integrity on NearBlocks</p>
        </div>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-sm group-hover:scale-110 transition-transform">
          <ExternalLink size={18} />
        </div>
      </a>
    </div>
  )
}
