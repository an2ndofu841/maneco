export const dynamic = 'force-dynamic'

import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'
import { Home, TrendingUp, ShoppingBag, User } from 'lucide-react'

const desktopNav = [
  { href: '/dashboard', label: 'ダッシュボード', icon: Home },
  { href: '/earn', label: 'お金を増やす', icon: TrendingUp },
  { href: '/smart', label: '賢く使う', icon: ShoppingBag },
  { href: '/profile', label: 'プロフィール', icon: User },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f14]">
      <div className="mx-auto w-full max-w-7xl px-0 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] md:gap-6">
          <aside className="hidden md:block md:sticky md:top-0 md:h-screen md:py-6">
            <div className="h-full rounded-3xl border border-white/8 bg-[#151520] p-5">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-gold text-lg">🐱</div>
                <div>
                  <p className="text-sm font-black text-white">マネコ</p>
                  <p className="text-[11px] text-white/35">AI Money Concierge</p>
                </div>
              </div>

              <nav className="space-y-2">
                {desktopNav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 px-3 py-2.5 text-sm text-white/70 transition-all hover:border-white/15 hover:bg-white/5"
                  >
                    <Icon className="h-4 w-4 text-white/40" />
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-3">
                <p className="text-[11px] font-bold text-amber-300">PRO TIP</p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  「今月ピンチ」とAIに送るだけで、すぐ実行できる節約アクションが受け取れます。
                </p>
              </div>
            </div>
          </aside>

          <main className="pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
