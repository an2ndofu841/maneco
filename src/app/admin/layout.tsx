import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export const metadata = {
  title: '管理画面 | マネコ CMS',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const adminEmails = process.env.ADMIN_EMAILS
  if (adminEmails) {
    const allowed = adminEmails.split(',').map((e) => e.trim().toLowerCase())
    if (!user.email || !allowed.includes(user.email.toLowerCase())) {
      redirect('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  )
}
