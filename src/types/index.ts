export interface User {
  id: string
  email: string
  nickname: string
  avatar_url?: string
  age_group?: string
  occupation?: string
  goal_title?: string
  goal_amount?: number
  total_points: number
  total_savings: number
  character_level: number
  character_exp: number
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  category: 'survey' | 'review' | 'research' | 'other'
  reward_points: number
  max_participants: number
  current_participants: number
  deadline: string
  company_name: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimated_minutes: number
  is_active: boolean
  created_at: string
}

export interface UserTask {
  id: string
  user_id: string
  task_id: string
  status: 'in_progress' | 'completed' | 'cancelled'
  completed_at?: string
  points_earned: number
  created_at: string
  task?: Task
}

export interface Coupon {
  id: string
  title: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  category: string
  brand_name: string
  image_url?: string
  valid_until: string
  target_age_groups?: string[]
  target_occupations?: string[]
  affiliate_url: string
  is_active: boolean
  created_at: string
  // New fields for enhanced filtering
  approx_price?: number
  location?: {
    lat: number
    lng: number
    address?: string
  }
}

export interface PointOffer {
  id: string
  title: string
  brand: string
  description: string
  points: number
  category: string
  category_label: string
  category_emoji: string
  conditions: string[]
  time_estimate: string
  difficulty: 'easy' | 'medium' | 'hard'
  popular: boolean
  limited: boolean
  gradient: string
  url: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  subtitle: string
  emoji: string
  icon_name: string
  read_minutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  gradient: string
  exp_reward: number
  badge_emoji: string
  badge_title: string
  content: any[]
  key_takeaway: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export type FixedCostCategory =
  | 'housing'
  | 'utility'
  | 'communication'
  | 'subscription'
  | 'insurance'
  | 'transportation'
  | 'other'

export type FixedCostBillingCycle = 'monthly' | 'yearly'

export interface FixedCost {
  id: string
  user_id: string
  name: string
  category: FixedCostCategory
  amount: number
  billing_cycle: FixedCostBillingCycle
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TravelPlan {
  plan_title: string
  departure: string
  destination: string
  budget: number
  total_estimated_cost: number
  transportation: {
    type: string
    cost: number
    details: string
    booking_url: string
  }
  scores: {
    comfort: number
    excitement: number
    cost_performance: number
    overall: number
  }
  compromise_points: { title: string; description: string }[]
  itinerary: {
    day: number
    activities: { time: string; activity: string; cost: number; tip: string }[]
    accommodation: { name: string; cost: number; booking_url: string }
  }[]
  saving_tips: string[]
}
