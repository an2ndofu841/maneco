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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb md:hidden pointer-events-none">
      <div className="px-4 pb-6 pt-4 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-auto">
        <div className="mx-auto max-w-sm bg-white/80 backdrop-blur-xl rounded-full border border-white/50 shadow-lg shadow-slate-200/50 flex items-center justify-between px-8 py-3">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 transition-all relative ${
                  isActive
                    ? 'text-indigo-600 scale-110'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon
                  className="w-6 h-6"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-600" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
