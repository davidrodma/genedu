import { User } from "@/app/_common/models/user/user.model"
import { api } from "@/app/_common/services/api/api.service"

const path = "/user"

type Model = User

export const SignUpService = {
  signUp: async (params: Partial<Model>): Promise<Model> => {
    return api().post(`${path}`, params)
  },
}
