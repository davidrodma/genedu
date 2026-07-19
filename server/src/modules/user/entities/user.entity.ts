import { StatusDefault } from "src/common/enums/status.default.enum"

export class User {
  id?: string
  email: string
  password: string
  name: string
  telegram: string
  chatId?: string
  isVerified: boolean
  code?: number
  role: string
  createdAt: Date
  updatedAt: Date
  status: StatusDefault
}
