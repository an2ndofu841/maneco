'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, ShoppingBag, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'ホーム' },
  { href: '/earn', icon: TrendingUp, label: '増やす' },
  { href: '/smart', icon: ShoppingBag, label: '使う' },
  { href: '/profile', icon: User, label: 'マイページ' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile: bottom floating nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb md:hidden pointer-events-none">
        <div className="px-4 pb-6 pt-4 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-auto">
          <div className="mx-auto max-w-sm bg-white/80 backdrop-blur-xl rounded-full border border-white/50 shadow-lg shadow-slate-200/50 flex items-center justify-between px-6 py-2">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center gap-0.5 transition-all px-2 py-1 rounded-xl ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Desktop: sidebar nav */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-20 flex-col items-center py-8 bg-white/80 backdrop-blur-xl border-r border-slate-100">
        <div className="flex flex-col items-center gap-6 flex-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
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
