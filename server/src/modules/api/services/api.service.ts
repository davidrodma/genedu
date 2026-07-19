import { Injectable, PlainLiteralObject } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { IsArray, IsString, validate } from "class-validator"
import { coloredLog } from "src/common/utilities/console.log.utility"
import fetch, { HeadersInit, RequestInit } from "node-fetch"
import { ConfigService } from "src/modules/config/services/config.service"

class ExceptionArrayDetail {
  @IsArray()
  detail: { loc: []; msg: string; type: string }[]
}

class ExceptionDetail {
  @IsString()
  detail: string

  @IsString()
  exc_type: string
}

@Injectable()
export class ApiService {
  private baseURL: string = ""
  private headerToken: HeadersInit = {}
  private useProxy: boolean = false

  constructor(private configService: ConfigService) {}

  setConfig({
    baseURL,
    headerToken = {},
    useProxy = false,
  }: {
    baseURL?: string
    headerToken?: HeadersInit
    useProxy?: boolean
  }): void {
    this.baseURL = baseURL
    this.headerToken = headerToken
    this.useProxy = useProxy
  }

  getConfig(): {
    baseURL: string
    headerToken: HeadersInit
    useProxy: boolean
  } {
    return {
      baseURL: this.baseURL,
      headerToken: this.headerToken,
      useProxy: this.useProxy,
    }
  }

  async request<T = any>({
    url,
    method = "get",
    params,
    searchParams,
    config = {},
    returnType = "json",
  }: {
    url: string
    method?: "get" | "post" | "delete" | "put" | "patch"
    params?: JSON | FormData | PlainLiteralObject
    searchParams?: PlainLiteralObject | JSON
    config?: RequestInit
    returnType?: "json" | "html" | "response"
  }): Promise<T> {
    let fullUrl = `${this.baseURL || ""}${url}`
    const defaults: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0",
        ...this.headerToken,
      },
    }
    const sendingData =
      params instanceof FormData
        ? new URLSearchParams(params as any).toString()
        : params
          ? JSON.stringify(params)
          : undefined
    if (searchParams) {
      let searchParamsStr = new URLSearchParams(searchParams as any).toString()
      fullUrl + "?" + searchParamsStr
    }
    const result = await fetch(fullUrl, {
      method,
      body: sendingData,
      ...defaults,
      ...config,
      signal: AbortSignal.timeout(180000),
    })
      .then(async (response) => {
        if (returnType === "response") {
          return response
        }
        const res =
          returnType === "html" ? await response.text() : await response.json()
        /*      
        if (res && returnType === 'json') {
          await this.checkError(res)
        } */

        return res
      })
      .catch(async (error: Error | any) => {
        const message_error = `Error Api Request: ${error?.message || error.toJSON().toString()}`
        coloredLog({ content: message_error, color: "red" })
        coloredLog({ content: error, color: "blue" })
        if (error?.response?.data) {
          await this.checkError(error.response.data)
          throw error.response.data
        }
        throw message_error
      })

    return result as T
  }

  async checkError(res: any) {
    if (typeof res !== "string") {
      const exceptionDetail = plainToInstance(ExceptionDetail, res)
      let validationErrors = await validate(exceptionDetail)
      if (validationErrors.length === 0) {
        throw Error(`${exceptionDetail.exc_type}: ${exceptionDetail.detail}`)
      }

      const exceptionArrayDetail = plainToInstance(ExceptionArrayDetail, res)
      validationErrors = await validate(exceptionArrayDetail)
      if (validationErrors.length === 0) {
        throw Error(
          exceptionArrayDetail.detail
            .map((exc) => `${exc.type}: ${exc.msg}`)
            .join(";")
        )
      }
    }
  }
}
