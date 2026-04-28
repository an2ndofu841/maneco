import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

export async function verifyAdmin(): Promise<{ authorized: boolean; userId?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { authorized: false }

  if (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(user.email ?? '')) {
    return { authorized: true, userId: user.id }
  }

  return { authorized: false }
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
