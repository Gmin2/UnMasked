import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Send, MoreHorizontal } from 'lucide-react'
import { useNova } from '@/providers/NovaProvider'
import { useWallet } from '@/providers/WalletProvider'
import { Buffer } from 'buffer'

const AVATAR_BASE_URL = 'https://api.dicebear.com/7.x/bottts/svg?seed='

interface Message {
  id: string
  text: string
  sender: string
  timestamp: number
}

export default function Chat() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const { sdk } = useNova()
  const { accountId } = useWallet()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const groupId = `nearclaw-chat-${matchId}`

  useEffect(() => {
    if (!sdk || !matchId) return

    const poll = async () => {
      try {
        const txns = await sdk.getTransactionsForGroup(groupId)
        const msgs: Message[] = []
        for (const tx of txns) {
          try {
            const result = await sdk.retrieve(groupId, tx.ipfs_hash)
            const data = JSON.parse(Buffer.from(result.data).toString('utf-8'))
            msgs.push(data)
          } catch {
            // Skip
          }
        }
        setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp))
      } catch {
        // Group may not exist yet
      }
    }

    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [sdk, matchId, groupId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !sdk || !accountId) return
    setSending(true)
    try {
      const msg: Message = {
        id: crypto.randomUUID(),
        text: input.trim(),
        sender: accountId,
        timestamp: Date.now(),
      }
      const data = Buffer.from(JSON.stringify(msg))
      await sdk.upload(groupId, data, `msg-${msg.id}.json`)
      setMessages((prev) => [...prev, msg])
      setInput('')
    } catch {
      // Failed to send
    } finally {
      setSending(false)
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-6 border-b border-zinc-50 flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/matches')}
            className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-900"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={`${AVATAR_BASE_URL}${matchId}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover bg-gray-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Match #{matchId?.slice(0, 8)}</h2>
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-blue-400">
                ENCRYPTED_CHANNEL
              </div>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-900">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3">
                <Send size={18} className="text-zinc-400" />
              </div>
              <p className="text-zinc-400 font-mono text-sm">No messages yet. Say hello!</p>
            </div>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender === accountId
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[70%] group">
                <div
                  className={`px-6 py-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                    isMine
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-zinc-800 rounded-bl-none border border-zinc-100 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] font-mono font-bold text-zinc-300 mt-2 ${isMine ? 'text-right' : 'text-left'}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white">
        <form
          onSubmit={handleSend}
          className="bg-zinc-50 p-2 rounded-[2rem] flex gap-2 items-center border border-zinc-100"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none px-6 py-4 focus:ring-0 outline-none text-zinc-800 placeholder-zinc-400 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
