'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, ShoppingBag, User } from 'lucide-react'

const desktopNavItems = [
  { href: '/dashboard', icon: Home, label: 'ホーム' },
  { href: '/earn', icon: TrendingUp, label: '増やす' },
  { href: '/smart', icon: ShoppingBag, label: '使う' },
  { href: '/profile', icon: User, label: 'マイページ' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const earnActive = isActive('/earn')
  const homeActive = isActive('/dashboard')
  const smartActive = isActive('/smart')

  return (
    <>
      {/* Mobile: 3-button floating nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb md:hidden pointer-events-none">
        <div className="flex justify-center pb-4 pt-2 pointer-events-auto">
          <div className="flex items-end gap-3">
            {/* 増やす */}
            <Link
              href="/earn"
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all active:scale-90 shadow-lg ${
                earnActive
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-white/90 backdrop-blur-xl text-slate-500 shadow-slate-200/60 border border-white/60'
              }`}
            >
              <TrendingUp className="w-5 h-5" strokeWidth={earnActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-0.5 leading-none">増やす</span>
            </Link>

            {/* ホーム (center, larger) */}
            <Link
              href="/dashboard"
              className={`flex items-center justify-center w-16 h-16 rounded-full transition-all active:scale-90 shadow-xl -mb-1 ${
                homeActive
                  ? 'bg-indigo-600 text-white shadow-indigo-500/40 ring-4 ring-indigo-100'
                  : 'bg-white/90 backdrop-blur-xl text-slate-600 shadow-slate-300/50 border border-white/60'
              }`}
            >
              <Home className="w-6 h-6" strokeWidth={homeActive ? 2.5 : 2} />
            </Link>

            {/* 使う */}
            <Link
              href="/smart"
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all active:scale-90 shadow-lg ${
                smartActive
                  ? 'bg-blue-500 text-white shadow-blue-500/30'
                  : 'bg-white/90 backdrop-blur-xl text-slate-500 shadow-slate-200/60 border border-white/60'
              }`}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={smartActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-0.5 leading-none">使う</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Desktop: sidebar nav */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-20 flex-col items-center py-8 bg-white/80 backdrop-blur-xl border-r border-slate-100">
        <div className="flex flex-col items-center gap-6 flex-1">
          {desktopNavItems.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                  active
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
