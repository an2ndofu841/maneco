'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, ShoppingBag, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'ホーム' },
  { href: '/earn', icon: TrendingUp, label: '増やす' },
  { href: '/smart', icon: ShoppingBag, label: '賢く使う' },
  { href: '/profile', icon: User, label: 'マイページ' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 safe-area-pb">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                isActive ? 'text-amber-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute -top-0.5 w-8 h-1 bg-amber-500 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
