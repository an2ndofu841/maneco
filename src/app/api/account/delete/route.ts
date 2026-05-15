import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const CONFIRM_PHRASE = 'アカウントを削除します'

interface DeleteRequestBody {
  confirmPhrase?: string
  reason?: string
  feedback?: string
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({}))) as DeleteRequestBody

    if (body.confirmPhrase !== CONFIRM_PHRASE) {
      return NextResponse.json(
        { error: '確認文字列が一致しません' },
        { status: 400 }
      )
    }

    const reason = body.reason?.trim()
    if (!reason) {
      return NextResponse.json(
        { error: '退会理由を選択してください' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // 退会理由を匿名で保存（プロダクト改善用）
    const { data: profile } = await supabase
      .from('users')
      .select('age_group, occupation, total_savings, total_points, character_level, created_at')
      .eq('id', user.id)
      .single()

    const daysUsed = profile?.created_at
      ? Math.max(1, Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)))
      : 0

    await admin.from('retention_feedback').insert({
      reason,
      feedback: body.feedback?.trim() || null,
      age_group: profile?.age_group ?? null,
      occupation: profile?.occupation ?? null,
      total_savings: profile?.total_savings ?? 0,
      total_points: profile?.total_points ?? 0,
      days_used: daysUsed,
      character_level: profile?.character_level ?? 1,
    })

    // auth.users を削除 → CASCADE で public.users と関連テーブル全て削除
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteError) {
      console.error('Failed to delete user:', deleteError)
      return NextResponse.json(
        { error: 'アカウントの削除に失敗しました。お手数ですが、お問い合わせください。' },
        { status: 500 }
      )
    }

    // セッションをサインアウト（クライアント側のクッキー破棄）
    await supabase.auth.signOut()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Delete account error:', err)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
