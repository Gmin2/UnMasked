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
  Ghost,
} from 'lucide-react'

const AVATAR_BASE_URL = 'https://api.dicebear.com/7.x/bottts/svg?seed='

const navItems = [
  { to: '/confessions', label: 'Confessions', icon: MessageSquare, count: '12' },
  { to: '/matching', label: 'Discover', icon: Search, count: null },
  { to: '/matches', label: 'Matches', icon: Heart, count: '3' },
  { to: '/profile', label: 'Profile', icon: User, count: null },
  { to: '/data', label: 'Sovereignty', icon: Database, count: null },
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
    ? accountId.length > 20
      ? `${accountId.slice(0, 18)}...`
      : accountId
    : 'Anonymous'

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100">
      <div className="flex items-center gap-4 mb-8 pl-2">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <Ghost size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-mono font-bold text-lg leading-tight text-zinc-900">NearClaw</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
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
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                <span className="font-mono text-sm">{item.label}</span>
              </div>
              {item.count && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded-full ${
                    isActive ? 'bg-white text-blue-600 shadow-sm' : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
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
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
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
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-mono font-bold text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
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
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Ghost size={16} />
          </div>
          <span className="font-mono font-bold text-zinc-900">NearClaw</span>
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
