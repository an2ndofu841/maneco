import { NextRequest } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { authorized } = await verifyAdmin()
  if (!authorized) return unauthorizedResponse()

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('tasks_b2b')
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
    description,
    category,
    reward_points,
    max_participants,
    current_participants,
    deadline,
    company_name,
    difficulty,
    estimated_minutes,
    is_active,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('tasks_b2b')
    .insert({
      title,
      description,
      category,
      reward_points,
      max_participants,
      current_participants,
      deadline,
      company_name,
      difficulty,
      estimated_minutes,
      is_active,
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
    description,
    category,
    reward_points,
    max_participants,
    current_participants,
    deadline,
    company_name,
    difficulty,
    estimated_minutes,
    is_active,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('tasks_b2b')
    .update({
      title,
      description,
      category,
      reward_points,
      max_participants,
      current_participants,
      deadline,
      company_name,
      difficulty,
      estimated_minutes,
      is_active,
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
  const { error } = await supabase.from('tasks_b2b').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
