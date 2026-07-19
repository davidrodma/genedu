import { Injectable } from "@nestjs/common"
import axios from "axios"
import { coloredLog } from "../../../../common/utilities/console.log.utility"
import { ConfigService } from "src/modules/config/services/config.service"

export interface GammaPresentationOptions {
  themeId?: string
  numCards?: number
  imageOptions?: {
    source?:
      | "aiGenerated"
      | "pictographic"
      | "unsplash"
      | "giphy"
      | "webAllImages"
      | "webFreeToUse"
      | "webFreeToUseCommercially"
      | "placeholder"
      | "noImages"
    model?: string
    style?: string
  }
  textOptions?: {
    amount?: "brief" | "medium" | "detailed" | "extensive"
    tone?: string
    audience?: string
    language?: string
  }
  cardOptions?: {
    dimensions?: "fluid" | "16x9" | "4x3"
  }
  additionalInstructions?: string
  exportAs?: "pdf" | "pptx"
}

export interface GammaPresentationRequest {
  inputText: string
  textMode?: "generate" | "condense" | "preserve"
  format?: "presentation" | "document" | "social"
  themeId?: string
  numCards?: number
  cardSplit?: "auto" | "inputTextBreaks"
  additionalInstructions?: string
  exportAs?: "pdf" | "pptx"
  textOptions?: {
    amount?: "brief" | "medium" | "detailed" | "extensive"
    tone?: string
    audience?: string
    language?: string
  }
  imageOptions?: {
    source?:
      | "aiGenerated"
      | "pictographic"
      | "unsplash"
      | "giphy"
      | "webAllImages"
      | "webFreeToUse"
      | "webFreeToUseCommercially"
      | "placeholder"
      | "noImages"
    model?: string
    style?: string
  }
  cardOptions?: {
    dimensions?: "fluid" | "16x9" | "4x3"
  }
  sharingOptions?: {
    workspaceAccess?: "noAccess" | "view" | "comment" | "edit" | "fullAccess"
    externalAccess?: "noAccess" | "view" | "comment" | "edit"
  }
}

export interface GammaPresentationResponse {
  id?: string
  generationId?: string
  name?: string
  url?: string
  status?: string
  exportUrl?: string
  data?: {
    id?: string
    generationId?: string
  }
  generation?: {
    id?: string
  }
  result?: {
    id?: string
  }
}

export interface GammaTheme {
  id: string
  name: string
  description?: string
}

@Injectable()
export class GammaApiService {
  private apiKey: string
  private readonly baseUrl = "https://public-api.gamma.app/v1.0"
  private readonly maxInputCharacters = 400000

  constructor(private readonly configService: ConfigService) {}

  async setApiKey(): Promise<string> {
    this.apiKey = await this.configService.getValue("gamma-api-key")
    return this.apiKey
  }

  async generatePresentation(
    request: GammaPresentationRequest
  ): Promise<GammaPresentationResponse> {
    try {
      coloredLog({
        content: `Generating presentation with Gamma API: ${request.inputText.substring(0, 50)}...`,
        color: "cyan",
      })

      // Validação básica do inputText
      if (!request.inputText || request.inputText.trim().length === 0) {
        throw new Error("inputText is required and cannot be empty")
      }

      if (request.inputText.length > this.maxInputCharacters) {
        throw new Error(
          `inputText cannot exceed ${this.maxInputCharacters.toLocaleString()} characters (approx. 100k tokens)`
        )
      }

      await this.setApiKey()

      const requestBody: any = {
        inputText: request.inputText,
      }

      // Adiciona apenas parâmetros que foram fornecidos
      if (request.textMode) requestBody.textMode = request.textMode
      if (request.format) requestBody.format = request.format
      if (request.themeId && request.themeId.trim())
        requestBody.themeId = request.themeId
      if (request.numCards) requestBody.numCards = request.numCards
      if (request.cardSplit) requestBody.cardSplit = request.cardSplit
      if (request.additionalInstructions)
        requestBody.additionalInstructions = request.additionalInstructions
      if (request.exportAs) requestBody.exportAs = request.exportAs

      // Adiciona objetos apenas se tiverem propriedades
      if (request.textOptions && Object.keys(request.textOptions).length > 0) {
        requestBody.textOptions = request.textOptions
      }
      if (
        request.imageOptions &&
        Object.keys(request.imageOptions).length > 0
      ) {
        requestBody.imageOptions = request.imageOptions
      }
      if (request.cardOptions && Object.keys(request.cardOptions).length > 0) {
        requestBody.cardOptions = request.cardOptions
      }
      if (
        request.sharingOptions &&
        Object.keys(request.sharingOptions).length > 0
      ) {
        requestBody.sharingOptions = request.sharingOptions
      }

      coloredLog({
        content: `Request body: ${JSON.stringify(requestBody, null, 2)}`,
        color: "yellow",
      })

      const response = await axios.post(
        `${this.baseUrl}/generations`,
        requestBody,
        {
          headers: {
            "X-API-KEY": this.apiKey,
            "Content-Type": "application/json",
          },
        }
      )

      // Verifica se há um ID na resposta - pode vir em diferentes formatos
      let presentationId = null

      // Tenta diferentes possibilidades de onde o ID pode estar
      if (response.data?.generationId) {
        presentationId = response.data.generationId
      } else if (response.data?.id) {
        presentationId = response.data.id
      } else if (response.data?.data?.id) {
        presentationId = response.data.data.id
      } else if (response.data?.generation?.id) {
        presentationId = response.data.generation.id
      } else if (response.data?.result?.id) {
        presentationId = response.data.result.id
      }

      if (!presentationId) {
        coloredLog({
          content: `No ID found in Gamma API response. Available fields: ${Object.keys(response.data || {}).join(", ")}`,
          color: "red",
        })
        coloredLog({
          content: `Full Gamma API response: ${JSON.stringify(response.data, null, 2)}`,
          color: "red",
        })
        throw new Error("Gamma API response does not contain a valid ID")
      }

      coloredLog({
        content: `Presentation generated successfully: ${presentationId}`,
        color: "green",
      })

      coloredLog({
        content: `Full response data: ${JSON.stringify(response.data, null, 2)}`,
        color: "yellow",
      })

      // Garante que o ID está na resposta
      const responseData = { ...response.data }
      if (!responseData.id) {
        responseData.id = presentationId
      }

      coloredLog({
        content: `Returning response data with ID: ${responseData.id}`,
        color: "cyan",
      })

      return responseData
    } catch (error: any) {
      let errorMessage = `Error generating presentation: ${error.message}`

      if (error.response) {
        // Erro da API com detalhes
        const status = error.response.status
        const data = error.response.data

        coloredLog({
          content: `Gamma API Error ${status}: ${JSON.stringify(data, null, 2)}`,
          color: "red",
        })

        if (status === 400) {
          errorMessage = `Bad Request (400): ${data?.message || data?.error || "Invalid parameters"}`
        } else if (status === 401) {
          errorMessage = `Unauthorized (401): Invalid API key`
        } else if (status === 429) {
          errorMessage = `Rate Limited (429): Too many requests`
        } else {
          errorMessage = `API Error ${status}: ${data?.message || data?.error || error.message}`
        }
      }

      coloredLog({
        content: errorMessage,
        color: "red",
      })
      throw new Error(`Gamma API error: ${errorMessage}`)
    }
  }

