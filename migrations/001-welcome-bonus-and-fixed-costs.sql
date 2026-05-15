-- ========================================
-- マネコ 追加マイグレーション (001)
-- 実行場所: Supabase Dashboard → SQL Editor
-- このファイルをそのまま貼り付けて Run してください。
-- 何度実行しても安全です（IF NOT EXISTS / OR REPLACE 設計）
-- ========================================

-- ========================================
-- ① ウェルカムボーナス (初回ダッシュボード訪問時の +1pt)
-- ========================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS welcomed_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.claim_welcome_bonus()
RETURNS INTEGER AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_updated_count INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.users
  SET welcomed_at = NOW(),
      total_points = total_points + 1,
      character_exp = character_exp + 1
  WHERE id = v_user_id AND welcomed_at IS NULL;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.claim_welcome_bonus() TO authenticated;

-- ========================================
-- ② 固定費管理 (user_fixed_costs テーブル)
-- ========================================

CREATE TABLE IF NOT EXISTS public.user_fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('housing', 'utility', 'communication', 'subscription', 'insurance', 'transportation', 'other')),
  amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_fixed_costs_user_id_idx ON public.user_fixed_costs(user_id);

ALTER TABLE public.user_fixed_costs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ユーザーは自分の固定費のみ参照可" ON public.user_fixed_costs;
CREATE POLICY "ユーザーは自分の固定費のみ参照可" ON public.user_fixed_costs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "ユーザーは自分の固定費を作成可" ON public.user_fixed_costs;
CREATE POLICY "ユーザーは自分の固定費を作成可" ON public.user_fixed_costs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ユーザーは自分の固定費を更新可" ON public.user_fixed_costs;
CREATE POLICY "ユーザーは自分の固定費を更新可" ON public.user_fixed_costs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "ユーザーは自分の固定費を削除可" ON public.user_fixed_costs;
CREATE POLICY "ユーザーは自分の固定費を削除可" ON public.user_fixed_costs
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER update_user_fixed_costs_updated_at
  BEFORE UPDATE ON public.user_fixed_costs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- 完了。Dashboard に行くとウェルカムモーダルが出ます！
-- ========================================
