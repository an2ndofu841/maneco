import { NextRequest } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { authorized } = await verifyAdmin()
  if (!authorized) return unauthorizedResponse()

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin()
  if (!authorized) return unauthorizedResponse()

  const body = await request.json()
  const {
    slug,
    title,
    subtitle,
    emoji,
    icon_name,
    read_minutes,
    level,
    gradient,
    exp_reward,
    badge_emoji,
    badge_title,
    content,
    key_takeaway,
    is_active,
    sort_order,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug,
      title,
      subtitle,
      emoji,
      icon_name,
      read_minutes,
      level,
      gradient,
      exp_reward,
      badge_emoji,
      badge_title,
      content,
      key_takeaway,
      is_active,
      sort_order,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function PUT(request: NextRequest) {
  const { authorized } = await verifyAdmin()
  if (!authorized) return unauthorizedResponse()

  const body = await request.json()
  const {
    id,
    slug,
    title,
    subtitle,
    emoji,
    icon_name,
    read_minutes,
    level,
    gradient,
    exp_reward,
    badge_emoji,
    badge_title,
    content,
    key_takeaway,
    is_active,
    sort_order,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('articles')
    .update({
      slug,
      title,
      subtitle,
      emoji,
      icon_name,
      read_minutes,
      level,
      gradient,
      exp_reward,
      badge_emoji,
      badge_title,
      content,
      key_takeaway,
      is_active,
      sort_order,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(request: NextRequest) {
  const { authorized } = await verifyAdmin()
  if (!authorized) return unauthorizedResponse()

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return Response.json({ error: 'ID is required' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
