import { Injectable } from "@nestjs/common"
import {
  PresentationCreateInput,
  PresentationRepository,
  PresentationUpdateInput,
} from "../repositories/presentation.repository"
import { ID } from "src/database/types/id.type"
import { Content } from "src/modules/content/entities/content.entity"
import { coloredLog } from "src/common/utilities/console.log.utility"
import { ContentService } from "src/modules/content/services/content.service"
import { TextContentService } from "src/modules/text-content/services/text-content.service"
import { GammaApiService } from "src/modules/api/services/gamma/gamma-api.service"
import { ContentStatus } from "src/modules/content/enum/content-status.enum"
import {
  formatFileName,
  getUniqueFileName,
} from "src/common/utilities/file.utility"
import { destinationDocs } from "src/modules/content/constants/vars"

@Injectable()
export class PresentationService {
  constructor(
    private readonly repository: PresentationRepository,
    private readonly gammaApiService: GammaApiService
  ) {}

  async create(data: PresentationCreateInput) {
    return await this.repository.create({ data })
  }

  async findById(id: ID) {
    return await this.repository.findUnique({
      where: { id },
      include: { content: true },
    })
  }

  async findByContentId(contentId: string) {
    return await this.repository.findByContentId(contentId)
  }

  async updateById(id: ID, data: PresentationUpdateInput) {
    return await this.repository.updateById(id, data)
  }

  async updateByContentId(contentId: string, data: PresentationUpdateInput) {
    return await this.repository.updateByContentId(contentId, data)
  }

  async deleteById(id: ID) {
    return await this.repository.deleteById(id)
  }

  async deleteByContentId(contentId: string) {
    return await this.repository.deleteByContentId(contentId)
  }

