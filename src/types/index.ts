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
}

export interface TravelPlan {
  destination: string
  budget: number
  days: number
  itinerary: {
    day: number
    activities: {
      time: string
      activity: string
      cost: number
      tip: string
    }[]
    accommodation: {
      name: string
      cost: number
    }
  }[]
  total_estimated_cost: number
  saving_tips: string[]
  recommended_booking_sites: {
    name: string
    url: string
    discount_info: string
  }[]
}
