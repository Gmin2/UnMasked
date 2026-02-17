import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Check } from 'lucide-react'
import { Buffer } from 'buffer'
import { useWallet } from '@/providers/WalletProvider'
import { useNova } from '@/providers/NovaProvider'
import { useConfessionStore } from '@/store/confessionStore'

interface Props {
  poolId: string
  onClose: () => void
  onSuccess: () => void
}

export default function CreateConfessionModal({ poolId, onClose, onSuccess }: Props) {
  const { accountId } = useWallet()
  const { sdk } = useNova()
  const addConfession = useConfessionStore((s) => s.addConfession)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !accountId || !sdk) return
    setSubmitting(true)
    setError('')

    try {
      const confessionData = {
        text: text.trim(),
        timestamp: Date.now(),
        reactions: { '❤️': 0, '🔥': 0, '🤔': 0, '👻': 0 },
      }
      const data = Buffer.from(JSON.stringify(confessionData))
      await sdk.upload(poolId, data, 'confession.json')
      addConfession(poolId, text.trim())
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch {
      setError('Failed to post confession. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-brand-950/20 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-xl border border-zinc-100 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-success-500" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Posted anonymously</h3>
            <p className="text-sm text-zinc-500 font-mono">Your identity is safe with TEE encryption.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-mono text-zinc-900">NEW_CONFESSION</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-900"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 500))}
                  placeholder="What's your secret?"
                  className="w-full h-48 p-6 bg-zinc-50 rounded-[2rem] border-2 border-transparent focus:border-brand-200 outline-none resize-none text-lg font-medium placeholder-zinc-400 text-zinc-900"
                  maxLength={500}
                />
                <div className="absolute bottom-6 right-6 text-[10px] font-mono font-bold text-zinc-400 bg-white px-3 py-1 rounded-full shadow-sm">
                  {text.length}/500
                </div>
              </div>

              {error && <p className="text-sm text-danger-500 mb-4 text-center">{error}</p>}

              <button
                type="submit"
                disabled={!text.trim() || submitting}
                className="w-full py-4 bg-brand-600 text-white rounded-[1.5rem] font-mono font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    POST_ANONYMOUSLY <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
