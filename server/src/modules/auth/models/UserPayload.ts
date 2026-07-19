export interface UserPayload {
  sub: string
  email: string
  telegram: string
  name: string
  isVerified: boolean
  role: string
  iat?: number
  exp?: number
}
