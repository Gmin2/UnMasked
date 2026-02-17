import { Heart, Flame, HelpCircle, Ghost } from 'lucide-react'
import type { Confession } from '@/store/confessionStore'
import { useConfessionStore } from '@/store/confessionStore'

const reactionConfig = [
  { key: '❤️', icon: Heart, activeColor: 'hover:bg-danger-50 hover:text-danger-500' },
  { key: '🔥', icon: Flame, activeColor: 'hover:bg-warn-50 hover:text-warn-500' },
  { key: '🤔', icon: HelpCircle, activeColor: 'hover:bg-brand-50 hover:text-brand-500' },
] as const

export default function ConfessionCard({ confession }: { confession: Confession }) {
  const addReaction = useConfessionStore((s) => s.addReaction)
  const timeAgo = getTimeAgo(confession.timestamp)

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-400">
          <Ghost size={14} />
        </div>
        <span className="text-xs font-mono font-bold text-zinc-400">{timeAgo}</span>
      </div>

      <p className="text-2xl font-medium leading-relaxed mb-8 text-zinc-900">
        {confession.text}
      </p>

      <div className="flex gap-2">
        {reactionConfig.map(({ key, icon: Icon, activeColor }) => (
          <button
            key={key}
            onClick={() => addReaction(confession.id, confession.poolId, key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors bg-zinc-50 text-zinc-400 group ${activeColor}`}
          >
            <Icon size={18} className="transition-colors" />
            <span className="text-xs font-mono font-bold transition-colors">
              {confession.reactions[key] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
