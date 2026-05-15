-- ========================================
-- マネコ 追加マイグレーション (002)
-- アカウント削除と退会理由フィードバック
-- ========================================
-- 実行場所: Supabase Dashboard → SQL Editor
-- このファイルをそのまま貼り付けて Run してください。
-- 何度実行しても安全です。
-- ========================================

-- ========================================
-- 退会理由の匿名フィードバック保存用テーブル
-- (ユーザーIDは保存しない = GDPR配慮)
-- ========================================

CREATE TABLE IF NOT EXISTS public.retention_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reason TEXT NOT NULL,
  feedback TEXT,
  age_group TEXT,
  occupation TEXT,
  total_savings INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  days_used INTEGER DEFAULT 0,
  character_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.retention_feedback ENABLE ROW LEVEL SECURITY;

-- INSERTのみ可能。SELECT/UPDATE/DELETEは管理者(service_role)のみ
DROP POLICY IF EXISTS "誰でも退会フィードバックを送信可" ON public.retention_feedback;
CREATE POLICY "誰でも退会フィードバックを送信可" ON public.retention_feedback
  FOR INSERT WITH CHECK (true);

-- ========================================
-- 既存テーブルのCASCADE設定確認
-- (これらは自動で auth.users 削除時に連動削除されます)
-- ========================================
-- public.users (id REFERENCES auth.users(id) ON DELETE CASCADE) ✓
-- public.chat_history (user_id REFERENCES public.users(id) ON DELETE CASCADE) ✓
-- public.user_tasks (user_id REFERENCES public.users(id) ON DELETE CASCADE) ✓
-- public.user_fixed_costs (user_id REFERENCES public.users(id) ON DELETE CASCADE) ✓

-- ========================================
-- 完了。
-- API側で auth.admin.deleteUser() を呼ぶことで、
-- auth.users → public.users → 各テーブルがCASCADEで削除されます。
-- ========================================
