import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { useWallet } from '@/providers/WalletProvider'
import {
  MessageSquare,
  Heart,
  User,
  Database,
  LogOut,
  Search,
  Menu,
  X,
} from 'lucide-react'
import logoImg from '@/assets/logo.png'

const AVATAR_BASE_URL = 'https://api.dicebear.com/7.x/bottts/svg?seed='

const navItems = [
  { to: '/confessions', label: 'Confessions', icon: MessageSquare },
  { to: '/matching', label: 'Discover', icon: Search },
  { to: '/matches', label: 'Matches', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/data', label: 'Sovereignty', icon: Database },
]

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { accountId, signOut } = useWallet()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Don't show layout on landing page
  if (location.pathname === '/' && !accountId) {
    return <>{children}</>
  }

  const avatarSeed = accountId || 'anon'
  const displayName = accountId
    ? accountId.length > 14
      ? `${accountId.slice(0, 12)}...`
      : accountId
    : 'Anonymous'

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100">
      <div className="flex items-center gap-4 mb-8 pl-2">
        <img src={logoImg} alt="UnMasked" className="w-12 h-12 rounded-2xl" />
        <div>
          <h1 className="font-mono font-bold text-lg leading-tight text-zinc-900">UnMasked</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-zinc-400">ONLINE</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-brand-50 text-brand-600 font-bold'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                <span className="font-mono text-sm">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-zinc-100">
        <div className="bg-zinc-50 p-4 rounded-2xl flex items-center gap-3 mb-3">
          <div className="relative">
            <img
              src={`${AVATAR_BASE_URL}${avatarSeed}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-bold truncate text-zinc-900">{displayName}</p>
            <p className="text-xs text-zinc-400 font-mono truncate">
              ID: {accountId ? accountId.slice(0, 12) : 'anon'}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-mono font-bold text-zinc-400 hover:text-danger-500 hover:bg-danger-50 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          DISCONNECT
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-4 md:p-6 flex gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 sticky top-6 h-[calc(100vh-3rem)] shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-zinc-100 h-16 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="UnMasked" className="w-8 h-8 rounded-xl" />
          <span className="font-mono font-bold text-zinc-900">UnMasked</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-zinc-100 rounded-full text-zinc-900"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-zinc-900/10 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-4 left-4 bottom-4 w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 min-w-0">
        <div className="max-w-4xl mx-auto h-full">{children}</div>
      </main>
    </div>
  )
}
