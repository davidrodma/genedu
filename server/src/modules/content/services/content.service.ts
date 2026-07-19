import { Injectable } from "@nestjs/common"
import { Content } from "../entities/content.entity"
import {
  ContenContentFindManyArgs,
  ContentCreateInput,
  ContentRepository,
  ContentUpdateInput,
} from "../repositories/content.repository"
import { PaginateDto } from "src/common/dto/paginate.dto"
import { ID } from "src/database/types/id.type"
import { ContentStatus } from "../enum/content-status.enum"
import { UpdateContentDto } from "../dto/update-content.dto"
import { coloredLog } from "src/common/utilities/console.log.utility"
import { deleteFile } from "src/common/utilities/file.utility"
import { destinationMedias, destinationDocs } from "../constants/vars"
import { MediaService } from "../../media/services/media.service"
import { CreateContentDto } from "../dto/create-content.dto"
import { TranscriptionService } from "../../transcription/services/transcription.service"
import { TextContentService } from "../../text-content/services/text-content.service"
import { PresentationService } from "../../presentation/services/presentation.service"
import { PresentationUpdateInput } from "src/modules/presentation/repositories/presentation.repository"
import { TextContentUpdateInput } from "src/modules/text-content/repositories/text-content.repository"
import { TranscriptionUpdateInput } from "src/modules/transcription/repositories/transcription.repository"
import { ConfigService } from "src/modules/config/services/config.service"
import { Exception } from "src/common/errors/Exception"

@Injectable()
export class ContentService {
  constructor(
    private readonly repository: ContentRepository,

    private readonly mediaService: MediaService,
    private readonly transcriptionService: TranscriptionService,
    private readonly textContentService: TextContentService,
    private readonly presentationService: PresentationService,
    private readonly configService: ConfigService
  ) {}

  async create(data: CreateContentDto, file: Express.Multer.File) {
    // Create content first
    const openaiApiKey = await this.configService.getValue("openai-api-key")
    if (!openaiApiKey) {
      throw new Exception(
        "OpenAI API Key not found! Enter the key in 'Settings -> OpenAI API Key'"
      )
    }
    const gammaApiKey = await this.configService.getValue("gamma-api-key")
    if (!gammaApiKey) {
      throw new Exception(
        "Gamma API Key not found! Enter the key in 'Settings -> Gamma API Key'"
      )
    }
    const dataContent = {
      subject: data.subject,
      language: data.language,
    } as ContentCreateInput

    const content = (await this.repository.create({
      data: dataContent,
    })) as Content

    let transcriptionData: any = {
      contentId: content.id,
      transcriptionText: "",
      transcriptFile: "",
      transcriptionModel: data?.transcriptionModel || "",
    }

    let textContentData: any = {
      contentId: content.id,
      promptText: data?.promptText || "",
      textModel: data?.textModel || "",
    }
    let presentationData: any = {
      contentId: content.id,
      promptPresentation: data.promptPresentation || "",
      themeId: data.themeId || undefined,
      themeName: data.themeName || "",
      numCards: data.numCards || 10,
      imageOptions: data.imageOptions || "aiGenerated",
      imageModel: data.imageModel || "",
      imageStyle: data.imageStyle || "",
    }

    // Create media record if there's a file or YouTube link
    if (file?.filename || data.youtubeLink) {
      let mediaData: any = {
        contentId: content.id,
        sourceType: file?.filename ? "UPLOAD" : "YOUTUBE",
      }

      if (file?.filename) {
        mediaData.mediaFile = file.filename

        // Get media file info
        try {
          const filePath = `${destinationMedias}/${file.filename}`
          coloredLog({
            content: `[CREATE] Getting media info for uploaded file: ${filePath}`,
            color: "yellow",
          })

          const mediaInfo = await this.mediaService.getMediaFileInfo(filePath)
          mediaData.sizeBytes = mediaInfo.sizeBytes
          mediaData.duration = mediaInfo.duration

          coloredLog({
            content: `[CREATE] Saved media info - Size: ${mediaInfo.sizeBytes}, Duration: ${mediaInfo.duration}`,
            color: "green",
          })
        } catch (error) {
          coloredLog({
            content: `Error getting media info for ${file.filename}: ${error}`,
            color: "red",
          })
          mediaData.sizeBytes = 0
          mediaData.duration = 0
        }
      }

      if (data.youtubeLink) {
        mediaData.youtubeLink = data.youtubeLink
      }

      if (data.mediaDescription) {
        mediaData.mediaDescription = data.mediaDescription
      }
      console.log("data", data)

      content.media = await this.mediaService.create(mediaData)

      content.transcription =
        await this.transcriptionService.create(transcriptionData)

      content.textContent =
        await this.textContentService.create(textContentData)

      content.presentation =
        await this.presentationService.create(presentationData)
      coloredLog({
        content: `[CREATE] Media created for content ID: ${content.id}`,
        color: "green",
      })
    }

    return content
  }

