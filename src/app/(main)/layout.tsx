export const dynamic = 'force-dynamic'

import BottomNav from '@/components/layout/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent">
      <main className="app-container pb-24 md:pb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
