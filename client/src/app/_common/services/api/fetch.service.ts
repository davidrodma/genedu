import { parseCookies } from "nookies"
import { auth_token_name } from "@/app/_common/configs/constants"
import { _routes as _routesUser } from "@/app/(admin)/_configs/_routes"

type OptionsApiClient = {
  method?: string
  base_url?: string
  content_type?: string
}
export function getAPIClient(ctx?: any) {
  const { [auth_token_name]: token } = parseCookies(ctx)

  const baseURL = process.env.NEXT_PUBLIC_API_URL
  const content_type_default = "application/json;charset=UTF-8"
  const api = {
    defaults: {
      headers: {
        Accept: "application/json",
      },
    } as RequestInit,
    request: async function <Return = any>(
      path: string,
      params?: any,
      options?: OptionsApiClient
    ): Promise<Return> {
      let {
        method = "GET",
        base_url = baseURL,
        content_type = content_type_default,
      } = options || {}
      let [body, queryParams] = [undefined as undefined | string | FormData, ""]
      if (method == "GET" && params) {
        queryParams = params
          ? Object.keys(params)
              .map(
                (k) =>
                  encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
              )
              .join("&")
          : ""
        queryParams = queryParams ? `?${queryParams}` : ""
      } else if (params instanceof FormData) {
        body = params
      } else {
        body = JSON.stringify(params)
      }
      if (token) {
        api.defaults.headers = {
          ...api.defaults.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      if (
        (content_type && content_type != content_type_default) ||
        content_type == content_type_default
      ) {
        api.defaults.headers = {
          ...api.defaults.headers,
          "Content-Type": content_type,
        }
      }

      return fetch(`${base_url}${path}${queryParams}`, {
        headers: api.defaults.headers,
        method: method,
        body: body,
      }).then((resp) => {
        if (
          (resp?.status === 403 || resp?.status === 401) &&
          ![`${_routesUser.signin}`].includes(resp.url)
        ) {
          window.location.href = _routesUser.signin
        }
        return resp.json()
      })
    },
    get: function <Return = any>(
      path: string,
      params?: any,
      options?: OptionsApiClient
    ): Promise<Return> {
      return api.request(path, params, { ...options, method: "GET" })
    },
    post: function <Return = any>(
      path: string,
      params?: any,
      options?: OptionsApiClient
    ): Promise<Return> {
      return api.request(path, params, { ...options, method: "POST" })
    },
    patch: function <Return = any>(
      path: string,
      params?: any,
      options?: OptionsApiClient
    ): Promise<Return> {
      return api.request(path, params, { ...options, method: "PATCH" })
    },
    put: function <Return = any>(
      path: string,
      params?: any,
      options?: OptionsApiClient
    ): Promise<Return> {
      return api.request(path, params, { ...options, method: "PUT" })
    },
    delete: function <Return = any>(
      path: string,
      params?: any,
      options?: OptionsApiClient
    ): Promise<Return> {
      return api.request(path, params, { ...options, method: "DELETE" })
    },
  }

  return api
}
