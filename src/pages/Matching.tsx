import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Filter, Sparkles, Shield, Check } from 'lucide-react'
import { useNova } from '@/providers/NovaProvider'
import { useWallet } from '@/providers/WalletProvider'
import { useMatchingStore } from '@/store/matchingStore'

const availableInterests = ['Technology', 'Arts', 'Sports', 'Music', 'Travel', 'Gaming', 'Crypto', 'Science', 'Cooking', 'Fitness']
const availableValues = ['Honesty', 'Loyalty', 'Adventure', 'Creativity', 'Humor', 'Ambition', 'Kindness', 'Intelligence', 'Independence', 'Empathy']

export default function Matching() {
  const navigate = useNavigate()
  const { sdk } = useNova()
  const { accountId } = useWallet()
  const { submitPreferences, loading } = useMatchingStore()

  const [interests, setInterests] = useState<string[]>([])
  const [values, setValues] = useState<string[]>([])
  const [dealBreakers, setDealBreakers] = useState('')
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(99)
  const [submitted, setSubmitted] = useState(false)

  const toggleSelection = (item: string, current: string[], setter: (i: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item))
    } else {
      setter([...current, item])
    }
  }

  const handleSubmit = async () => {
    if (!sdk || !accountId) return
    await submitPreferences(
      { interests, values, dealBreakers, ageRange: { min: ageMin, max: ageMax } },
      sdk,
      accountId
    )
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-zinc-100 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-success-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Preferences Encrypted</h2>
          <p className="text-zinc-500 font-mono text-xs mb-4">
            Your preferences have been encrypted with Nova TEE and uploaded.
          </p>
          <button
            onClick={() => navigate('/matches')}
            className="px-6 py-3 bg-brand-600 text-white rounded-full font-mono font-bold text-xs hover:bg-brand-700 transition-colors"
          >
            VIEW_MATCHES
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] text-center shadow-sm border border-zinc-100">
        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600">
          <Filter size={24} />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">Discovery</h1>
        <p className="text-zinc-500 font-mono text-xs">
          Set your preferences. We verify matches inside TEEs.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 p-2">
        {/* Interests */}
        <div className="p-8 pb-4">
          <h2 className="text-sm font-mono font-bold text-zinc-400 mb-6 flex items-center gap-2">
            <Sparkles size={16} /> INTERESTS
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((item) => (
              <button
                key={item}
                onClick={() => toggleSelection(item, interests, setInterests)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all border ${
                  interests.includes(item)
                    ? 'bg-brand-50 text-brand-700 border-brand-200'
                    : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-zinc-50 mx-auto max-w-[90%]"></div>

        {/* Values */}
        <div className="p-8 pb-4">
          <h2 className="text-sm font-mono font-bold text-zinc-400 mb-6 flex items-center gap-2">
            <Shield size={16} /> VALUES
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableValues.map((item) => (
              <button
                key={item}
                onClick={() => toggleSelection(item, values, setValues)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all border ${
                  values.includes(item)
                    ? 'bg-brand-50 text-brand-700 border-brand-200'
                    : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-zinc-50 mx-auto max-w-[90%]"></div>

        {/* Age Range */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-mono font-bold text-zinc-400">AGE_RANGE</h2>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              {ageMin} - {ageMax}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value))}
              min={18}
              max={99}
              className="w-20 px-4 py-3 bg-zinc-50 rounded-xl text-center font-bold text-zinc-900 border-2 border-transparent focus:border-brand-200 outline-none"
            />
            <span className="text-zinc-400">—</span>
            <input
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value))}
              min={18}
              max={99}
              className="w-20 px-4 py-3 bg-zinc-50 rounded-xl text-center font-bold text-zinc-900 border-2 border-transparent focus:border-brand-200 outline-none"
            />
          </div>
        </div>

        <div className="w-full h-px bg-zinc-50 mx-auto max-w-[90%]"></div>

        {/* Deal Breakers */}
        <div className="p-8 pb-4">
          <h2 className="text-sm font-mono font-bold text-zinc-400 mb-6">DEAL_BREAKERS</h2>
          <textarea
            value={dealBreakers}
            onChange={(e) => setDealBreakers(e.target.value)}
            placeholder="Anything that's a hard no..."
            className="w-full px-6 py-4 bg-zinc-50 rounded-[1.5rem] font-medium text-zinc-900 border-2 border-transparent focus:border-brand-200 outline-none resize-none h-24 placeholder-zinc-400"
          />
        </div>

        {/* Submit */}
        <div className="p-2">
          <button
            onClick={handleSubmit}
            disabled={loading || interests.length === 0}
            className="w-full py-5 bg-brand-600 text-white font-mono font-bold text-sm rounded-[2rem] hover:bg-brand-700 transition-all border border-brand-600 shadow-sm shadow-brand-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'START_MATCHING'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
