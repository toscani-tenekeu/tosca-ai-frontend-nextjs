export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isPremium: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

