import Link from 'next/link'
import {
  Tag,
  ClipboardList,
  Gift,
  BookOpen,
  Users,
  Coins,
  ArrowRight,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

interface StatCard {
  label: string
  count: number
  icon: React.ElementType
  href: string
  color: string
}

async function getStats() {
  const supabase = createAdminClient()

  const [coupons, tasks, offers, articles, users, points] = await Promise.all([
    supabase.from('coupons').select('*', { count: 'exact', head: true }),
    supabase.from('tasks_b2b').select('*', { count: 'exact', head: true }),
    supabase.from('point_offers').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('total_points'),
  ])

  const totalPoints =
    points.data?.reduce((sum, u) => sum + (u.total_points ?? 0), 0) ?? 0

  return {
    coupons: coupons.count ?? 0,
    tasks: tasks.count ?? 0,
    offers: offers.count ?? 0,
    articles: articles.count ?? 0,
    users: users.count ?? 0,
    totalPoints,
  }
}

interface RecentItem {
  id: string
  title: string
  created_at: string
  extra?: string
}

async function getRecentItems() {
  const supabase = createAdminClient()

  const [coupons, tasks, offers, articles] = await Promise.all([
    supabase
      .from('coupons')
      .select('id, title, brand_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('tasks_b2b')
      .select('id, title, company_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('point_offers')
      .select('id, title, brand, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('articles')
      .select('id, title, slug, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return {
    coupons: (coupons.data ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      created_at: c.created_at,
      extra: c.brand_name,
    })),
    tasks: (tasks.data ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      created_at: t.created_at,
      extra: t.company_name,
    })),
    offers: (offers.data ?? []).map((o) => ({
      id: o.id,
      title: o.title,
      created_at: o.created_at,
      extra: o.brand,
    })),
    articles: (articles.data ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      created_at: a.created_at,
      extra: a.slug,
    })),
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentItems()])

  const statCards: StatCard[] = [
    {
      label: 'クーポン',
      count: stats.coupons,
      icon: Tag,
      href: '/admin/coupons',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'タスク',
      count: stats.tasks,
      icon: ClipboardList,
      href: '/admin/tasks',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'ポイント案件',
      count: stats.offers,
      icon: Gift,
      href: '/admin/offers',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: '学習記事',
      count: stats.articles,
      icon: BookOpen,
      href: '/admin/articles',
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: '登録ユーザー',
      count: stats.users,
      icon: Users,
      href: '/admin',
      color: 'text-sky-600 bg-sky-50',
    },
    {
      label: '配布ポイント合計',
      count: stats.totalPoints,
      icon: Coins,
      href: '/admin',
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  const recentSections: {
    title: string
    items: RecentItem[]
    href: string
  }[] = [
    { title: 'クーポン（最新5件）', items: recent.coupons, href: '/admin/coupons' },
    { title: 'タスク（最新5件）', items: recent.tasks, href: '/admin/tasks' },
    { title: 'ポイント案件（最新5件）', items: recent.offers, href: '/admin/offers' },
    { title: '学習記事（最新5件）', items: recent.articles, href: '/admin/articles' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-slate-500">
          マネコ管理画面の概要です
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {card.href !== '/admin' && (
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
                )}
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">
                {card.count.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {card.label}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recentSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                {section.title}
              </h2>
              <Link
                href={section.href}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                すべて表示
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {section.items.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                データがありません
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50 text-left text-xs font-medium text-slate-400">
                    <th className="px-5 py-2.5">タイトル</th>
                    <th className="px-5 py-2.5">詳細</th>
                    <th className="px-5 py-2.5 text-right">作成日</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="max-w-[200px] truncate px-5 py-3 text-sm font-medium text-slate-700">
                        {item.title}
                      </td>
                      <td className="max-w-[120px] truncate px-5 py-3 text-sm text-slate-500">
                        {item.extra ?? '-'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right text-xs text-slate-400">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