  async requestPresentation(
    content: Content,
    contentService: ContentService,
    textContentService: TextContentService
  ) {
    try {
      coloredLog(
        { content: `[START_REQUEST_PRESENTATION]`, color: "yellow" },
        { content: content.id, color: "blue" }
      )

      // Get textContent record to access generatedText
      const textContent = await textContentService.findByContentId(content.id)
      if (!textContent || !textContent.generatedText) {
        throw new Error("Texto gerado não encontrado")
      }

      // Validação do texto gerado
      if (textContent.generatedText.trim().length === 0) {
        throw new Error("Texto gerado está vazio")
      }

      if (textContent.generatedText.length > 750000) {
        throw new Error("Texto gerado excede o limite de 750.000 caracteres")
      }

      coloredLog({
        content: `[REQUEST_PRESENTATION] Content ID: ${content.id}`,
        color: "cyan",
      })
      coloredLog({
        content: `[REQUEST_PRESENTATION] Generated text length: ${textContent.generatedText.length}`,
        color: "cyan",
      })
      // Get presentation record to access presentation data
      const presentation = await this.findByContentId(content.id)
      if (!presentation) {
        throw new Error("Dados de apresentação não encontrados")
      }

      coloredLog({
        content: `[REQUEST_PRESENTATION] Theme: ${presentation.themeName || "workspace default"}`,
        color: "cyan",
      })
      coloredLog({
        content: `[REQUEST_PRESENTATION] Theme ID: ${presentation.themeId || "not set"}`,
        color: "cyan",
      })
      coloredLog({
        content: `[REQUEST_PRESENTATION] NumCards: ${presentation.numCards || 10}`,
        color: "cyan",
      })
      coloredLog({
        content: `[REQUEST_PRESENTATION] ImageOptions: ${presentation.imageOptions || "ai"}`,
        color: "cyan",
      })
      coloredLog({
        content: `[REQUEST_PRESENTATION] Language: ${content.language} -> ${content.language === "pt" ? "pt-br" : content.language || "en"}`,
        color: "cyan",
      })

      // Prepara os dados para a API do Gamma
      const presentationRequest: any = {
        inputText: textContent.generatedText,
        textMode: "generate" as const,
        format: "presentation" as const,
        numCards: presentation.numCards || 10,
        cardSplit: "auto" as const,
        additionalInstructions: presentation.promptPresentation,
        exportAs: "pptx" as const,
        textOptions: {
          amount: "detailed" as const,
          tone: "educational",
          language:
            content.language === "pt" ? "pt-br" : content.language || "en",
          audience: "students",
        },
        imageOptions: {
          source: presentation.imageOptions as any,
          style: presentation.imageStyle || "",
          ...(presentation.imageModel &&
            presentation.imageOptions === "aiGenerated" &&
            presentation.imageModel !== "default" && {
              model: presentation.imageModel,
            }),
        },
        cardOptions: {
          dimensions: "fluid" as const,
        },
        sharingOptions: {
          workspaceAccess: "view" as const,
          externalAccess: "noAccess" as const,
        },
      }

      const effectiveThemeId =
        presentation.themeId?.trim() || presentation.themeName?.trim()

      if (effectiveThemeId) {
        presentationRequest.themeId = effectiveThemeId
        coloredLog({
          content: `[REQUEST_PRESENTATION] Using theme ID: ${effectiveThemeId}${presentation.themeId ? "" : " (fallback from name)"}`,
          color: presentation.themeId ? "cyan" : "yellow",
        })
      } else {
        coloredLog({
          content: `[REQUEST_PRESENTATION] No theme specified, using workspace default`,
          color: "yellow",
        })
      }

      // Gera a apresentação usando a API do Gamma
      const presentationResponse =
        await this.gammaApiService.generatePresentation(presentationRequest)

      coloredLog({
        content: `[REQUEST_PRESENTATION] Response received: ${JSON.stringify(presentationResponse, null, 2)}`,
        color: "yellow",
      })

      // Verifica se há um ID na resposta - pode vir em diferentes formatos
      let presentationId = null

      // Tenta diferentes possibilidades de onde o ID pode estar
      if (presentationResponse?.generationId) {
        presentationId = presentationResponse.generationId
      } else if (presentationResponse?.id) {
        presentationId = presentationResponse.id
      } else if (presentationResponse?.data?.id) {
        presentationId = presentationResponse.data.id
      } else if (presentationResponse?.generation?.id) {
        presentationId = presentationResponse.generation.id
      } else if (presentationResponse?.result?.id) {
        presentationId = presentationResponse.result.id
      }

      // Garante que o presentationId seja uma string válida
      if (presentationId && typeof presentationId !== "string") {
        presentationId = String(presentationId)
      }

      if (!presentationId) {
        coloredLog({
          content: `[REQUEST_PRESENTATION] No ID found in response. Available fields: ${Object.keys(presentationResponse || {}).join(", ")}`,
          color: "red",
        })
        coloredLog({
          content: `[REQUEST_PRESENTATION] Full response: ${JSON.stringify(presentationResponse, null, 2)}`,
          color: "red",
        })
        throw new Error("Nenhuma apresentação foi gerada pela API do Gamma")
      }

      coloredLog({
        content: `[REQUEST_PRESENTATION] Found presentationId: ${presentationId} (type: ${typeof presentationId})`,
        color: "green",
      })

      coloredLog({
        content: `[FINISHED_REQUEST_PRESENTATION] - ID: ${presentationId}`,
        color: "green",
      })

      // Atualiza o content com o ID da apresentação
      coloredLog({
        content: `[REQUEST_PRESENTATION] Saving presentationId: ${presentationId} (type: ${typeof presentationId}) to content: ${content.id}`,
        color: "cyan",
      })

      const updateData = {
        lastStatus: ContentStatus.GENERATING_PRESENTATION,
        status: ContentStatus.GENERATING_PRESENTATION,
        presentationId: String(presentationId), // Garante que seja string
      }

      // Log adicional para debug
      coloredLog({
        content: `[REQUEST_PRESENTATION] updateData.presentationId: "${updateData.presentationId}" (type: ${typeof updateData.presentationId})`,
        color: "cyan",
      })

      coloredLog({
        content: `[REQUEST_PRESENTATION] Update data: ${JSON.stringify(updateData, null, 2)}`,
        color: "cyan",
      })

      // Verifica se o presentationId está válido antes de salvar
      if (
        !presentationId ||
        presentationId === "null" ||
        presentationId === "undefined"
      ) {
        coloredLog({
          content: `[REQUEST_PRESENTATION] ERROR: Invalid presentationId before saving: ${presentationId}`,
          color: "red",
        })
        throw new Error(`Invalid presentationId: ${presentationId}`)
      }

      // Log adicional para debug
      coloredLog({
        content: `[REQUEST_PRESENTATION] About to save presentationId: "${presentationId}" (length: ${presentationId.length})`,
        color: "cyan",
      })

      // Verifica se o presentationId está sendo passado corretamente
      if (updateData.presentationId !== presentationId) {
        coloredLog({
          content: `[REQUEST_PRESENTATION] WARNING: presentationId mismatch! Original: "${presentationId}", UpdateData: "${updateData.presentationId}"`,
          color: "red",
        })
      }

      // Update presentation record with presentationId
      await this.updateByContentId(content.id, {
        presentationId: String(presentationId),
      })

      // Update content status
      const updated = await contentService.updateById(content.id, {
        lastStatus: ContentStatus.GENERATING_PRESENTATION,
        status: ContentStatus.GENERATING_PRESENTATION,
      })

      // Log adicional para debug
      coloredLog({
        content: `[REQUEST_PRESENTATION] Repository update completed. Result: ${JSON.stringify(updated, null, 2)}`,
        color: "cyan",
      })

      // Verifica se o presentationId foi salvo corretamente
      const updatedPresentation = await this.findByContentId(content.id)
      if (!updatedPresentation?.presentationId) {
        coloredLog({
          content: `[REQUEST_PRESENTATION] CRITICAL: presentationId was not saved! Expected: "${presentationId}", Got: "${updatedPresentation?.presentationId}"`,
          color: "red",
        })

        // Tenta salvar novamente com um valor diferente
        coloredLog({
          content: `[REQUEST_PRESENTATION] Attempting to save presentationId again...`,
          color: "yellow",
        })

        await this.updateByContentId(content.id, {
          presentationId: String(presentationId),
        })

        const retryPresentation = await this.findByContentId(content.id)
        coloredLog({
          content: `[REQUEST_PRESENTATION] Retry result: ${retryPresentation?.presentationId}`,
          color: retryPresentation?.presentationId ? "green" : "red",
        })
      }

      coloredLog({
        content: `[REQUEST_PRESENTATION] Content updated successfully. Status: ${updated.status}`,
        color: "green",
      })

      // Verifica se o presentationId foi salvo corretamente
      const finalPresentation = await this.findByContentId(content.id)
      if (!finalPresentation?.presentationId) {
        coloredLog({
          content: `[REQUEST_PRESENTATION] WARNING: presentationId was not saved! Expected: ${presentationId}, Got: ${finalPresentation?.presentationId}`,
          color: "red",
        })

        // Tenta salvar novamente com um valor diferente
        coloredLog({
          content: `[REQUEST_PRESENTATION] Attempting to save presentationId again...`,
          color: "yellow",
        })

        await this.updateByContentId(content.id, {
          presentationId: String(presentationId),
        })

        const retryPresentation = await this.findByContentId(content.id)
        coloredLog({
          content: `[REQUEST_PRESENTATION] Retry result: ${retryPresentation?.presentationId}`,
          color: retryPresentation?.presentationId ? "green" : "red",
        })
      }

      return updated
    } catch (error: any) {
      const message_error = `[ERROR_REQUEST_PRESENTATION] : ${error.message || error}`
      coloredLog({ content: `${message_error}`, color: "red" })
      const updated = await contentService.updateById(content.id, {
        lastStatus: ContentStatus.REQUEST_PRESENTATION,
        status: ContentStatus.ERROR,
        messageError: message_error,
      })
      return updated
    }
  }

