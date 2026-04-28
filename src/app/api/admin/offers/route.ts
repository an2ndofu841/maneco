import { NextRequest } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { authorized } = await verifyAdmin()
  if (!authorized) return unauthorizedResponse()

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('point_offers')
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
    title,
    brand,
    description,
    points,
    category,
    category_label,
    category_emoji,
    conditions,
    time_estimate,
    difficulty,
    popular,
    limited,
    gradient,
    url,
    is_active,
    sort_order,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('point_offers')
    .insert({
      title,
      brand,
      description,
      points,
      category,
      category_label,
      category_emoji,
      conditions,
      time_estimate,
      difficulty,
      popular,
      limited,
      gradient,
      url,
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
    title,
    brand,
    description,
    points,
    category,
    category_label,
    category_emoji,
    conditions,
    time_estimate,
    difficulty,
    popular,
    limited,
    gradient,
    url,
    is_active,
    sort_order,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('point_offers')
    .update({
      title,
      brand,
      description,
      points,
      category,
      category_label,
      category_emoji,
      conditions,
      time_estimate,
      difficulty,
      popular,
      limited,
      gradient,
      url,
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
  const { error } = await supabase.from('point_offers').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
