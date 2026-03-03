export const dynamic = 'force-dynamic'

import BottomNav from '@/components/layout/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f14]">
      <main className="max-w-lg mx-auto pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