  async checkPresentationStatus(
    content: Content,
    contentService: ContentService
  ) {
    try {
      coloredLog(
        { content: `[CHECK_PRESENTATION_STATUS]`, color: "yellow" },
        { content: content.id, color: "blue" }
      )

      // Get presentation record to access presentationId
      const presentation = await this.findByContentId(content.id)
      if (!presentation?.presentationId) {
        throw new Error("ID da apresentação não encontrado")
      }

      // Verifica o status da apresentação
      const status = await this.gammaApiService.getPresentationStatus(
        presentation.presentationId
      )

      coloredLog({
        content: `[PRESENTATION_STATUS] - ID: ${presentation.presentationId}, Status: ${status}`,
        color: "cyan",
      })

      if (status === "completed") {
        // Atualiza o status para DOWNLOAD_PRESENTATION
        const updated = await contentService.updateById(content.id, {
          lastStatus: ContentStatus.DOWNLOADING_PRESENTATION,
          status: ContentStatus.DOWNLOADING_PRESENTATION,
        })
        return updated
      } else if (status === "failed" || status === "error") {
        throw new Error(`Apresentação falhou. Status: ${status}`)
      } else {
        // Ainda processando, mantém o status atual
        coloredLog({
          content: `[PRESENTATION_STILL_PROCESSING] - Status: ${status}`,
          color: "yellow",
        })
        return content
      }
    } catch (error: any) {
      const message_error = `[ERROR_CHECK_PRESENTATION_STATUS] : ${error.message || error}`
      coloredLog({ content: `${message_error}`, color: "red" })
      const updated = await contentService.updateById(content.id, {
        lastStatus: ContentStatus.GENERATING_PRESENTATION,
        status: ContentStatus.ERROR,
        messageError: message_error,
      })
      return updated
    }
  }

