import { BrowserRouter, Routes, Route, useLocation } from 'react-router'
import { WalletProvider } from '@/providers/WalletProvider'
import { NovaProvider } from '@/providers/NovaProvider'
import { SocialProvider } from '@/providers/SocialProvider'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from '@/components/Navigation'
import Home from '@/pages/Home'
import ConfessionFeed from '@/pages/ConfessionFeed'
import PoolDetail from '@/pages/PoolDetail'
import Matching from '@/pages/Matching'
import Matches from '@/pages/Matches'
import Chat from '@/pages/Chat'
import Profile from '@/pages/Profile'
import DataSovereignty from '@/pages/DataSovereignty'

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function AppContent() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} {...pageTransition}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/confessions" element={<ConfessionFeed />} />
            <Route path="/pool/:poolId" element={<PoolDetail />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chat/:matchId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/data" element={<DataSovereignty />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

function App() {
  return (
    <WalletProvider>
      <NovaProvider>
        <SocialProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SocialProvider>
      </NovaProvider>
    </WalletProvider>
  )
}

export default App
