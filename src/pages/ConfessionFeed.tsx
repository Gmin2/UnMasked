import { useNavigate } from 'react-router'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { CONFESSION_POOLS } from '@/config/constants'

// Bento grid config keyed by pool key (crypto, dating, etc.)
const gridConfig: Record<string, {
  span: string
  bgClass: string
  textClass: string
  subtext: string
  iconBgClass: string
  hoverClass: string
  buttonClass: string
}> = {
  crypto: {
    span: 'md:col-span-2 md:row-span-2',
    bgClass: 'bg-brand-600',
    textClass: 'text-white',
    subtext: 'VOLATILE_MARKETS',
    iconBgClass: 'bg-brand-500',
    hoverClass: 'hover:bg-brand-700',
    buttonClass: 'bg-brand-500 text-white',
  },
  dating: {
    span: 'md:col-span-1 md:row-span-1',
    bgClass: 'bg-[#E4E4E7]',
    textClass: 'text-zinc-900',
    subtext: 'HEARTBREAK',
    iconBgClass: 'bg-white',
    hoverClass: 'hover:bg-[#D4D4D8]',
    buttonClass: 'bg-white text-zinc-900',
  },
  life: {
    span: 'md:col-span-1 md:row-span-1',
    bgClass: 'bg-white',
    textClass: 'text-zinc-900',
    subtext: 'REALITY',
    iconBgClass: 'bg-brand-50',
    hoverClass: 'hover:shadow-md hover:border-zinc-200',
    buttonClass: 'bg-zinc-100 text-zinc-900',
  },
  campus: {
    span: 'md:col-span-1 md:row-span-1',
    bgClass: 'bg-[#F4F4F5]',
    textClass: 'text-zinc-900',
    subtext: 'ACADEMIA',
    iconBgClass: 'bg-white',
    hoverClass: 'hover:bg-[#E4E4E7]',
    buttonClass: 'bg-white text-zinc-900',
  },
  work: {
    span: 'md:col-span-1 md:row-span-1',
    bgClass: 'bg-brand-500',
    textClass: 'text-white',
    subtext: 'CORPORATE',
    iconBgClass: 'bg-brand-400',
    hoverClass: 'hover:bg-brand-600',
    buttonClass: 'bg-brand-400 text-white',
  },
  general: {
    span: 'md:col-span-1 md:row-span-1',
    bgClass: 'bg-[#E4E4E7]',
    textClass: 'text-zinc-900',
    subtext: 'EVERYTHING_ELSE',
    iconBgClass: 'bg-white',
    hoverClass: 'hover:bg-[#D4D4D8]',
    buttonClass: 'bg-white text-zinc-900',
  },
}

const defaultConfig = {
  span: 'col-span-1',
  bgClass: 'bg-white',
  textClass: 'text-zinc-900',
  iconBgClass: 'bg-zinc-50',
  subtext: 'POOL',
  hoverClass: 'hover:shadow-md',
  buttonClass: 'bg-zinc-100 text-zinc-900',
}

export default function ConfessionFeed() {
  const navigate = useNavigate()
  const poolEntries = Object.entries(CONFESSION_POOLS)

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 text-zinc-900">Confessions</h1>
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            Live Feed
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-xs font-mono font-bold flex items-center gap-2 text-zinc-900 border border-zinc-100">
            <Sparkles size={12} className="text-brand-500" /> TRENDING
          </div>
          <div className="bg-brand-50 text-brand-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-100 transition-colors cursor-pointer">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[240px] gap-4">
        {poolEntries.map(([key, pool]) => {
          const config = gridConfig[key] || defaultConfig

          return (
            <div
              key={key}
              onClick={() => navigate(`/pool/${key}`)}
              className={`
                group relative rounded-[2.5rem] p-8 cursor-pointer flex flex-col justify-between transition-all duration-300 border border-transparent
                ${config.span}
                ${config.bgClass}
                ${config.textClass}
                ${config.hoverClass}
                ${config.bgClass === 'bg-white' ? 'shadow-sm border-zinc-100' : ''}
              `}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 ${config.iconBgClass}`}
                >
                  {pool.emoji}
                </div>
                <div
                  className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 w-10 h-10 rounded-full flex items-center justify-center ${config.buttonClass}`}
                >
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Bottom Row */}
              <div>
                <span className="text-[10px] font-mono font-bold mb-3 block tracking-widest opacity-60 uppercase">
                  {config.subtext}
                </span>
                <h3 className="text-3xl font-bold leading-none tracking-tight">{pool.name}</h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