  async downloadPresentation(content: Content, contentService: ContentService) {
    try {
      coloredLog(
        { content: `[START_DOWNLOAD_PRESENTATION]`, color: "yellow" },
        { content: content.id, color: "blue" }
      )

      // Get presentation record to access presentationId
      const presentation = await this.findByContentId(content.id)
      if (!presentation?.presentationId) {
        throw new Error("ID da apresentação não encontrado")
      }

      // Define o nome do arquivo PPTX baseado no subject
      const baseFileName = formatFileName(content.subject)
      const presentationFileName = getUniqueFileName(
        destinationDocs,
        baseFileName,
        ".pptx",
        content.id
      )
      const presentationFilePath = `${destinationDocs}/${presentationFileName}`

      // Baixa a apresentação
      await this.gammaApiService.downloadPresentation(
        presentation.presentationId,
        presentationFilePath
      )

      coloredLog({
        content: `[FINISHED_DOWNLOAD_PRESENTATION] - File: ${presentationFileName}`,
        color: "green",
      })

      // Update presentation record with presentationFile
      await this.updateByContentId(content.id, {
        presentationFile: presentationFileName,
      })

      // Update content status
      const updated = await contentService.updateById(content.id, {
        lastStatus: ContentStatus.COMPLETED,
        status: ContentStatus.COMPLETED,
      })

      return updated
    } catch (error: any) {
      const message_error = `[ERROR_DOWNLOAD_PRESENTATION] : ${error.message || error}`
      coloredLog({ content: `${message_error}`, color: "red" })
      const updated = await contentService.updateById(content.id, {
        lastStatus: ContentStatus.DOWNLOADING_PRESENTATION,
        status: ContentStatus.ERROR,
        messageError: message_error,
      })
      return updated
    }
  }
}
