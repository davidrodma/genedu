import { _routes } from "@/app/(admin)/_configs/_routes"
import { handleError } from "../../errors/handleError"
import { api } from "../api/api.service"

type SignInRequestData = {
  email: string
  password: string
}
export interface UserPayload {
  sub: string
  email: string
  telegram: string
  name: string
  balance: number
  role: string
  isVerified: boolean
  iat?: number
  exp?: number
}

type LoginReponse = {
  access_token: string
  user: UserPayload
}

export async function signInRequest(data: SignInRequestData) {
  const response = await api()
    .post<LoginReponse>("/login", data)
    .catch((res) => handleError(res))
  if ("error" in response) {
    throw response.error
  }
  if (!response) {
    throw "Não foi possível obter uma sessão de token válida."
  }
  if (response?.access_token) {
    api().defaults.headers = {
      ...api().defaults.headers,
      Authorization: `Bearer ${response.access_token}`,
    }
  }
  const { access_token: token, user } = response
  return {
    token,
    user,
  }
}

export async function recoverUserInformation() {
  const response = await api()
    .get<UserPayload>("/me")
    .catch((res) => handleError(res))

  if ("error" in response) {
    throw response.error
  }
  if (!response) {
    throw "Unable to obtain a valid token session."
  }
  if (
    !response.isVerified &&
    !window.location.href.includes(_routes.verificationTelegram) &&
    !window.location.href.includes(_routes.settings) &&
    !window.location.href.includes(_routes.signin)
  ) {
    window.location.href = _routes.verificationTelegram
  }
  return {
    name: response.name,
    email: response.email,
    telegram: response.telegram,
    balance: response.balance,
    isVerified: response.isVerified,
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  }
}

export async function getRecoveryCode(
  telegram: string
): Promise<{ success: boolean; error?: string; botLinkTelegram?: string }> {
  return api().post(`/user/get-recovery-code`, { telegram })
}

export async function checkRecoveryCode(
  telegram: string,
  code: number
): Promise<{ success: boolean; error?: string }> {
  return api().post(`/user/check-recovery-code`, { telegram, code })
}

export async function changeRecoveryPassword(params: {
  telegram: string
  code: number
  password: string
  passwordConfirm: string
}): Promise<{ success: boolean; error?: string }> {
  return api().patch(`/user/change-recovery-password`, params)
}
