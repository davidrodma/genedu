import { User } from '@/app/_common/models/user/user.model'
import { api } from '@/app/_common/services/api/api.service'

const path = '/user-admin'

type Model = User

export const UserService = {
  currentUser: async () => {
    return api().get<User>(`${path}/get-current-user`)
  },
  checkVerified: async () => {
    return api().get<{ user: User; botLinkTelegram: string }>(`${path}/check-verified`)
  },
  update: async (params: Partial<Model>): Promise<Model> => {
    const url = `${path}`
    return api().patch(url, { ...params, id: undefined })
  },
  changePassword: async (params: {
    password: string
    passwordConfirm: string
    passwordOld: string
  }): Promise<Model> => {
    const url = `${path}/change-password`
    return api().patch(url, { ...params, id: undefined })
  },
}