  async downloadPresentation(
    presentationId: string,
    outputPath: string
  ): Promise<void> {
    try {
      coloredLog({
        content: `Downloading presentation: ${presentationId}`,
        color: "cyan",
      })
      await this.setApiKey()
      // Primeiro, obtém a URL de exportação
      const statusResponse = await axios.get(
        `${this.baseUrl}/generations/${presentationId}`,
        {
          headers: {
            "X-API-KEY": this.apiKey,
          },
        }
      )

      const exportUrl = statusResponse.data.exportUrl
      if (!exportUrl) {
        throw new Error("No export URL available for this presentation")
      }

      // Baixa o arquivo usando a URL de exportação
      const response = await axios.get(exportUrl, {
        responseType: "stream",
      })

      const fs = require("fs")
      const writer = fs.createWriteStream(outputPath)

      response.data.pipe(writer)

      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          coloredLog({
            content: `Presentation downloaded successfully: ${outputPath}`,
            color: "green",
          })
          resolve()
        })
        writer.on("error", (error: any) => {
          coloredLog({
            content: `Error downloading presentation: ${error.message}`,
            color: "red",
          })
          reject(error)
        })
      })
    } catch (error: any) {
      coloredLog({
        content: `Error downloading presentation: ${error.message}`,
        color: "red",
      })
      throw new Error(`Gamma download error: ${error.message}`)
    }
  }

  async getPresentationStatus(presentationId: string): Promise<string> {
    try {
      await this.setApiKey()
      const response = await axios.get(
        `${this.baseUrl}/generations/${presentationId}`,
        {
          headers: {
            "X-API-KEY": this.apiKey,
          },
        }
      )

      return response.data.status
    } catch (error: any) {
      coloredLog({
        content: `Error getting presentation status: ${error.message}`,
        color: "red",
      })
      throw new Error(`Gamma status error: ${error.message}`)
    }
  }

  async listThemes(): Promise<GammaTheme[]> {
    try {
      await this.setApiKey()

      const collectedThemes: GammaTheme[] = []
      let cursor: string | undefined
      let safetyCounter = 0

      do {
        const response = await axios.get(`${this.baseUrl}/themes`, {
          headers: {
            "X-API-KEY": this.apiKey,
          },
        })

        const payload = response.data || {}
        const themesArray = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.themes)
            ? payload.themes
            : Array.isArray(payload)
              ? payload
              : []

        if (!Array.isArray(themesArray)) {
          coloredLog({
            content: `Unexpected themes payload from Gamma API: ${JSON.stringify(response.data, null, 2)}`,
            color: "red",
          })
          return collectedThemes
        }

        collectedThemes.push(
          ...themesArray.map((theme: any) => ({
            id: theme.id || theme.themeId || theme.slug || "",
            name: theme.name || theme.title || theme.label || "",
            description:
              theme.description ||
              theme.summary ||
              (theme.colorKeywords
                ? `Cores: ${theme.colorKeywords.join(", ")}`
                : undefined),
          }))
        )

        cursor =
          payload?.hasMore && payload?.nextCursor
            ? payload.nextCursor
            : undefined
        safetyCounter++
      } while (cursor && safetyCounter < 10)

      return collectedThemes
    } catch (error: any) {
      coloredLog({
        content: `Error listing Gamma themes: ${error.message}`,
        color: "red",
      })
      throw new Error(`Gamma themes error: ${error.message}`)
    }
  }
}
