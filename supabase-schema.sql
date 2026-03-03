-- ========================================
-- マネコ (Maneco) データベーススキーマ
-- Supabase PostgreSQL
-- ========================================

-- Usersテーブル（プロフィール拡張）
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL DEFAULT 'マネコユーザー',
  avatar_url TEXT,
  age_group TEXT CHECK (age_group IN ('teen', '20s', '30s', '40s', '50s', '60plus')),
  occupation TEXT CHECK (occupation IN ('student', 'employee', 'freelance', 'part_time', 'housewife', 'other')),
  goal_title TEXT,
  goal_amount INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  total_savings INTEGER DEFAULT 0,
  character_level INTEGER DEFAULT 1,
  character_exp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat_Historyテーブル
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks_B2Bテーブル（案件マスタ）
CREATE TABLE IF NOT EXISTS public.tasks_b2b (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('survey', 'review', 'research', 'other')),
  reward_points INTEGER NOT NULL DEFAULT 0,
  max_participants INTEGER NOT NULL DEFAULT 100,
  current_participants INTEGER NOT NULL DEFAULT 0,
  deadline TIMESTAMPTZ NOT NULL,
  company_name TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_minutes INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User_Tasksテーブル（案件実績）
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks_b2b(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Couponsテーブル（クーポンマスタ）
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  category TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  image_url TEXT,
  valid_until TIMESTAMPTZ NOT NULL,
  target_age_groups TEXT[] DEFAULT '{}',
  target_occupations TEXT[] DEFAULT '{}',
  affiliate_url TEXT NOT NULL DEFAULT '#',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Row Level Security (RLS) 設定
-- ========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks_b2b ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "ユーザーは自分のプロフィールのみ参照可" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のプロフィールのみ更新可" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "新規ユーザー作成可" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Chat_History RLS
CREATE POLICY "ユーザーは自分のチャット履歴のみ参照可" ON public.chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のチャット履歴を作成可" ON public.chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks_B2B RLS（全ユーザー参照可）
CREATE POLICY "全ユーザーが案件を参照可" ON public.tasks_b2b
  FOR SELECT USING (is_active = TRUE);

-- User_Tasks RLS
CREATE POLICY "ユーザーは自分のタスク履歴のみ参照可" ON public.user_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のタスクを作成可" ON public.user_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のタスクを更新可" ON public.user_tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Coupons RLS（全ユーザー参照可）
CREATE POLICY "全ユーザーがクーポンを参照可" ON public.coupons
  FOR SELECT USING (is_active = TRUE);

-- ========================================
-- Triggers
-- ========================================

-- auth.usersへの新規登録時にusersテーブルへ自動挿入
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nickname)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_atの自動更新
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ポイント付与トランザクション関数
CREATE OR REPLACE FUNCTION public.complete_task_and_award_points(
  p_user_id UUID,
  p_task_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_reward_points INTEGER;
  v_exp_gain INTEGER;
BEGIN
  SELECT reward_points INTO v_reward_points
  FROM public.tasks_b2b
  WHERE id = p_task_id AND is_active = TRUE;

  IF v_reward_points IS NULL THEN
    RAISE EXCEPTION '案件が見つかりません';
  END IF;

  UPDATE public.user_tasks
  SET status = 'completed',
      completed_at = NOW(),
      points_earned = v_reward_points
  WHERE user_id = p_user_id AND task_id = p_task_id AND status = 'in_progress';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'タスクが見つかりません';
  END IF;

  UPDATE public.tasks_b2b
  SET current_participants = current_participants + 1
  WHERE id = p_task_id;

  v_exp_gain := v_reward_points / 10;

  UPDATE public.users
  SET total_points = total_points + v_reward_points,
      character_exp = character_exp + v_exp_gain,
      character_level = CASE
        WHEN (character_exp + v_exp_gain) >= character_level * 100 THEN character_level + 1
        ELSE character_level
      END
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- サンプルデータ
-- ========================================

INSERT INTO public.tasks_b2b (title, description, category, reward_points, max_participants, deadline, company_name, difficulty, estimated_minutes) VALUES
('スマホアプリの使い心地アンケート', '新しいショッピングアプリについて5つの質問に答えてください。感想をお聞かせいただくだけです！', 'survey', 50, 500, NOW() + INTERVAL '7 days', '株式会社テックスタート', 'easy', 3),
('カフェチェーンの新メニュー評価', '先月発売の新商品について、味・見た目・コスパの3点で評価をお願いします。', 'review', 80, 200, NOW() + INTERVAL '5 days', 'コーヒーチェーン大手', 'easy', 5),
('若者の節約術リサーチ', '普段どんな節約をしていますか？自由記述でご回答ください（100文字以上）', 'research', 150, 100, NOW() + INTERVAL '14 days', 'マーケティングリサーチ社', 'medium', 10),
('旅行に関する詳細アンケート', '最近1年間の国内旅行について詳しくお聞きします（設問20問）', 'survey', 300, 50, NOW() + INTERVAL '10 days', '旅行業界団体', 'hard', 20),
('新サービスのUI評価テスト', '画面キャプチャを見てユーザビリティを評価してください（5分程度）', 'research', 120, 150, NOW() + INTERVAL '3 days', 'UXリサーチ会社', 'medium', 5),
('SNS利用実態調査', '普段使っているSNSとその利用時間についてお答えください', 'survey', 60, 1000, NOW() + INTERVAL '21 days', 'デジタルメディア研究所', 'easy', 3);

INSERT INTO public.coupons (title, description, discount_type, discount_value, category, brand_name, valid_until, target_age_groups, target_occupations, affiliate_url) VALUES
('楽天トラベル 5%オフクーポン', '対象ホテル・旅館の予約に使えるクーポン。週末旅行をお得に！', 'percentage', 5, 'travel', '楽天トラベル', NOW() + INTERVAL '30 days', ARRAY['20s', '30s'], ARRAY['student', 'employee', 'part_time'], 'https://travel.rakuten.co.jp/'),
('UberEats 500円オフ', '3000円以上の注文で使える割引クーポン', 'fixed', 500, 'food', 'Uber Eats', NOW() + INTERVAL '7 days', ARRAY['20s', '30s', 'teen'], ARRAY['student', 'employee', 'part_time', 'freelance'], 'https://www.ubereats.com/jp'),
('ふるさと納税 Amazonギフト券プレゼント', 'ふるさと納税で節税＆返礼品ゲット！初回申込みでAmazonギフト券1000円分', 'fixed', 1000, 'tax', 'ふるなび', NOW() + INTERVAL '60 days', ARRAY['30s', '40s'], ARRAY['employee', 'freelance'], 'https://furunavi.jp/'),
('格安SIM 初月無料キャンペーン', 'スマホ代を月々2000円以上節約！乗り換えで初月基本料無料', 'percentage', 100, 'telecom', 'IIJmio', NOW() + INTERVAL '45 days', ARRAY['20s', '30s', 'teen'], ARRAY['student', 'employee', 'part_time'], 'https://www.iijmio.jp/'),
('Temu 新規登録15%オフ', 'アプリ初回購入に使えるクーポン。日用品・ファッションが激安！', 'percentage', 15, 'shopping', 'Temu', NOW() + INTERVAL '14 days', ARRAY['20s', '30s', 'teen'], ARRAY['student', 'part_time'], 'https://www.temu.com/'),
('SBI証券 口座開設特典', '口座開設完了で現金1000円プレゼント！投資デビューにおすすめ', 'fixed', 1000, 'investment', 'SBI証券', NOW() + INTERVAL '90 days', ARRAY['20s', '30s'], ARRAY['employee', 'freelance'], 'https://www.sbisec.co.jp/');
