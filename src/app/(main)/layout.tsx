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
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto w-full max-w-7xl px-0 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] md:gap-6">
          <aside className="hidden md:block md:sticky md:top-0 md:h-screen md:py-6">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-gold text-lg">🐱</div>
                <div>
                  <p className="text-sm font-black text-slate-900">マネコ</p>
                  <p className="text-[11px] text-slate-500">AI Money Concierge</p>
                </div>
              </div>

              <nav className="space-y-2">
                {desktopNav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50"
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-3">
                <p className="text-[11px] font-bold text-blue-700">PRO TIP</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
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
