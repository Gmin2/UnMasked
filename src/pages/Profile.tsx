import { useEffect, useState } from 'react'
import { Camera, Save, QrCode, User } from 'lucide-react'
import { useWallet } from '@/providers/WalletProvider'
import { useSocial } from '@/providers/SocialProvider'

const AVATAR_BASE_URL = 'https://api.dicebear.com/7.x/bottts/svg?seed='

interface ProfileData {
  name: string
  description: string
  imageUrl: string
}

export default function Profile() {
  const { accountId } = useWallet()
  const { social } = useSocial()
  const [profile, setProfile] = useState<ProfileData>({ name: '', description: '', imageUrl: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!social || !accountId) return

    social
      .getProfile(accountId)
      .then((p) => {
        if (p) {
          setProfile({
            name: p.name || '',
            description: p.description || '',
            imageUrl: (p.image as { url?: string })?.url || '',
          })
        }
      })
      .catch(() => {})
  }, [social, accountId])

  const handleSave = async () => {
    if (!social || !accountId) return
    setSaving(true)
    setError('')
    try {
      const txBuilder = await social.setProfile(accountId, {
        name: profile.name,
        description: profile.description,
        image: profile.imageUrl ? { url: profile.imageUrl } : undefined,
      })
      await txBuilder.send()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Profile save failed:', err)
      setError('Failed to save profile. Make sure your wallet is connected.')
    } finally {
      setSaving(false)
    }
  }

  if (!accountId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-zinc-100 text-center">
          <div className="w-14 h-14 rounded-3xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
            <User size={24} className="text-zinc-400" />
          </div>
          <p className="text-zinc-500 font-mono text-sm">Connect your wallet to view your profile.</p>
        </div>
      </div>
    )
  }

  const avatarUrl = profile.imageUrl || `${AVATAR_BASE_URL}${accountId}`
  const displayName = profile.name || accountId

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Avatar Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 text-center">
        <div className="inline-block relative mb-6">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-32 h-32 rounded-[2rem] border-4 border-blue-50 object-cover shadow-inner bg-gray-100"
          />
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-zinc-100 text-zinc-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
            <Camera size={16} />
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-zinc-900">{displayName}</h1>
        <div className="inline-block px-3 py-1 bg-blue-50 rounded-full text-[10px] font-mono font-bold text-blue-700 border border-blue-100">
          ID: {accountId.slice(0, 16)}
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg text-zinc-900">Details</h2>
          <QrCode size={20} className="text-zinc-300" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-400 mb-2 pl-4">DISPLAY_NAME</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Anonymous"
              className="w-full px-6 py-4 bg-zinc-50 rounded-[1.5rem] font-bold text-zinc-900 border-2 border-transparent focus:border-blue-200 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-400 mb-2 pl-4">BIO</label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              placeholder="Tell the world about yourself..."
              className="w-full px-6 py-4 bg-zinc-50 rounded-[1.5rem] font-medium text-zinc-900 border-2 border-transparent focus:border-blue-200 outline-none transition-colors resize-none h-32"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-400 mb-2 pl-4">IMAGE_URL</label>
            <input
              type="text"
              value={profile.imageUrl}
              onChange={(e) => setProfile({ ...profile, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-6 py-4 bg-zinc-50 rounded-[1.5rem] font-medium text-zinc-900 border-2 border-transparent focus:border-blue-200 outline-none transition-colors"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-blue-600 text-white border border-blue-600 rounded-[1.5rem] font-mono font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saved ? (
            'SAVED!'
          ) : (
            <>
              SAVE_CHANGES <Save size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
