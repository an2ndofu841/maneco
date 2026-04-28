import { NextRequest } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { authorized } = await verifyAdmin()
  if (!authorized) return unauthorizedResponse()

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('coupons')
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
    discount_type,
    discount_value,
    category,
    brand_name,
    image_url,
    valid_until,
    target_age_groups,
    target_occupations,
    affiliate_url,
    is_active,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('coupons')
    .insert({
      title,
      description,
      discount_type,
      discount_value,
      category,
      brand_name,
      image_url,
      valid_until,
      target_age_groups,
      target_occupations,
      affiliate_url,
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
    discount_type,
    discount_value,
    category,
    brand_name,
    image_url,
    valid_until,
    target_age_groups,
    target_occupations,
    affiliate_url,
    is_active,
  } = body

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('coupons')
    .update({
      title,
      description,
      discount_type,
      discount_value,
      category,
      brand_name,
      image_url,
      valid_until,
      target_age_groups,
      target_occupations,
      affiliate_url,
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
  const { error } = await supabase.from('coupons').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
