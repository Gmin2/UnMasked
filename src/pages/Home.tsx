import { Link, useNavigate } from 'react-router'
import { useWallet } from '@/providers/WalletProvider'
import { ArrowRight, Ghost, Shield } from 'lucide-react'

export default function Home() {
  const { accountId, signIn } = useWallet()
  const navigate = useNavigate()

  const handleConnect = async () => {
    if (accountId) {
      navigate('/confessions')
    } else {
      signIn()
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F9] font-sans text-zinc-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="bg-white pl-2 pr-6 py-2 rounded-full shadow-sm flex items-center gap-3 border border-zinc-100">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Ghost size={16} />
            </div>
            <span className="font-mono font-bold tracking-tight">NearClaw</span>
          </div>
          {accountId ? (
            <Link
              to="/confessions"
              className="bg-blue-600 text-white border border-blue-600 px-6 py-3 rounded-full font-mono text-sm font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
            >
              Enter App
            </Link>
          ) : (
            <button
              onClick={signIn}
              className="bg-blue-600 text-white border border-blue-600 px-6 py-3 rounded-full font-mono text-sm font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
            >
              Connect_Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-full text-xs font-mono font-bold mb-8 shadow-sm text-zinc-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                TEE SECURED NETWORK
              </div>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-zinc-900">
                ANONYMOUS<br />
                SOCIAL<br />
                LAYER.
              </h1>
              <p className="text-xl font-mono text-zinc-500 max-w-lg leading-relaxed">
                The first decentralized platform where your identity is mathematically hidden. Confess, match, and chat inside the Enclave.
              </p>
            </div>

            <div className="flex flex-col gap-4 items-start">
              <button
                onClick={handleConnect}
                className="group bg-blue-600 border border-blue-600 px-8 py-8 rounded-[2.5rem] text-left hover:shadow-xl hover:shadow-blue-200 hover:bg-blue-700 transition-all duration-300 w-64 md:w-72"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3 bg-blue-500 rounded-2xl group-hover:bg-blue-400 text-white transition-colors">
                    <ArrowRight size={24} />
                  </div>
                </div>
                <span className="font-mono font-bold text-lg block text-white">
                  {accountId ? 'Enter App' : 'Start App'}
                </span>
                <span className="text-blue-100 text-sm">Join the network</span>
              </button>
            </div>
          </div>

          {/* Grayscale Carousel Aesthetic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {/* Card 1: Micro UI Style Info */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 h-96 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-blue-500">01. PRIVACY</span>
                <Shield size={28} className="text-zinc-900" />
              </div>
              <div>
                <h3 className="font-bold text-3xl mb-4 text-zinc-900">Zero Knowledge.</h3>
                <p className="text-zinc-500 font-mono text-sm">
                  We use Trusted Execution Environments (TEEs) to ensure even nodes can't see your data.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-full h-2 bg-zinc-50 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Card 2: Visual Aesthetic */}
            <div className="md:col-span-2 bg-zinc-100 rounded-[2.5rem] h-96 overflow-hidden relative group">
              <img
                src="https://images.unsplash.com/photo-1496348323715-c11f0fc6afed?q=80&w=2692&auto=format&fit=crop&saturation=-100"
                alt="Abstract Architecture"
                className="w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity duration-700 mix-blend-multiply"
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end text-zinc-900">
                <h3 className="font-mono text-sm mb-2 opacity-60">CONFESSION_POOLS</h3>
                <p className="text-3xl md:text-5xl font-bold leading-tight">
                  Say what you can't say anywhere else.
                </p>
              </div>
            </div>
          </div>

          {/* Feature List / Micro UI Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'TEE Anonymity', status: 'ACTIVE' },
              { label: 'Confidential Match', status: 'BETA' },
              { label: 'E2E Encryption', status: 'ACTIVE' },
              { label: 'Data Sovereignty', status: 'ACTIVE' },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-white border border-zinc-100 rounded-3xl p-6 flex flex-col justify-between h-40 hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                  <span className="text-[10px] font-mono font-bold bg-zinc-50 text-zinc-500 px-2 py-1 rounded-full">
                    {feat.status}
                  </span>
                </div>
                <span className="font-bold text-lg leading-tight text-zinc-900">{feat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
