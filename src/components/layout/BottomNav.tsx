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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
      <div className="max-w-lg mx-auto px-4 pb-3">
        <div className="glass rounded-2xl flex items-center px-2 py-1 border border-white/8">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-500/15'
                    : 'hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-white/30'
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-amber-400' : 'text-white/30'
                }`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