  async edit(
    id: ID,
    data: UpdateContentDto & Partial<CreateContentDto>,
    file?: Express.Multer.File,
    isDelete?: boolean
  ) {
    // Update content first
    const dataContent = {
      subject: data.subject,
      language: data.language,
    } as ContentUpdateInput

    const content = await this.updateById(id, dataContent, { returning: true })

    // Update media record if there's a file or media-related data
    if (
      file?.filename ||
      isDelete ||
      data.youtubeLink ||
      data.mediaDescription
    ) {
      const existingMedia = await this.mediaService.findByContentId(id)

      if (file?.filename || isDelete) {
        if (existingMedia && existingMedia.mediaFile) {
          deleteFile(`${destinationMedias}/${existingMedia.mediaFile}`)
        }
      }

      let mediaData: any = {}

      if (isDelete) {
        mediaData.mediaFile = ""
        mediaData.sizeBytes = 0
        mediaData.duration = 0
      }

      if (file?.filename) {
        mediaData.mediaFile = file.filename

        // Get media file info
        try {
          const filePath = `${destinationMedias}/${file.filename}`
          const mediaInfo = await this.mediaService.getMediaFileInfo(filePath)
          mediaData.sizeBytes = mediaInfo.sizeBytes
          mediaData.duration = mediaInfo.duration
        } catch (error) {
          coloredLog({
            content: `Error getting media info for ${file.filename}: ${error}`,
            color: "red",
          })
          mediaData.sizeBytes = 0
          mediaData.duration = 0
        }
      }

      if (data.youtubeLink !== undefined) {
        mediaData.youtubeLink = data.youtubeLink
      }

      if (data.mediaDescription !== undefined) {
        mediaData.mediaDescription = data.mediaDescription
      }
      if (existingMedia) {
        await this.mediaService.updateByContentId(id, mediaData)
      } else if (Object.keys(mediaData).length > 0) {
        // Create new media record if it doesn't exist
        mediaData.contentId = id
        mediaData.sourceType = file?.filename ? "UPLOAD" : "YOUTUBE"
        await this.mediaService.create(mediaData)
      }
    }

    if (data?.transcriptionModel) {
      let transcriptionData: TranscriptionUpdateInput = {
        transcriptionModel: data.transcriptionModel,
      }
      await this.transcriptionService.updateByContentId(
        content.id,
        transcriptionData
      )
    }
    if (data?.promptText || data?.textModel) {
      let textContentData: TextContentUpdateInput = {
        promptText: data?.promptText || content.textContent.promptText,
        textModel: data?.textModel || content.textContent.textModel,
      }
      await this.textContentService.updateByContentId(
        content.id,
        textContentData
      )
    }
    if (
      data?.promptPresentation ||
      data?.themeId ||
      data?.themeName ||
      data?.numCards ||
      data?.imageOptions ||
      data?.imageModel ||
      data?.imageStyle
    ) {
      let presentationData: PresentationUpdateInput = {
        promptPresentation:
          data.promptPresentation || content.presentation?.promptPresentation,
        themeId: data.themeId || content.presentation?.themeId,
        themeName: data.themeName || content.presentation?.themeName,
        numCards: data.numCards
          ? parseInt(data.numCards.toString())
          : content.presentation?.numCards,
        imageOptions: data.imageOptions || content.presentation?.imageOptions,
        imageModel: data.imageModel || content.presentation?.imageModel,
        imageStyle: data.imageStyle || content.presentation?.imageStyle,
      }
      await this.presentationService.updateByContentId(
        content.id,
        presentationData
      )
    }

    return await this.findById(id)
  }

  async updateById(
    id: ID,
    data: ContentUpdateInput,
    options?: { returning: boolean }
  ) {
    const updated = await this.repository.updateById<Content>(id, data)
    if (options?.returning) {
      return await this.findById(id)
    }
    return updated
  }

  async paginate(paginateDto: PaginateDto) {
    let paginate = await this.repository.paginate<Content>({
      paginateDto,
      findManyArgs: {
        include: {
          media: true,
          transcription: true,
          textContent: true,
          presentation: true,
        },
      },
      fieldsSearch: ["subject"],
    })
    return paginate
  }

  async changeStatus(ids: ID[] | ID, status: number) {
    return await this.repository.changeStatus(ids, status)
  }

  async findById(id: ID) {
    return this.repository.findByIdWithAllRelations(id) as any as Content
  }

  async findMany(data: ContenContentFindManyArgs) {
    return await this.repository.findMany<Content[]>(data)
  }

  async deleteManyByIds(ids: ID[] | ID) {
    const olds = await this.repository.findManyByIds(ids)
    for (const old of olds) {
      // Get media record and delete associated files
      const media = await this.mediaService.findByContentId(old.id)
      if (media) {
        // Deleta arquivo de mídia principal
        if (media.mediaFile) {
          deleteFile(`${destinationMedias}/${media.mediaFile}`)
        }

        // Deleta arquivos de áudio convertidos
        if (media?.audioFilenames?.length > 0) {
          for (const f of media.audioFilenames) {
            deleteFile(`${destinationMedias}/${f}`)
          }
        }

        // Delete media record
        await this.mediaService.deleteByContentId(old.id)
      }

      // Get transcription record and delete associated files
      const transcription = await this.transcriptionService.findByContentId(
        old.id
      )
      if (transcription) {
        // Deleta arquivo de transcrição (.srt)
        if (transcription.transcriptFile) {
          deleteFile(`${destinationMedias}/${transcription.transcriptFile}`)
        }

        // Delete transcription record
        await this.transcriptionService.deleteByContentId(old.id)
      }

      // Get textContent record and delete associated files
      const textContent = await this.textContentService.findByContentId(old.id)
      if (textContent) {
        // Deleta arquivo PDF gerado
        if (textContent.textFile) {
          deleteFile(`${destinationDocs}/${textContent.textFile}`)
        }

        // Delete textContent record
        await this.textContentService.deleteByContentId(old.id)
      }

      // Get presentation record and delete associated files
      const presentation = await this.presentationService.findByContentId(
        old.id
      )
      if (presentation) {
        // Deleta arquivo de apresentação (.pptx)
        if (presentation.presentationFile) {
          deleteFile(`${destinationDocs}/${presentation.presentationFile}`)
        }

        // Delete presentation record
        await this.presentationService.deleteByContentId(old.id)
      }
    }
    return this.repository.deleteManyByIds(ids)
  }

  async updateManyByIds(ids: ID[] | ID, data: ContentUpdateInput) {
    return await this.repository.updateManyByIds(ids, data)
  }

  async pendingsDownloadsMedia(limit = 1) {
    let filter: any = {
      AND: [
        {
          media: {
            sourceType: "YOUTUBE",
          },
        },
        {
          OR: [
            {
              status: ContentStatus.PENDING,
              lastStatus: ContentStatus.PENDING,
            },
            { status: ContentStatus.DOWNLOADING_MEDIA },
            {
              status: ContentStatus.PENDING,
              lastStatus: ContentStatus.DOWNLOADING_MEDIA,
            },
          ],
        },
      ],
    }
    const pendings = await this.findMany({
      where: filter,
      include: { media: true },
      take: limit,
    })
    return pendings
  }

  async pendingsConversionsAudio(limit = 1) {
    let filter: any = {
      OR: [
        { status: ContentStatus.CONVERTING_AUDIO },
        {
          status: ContentStatus.PENDING,
          lastStatus: ContentStatus.CONVERTING_AUDIO,
        },
        {
          status: ContentStatus.PENDING,
          lastStatus: ContentStatus.PENDING,
          media: {
            sourceType: "UPLOAD",
          },
        },
      ],
    }
    const pendings = await this.findMany({
      where: filter,
      include: { media: true, transcription: true },
      take: limit,
    })
    return pendings
  }

  async pendingsTranscriptions(limit = 1) {
    let filter: any = {
      OR: [
        { status: ContentStatus.TRANSCRIBING_AUDIO },
        {
          status: ContentStatus.PENDING,
          lastStatus: ContentStatus.TRANSCRIBING_AUDIO,
        },
      ],
    }
    const pendings = await this.repository.findMany<Content[]>({
      where: filter,
      include: { media: true, transcription: true },
      take: limit,
    })
    return pendings
  }

  async pendingsTextGeneration(limit = 1) {
    let filter: any = {
      AND: [
        {
          transcription: { isNot: null },
        },
        {
          OR: [
            // Caso 1: TextContent existe e tem promptText preenchido
            {
              textContent: {
                isNot: null,
              },
            },
            // Caso 2: TextContent não existe ainda (primeira vez)
            {
              textContent: null,
            },
          ],
        },
        {
          OR: [
            { status: ContentStatus.GENERATING_TEXT },
            {
              status: ContentStatus.PENDING,
              lastStatus: ContentStatus.GENERATING_TEXT,
            },
          ],
        },
      ],
    }
    const pendings = await this.repository.findMany<Content[]>({
      where: filter,
      include: { media: true, transcription: true, textContent: true },
      take: limit,
    })
    return pendings
  }

  async pendingsRequestPresentation(limit = 1) {
    let filter: any = {
      AND: [
        {
          textContent: {
            isNot: null,
          },
        },
        { presentation: { promptPresentation: { not: null } } },
        {
          OR: [
            { status: ContentStatus.REQUEST_PRESENTATION },
            {
              status: ContentStatus.PENDING,
              lastStatus: ContentStatus.REQUEST_PRESENTATION,
            },
          ],
        },
      ],
    }

    const pendings = await this.repository.findMany<Content[]>({
      where: filter,
      include: {
        media: true,
        transcription: true,
        textContent: true,
        presentation: true,
      },
      take: limit * 2, // Busca mais para filtrar depois
    })

    // Filtra no código para garantir que textContent.generatedText existe
    const filteredPendings = pendings
      .filter(
        (content) =>
          content.textContent &&
          content.textContent.generatedText &&
          content.textContent.generatedText.trim().length > 0
      )
      .slice(0, limit)

    return filteredPendings
  }

  async pendingsPresentationGeneration(limit = 1) {
    let filter: any = {
      AND: [
        { presentation: { presentationId: { not: null } } },
        {
          OR: [
            { status: ContentStatus.GENERATING_PRESENTATION },
            {
              status: ContentStatus.PENDING,
              lastStatus: ContentStatus.GENERATING_PRESENTATION,
            },
          ],
        },
      ],
    }

    const pendings = await this.repository.findMany<Content[]>({
      where: filter,
      include: {
        media: true,
        transcription: true,
        textContent: true,
        presentation: true,
      },
      take: limit,
    })

    return pendings
  }

  async pendingsDownloadPresentation(limit = 1) {
    let filter: any = {
      AND: [
        { presentation: { presentationId: { not: null } } },
        {
          OR: [
            { status: ContentStatus.DOWNLOADING_PRESENTATION },
            {
              status: ContentStatus.PENDING,
              lastStatus: ContentStatus.DOWNLOADING_PRESENTATION,
            },
          ],
        },
      ],
    }

    const pendings = await this.repository.findMany<Content[]>({
      where: filter,
      include: {
        media: true,
        transcription: true,
        textContent: true,
        presentation: true,
      },
      take: limit,
    })

    return pendings
  }
}
