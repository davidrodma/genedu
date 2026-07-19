// TEMPORARILY DISABLED - Module topic was deleted
import { Injectable } from "@nestjs/common"
import { coloredLog } from "src/common/utilities/console.log.utility"
import { ContentStatus } from "src/modules/content/enum/content-status.enum"
import { ContentService } from "src/modules/content/services/content.service"
import { MediaService } from "src/modules/media/services/media.service"
import { PresentationService } from "src/modules/presentation/services/presentation.service"
import { TextContentService } from "src/modules/text-content/services/text-content.service"
import { TranscriptionService } from "src/modules/transcription/services/transcription.service"

const LIMIT = 1
@Injectable()
export class ProcessingService {
  constructor(
    private readonly contentService: ContentService,
    private readonly mediaService: MediaService,
    private readonly transcriptionService: TranscriptionService,
    private readonly textContentService: TextContentService,
    private readonly presentationService: PresentationService
  ) {}

  async processDownloadMedia() {
    try {
      let result: { success: number; errors: string[] } = {
        success: 0,
        errors: [],
      }
      const pendings = await this.contentService.pendingsDownloadsMedia(LIMIT)
      coloredLog(
        { content: `Run Download Media Pendings`, color: "cyan" },
        {
          content: pendings.length,
          color: pendings.length ? "yellow" : "bright",
        }
      )
      if (pendings?.length <= 0) {
        return result
      }
      const pendingIds = []
      for (const [i, pendingReg] of pendings.entries()) {
        if (pendingReg.status == ContentStatus.PENDING) {
          pendings[i].status = ContentStatus.DOWNLOADING_MEDIA
          pendingIds.push(pendingReg.id)
        }
      }
      if (pendingIds?.length > 0) {
        await this.contentService.updateManyByIds(pendingIds, {
          status: ContentStatus.DOWNLOADING_MEDIA,
        })
      }

      const promises = pendings.map((content) =>
        this.mediaService.downloadMedia(content, this.contentService)
      )
      const registersSolved = await Promise.all(promises)
      for (const register of registersSolved) {
        result.success += register.status != ContentStatus.ERROR ? 1 : 0
        if (register.status == ContentStatus.ERROR) {
          result.errors.push(register.messageError)
        }
      }
      if (result.errors.length > 0) {
        coloredLog({
          content: `${result.errors.length} Downloads Videos Errors`,
          color: "red",
        })
      }
      if (result.success > 0) {
        coloredLog({
          content: `${result.success} Downloads Videos successfully!!`,
          color: "green",
        })
      }
      return result
    } catch (e: Error | any) {
      const message_error = `Error ContentService.processDownload: ${e?.message || e}`
      coloredLog({ content: message_error, color: "red" })
      throw message_error
    }
  }

  async processConversionAudio() {
    try {
      let result: { success: number; errors: string[] } = {
        success: 0,
        errors: [],
      }
      const pendings = await this.contentService.pendingsConversionsAudio(LIMIT)
      coloredLog(
        { content: `Run Conversion Audio Pendings`, color: "cyan" },
        {
          content: pendings.length,
          color: pendings.length ? "yellow" : "bright",
        }
      )
      if (pendings?.length <= 0) {
        return result
      }
      const pendingIds = []
      for (const [i, pendingReg] of pendings.entries()) {
        if (pendingReg.status == ContentStatus.PENDING) {
          pendings[i].status = ContentStatus.CONVERTING_AUDIO
          pendingIds.push(pendingReg.id)
        }
      }
      if (pendingIds?.length > 0) {
        await this.contentService.updateManyByIds(pendingIds, {
          status: ContentStatus.CONVERTING_AUDIO,
        })
      }

      const promises = pendings.map((content) =>
        this.mediaService.createAudio(content, this.contentService)
      )
      const registersSolved = await Promise.all(promises)
      for (const register of registersSolved) {
        result.success += register.status != ContentStatus.ERROR ? 1 : 0
        if (register.status == ContentStatus.ERROR) {
          result.errors.push(register.messageError)
        }
      }
      if (result.errors.length > 0) {
        coloredLog({
          content: `${result.errors.length} Audio Conversion Errors`,
          color: "red",
        })
      }
      if (result.success > 0) {
        coloredLog({
          content: `${result.success} Audio Conversion successfully!!`,
          color: "green",
        })
      }
      return result
    } catch (e: Error | any) {
      const message_error = `Error ContentService.processConversion: ${e.message || e}`
      coloredLog({ content: message_error, color: "red" })
      throw message_error
    }
  }

  async processTranscription() {
    try {
      let result: { success: number; errors: string[] } = {
        success: 0,
        errors: [],
      }
      const pendings = await this.contentService.pendingsTranscriptions(LIMIT)
      coloredLog(
        { content: `Run Transcriptions Pendings`, color: "cyan" },
        {
          content: pendings.length,
          color: pendings.length ? "yellow" : "bright",
        }
      )
      if (pendings?.length <= 0) {
        return result
      }
      const pendingIds = []
      for (const [i, pendingReg] of pendings.entries()) {
        if (pendingReg.status == ContentStatus.PENDING) {
          pendings[i].status = ContentStatus.TRANSCRIBING_AUDIO
          pendingIds.push(pendingReg.id)
        }
      }
      if (pendingIds?.length > 0) {
        await this.contentService.updateManyByIds(pendingIds, {
          status: ContentStatus.TRANSCRIBING_AUDIO,
        })
      }

      const promises = pendings.map((content) =>
        this.transcriptionService.transcribeAudio(
          content,
          this.contentService,
          this.mediaService
        )
      )
      const registersSolved = await Promise.all(promises)
      for (const register of registersSolved) {
        result.success += register.status != ContentStatus.ERROR ? 1 : 0
        if (register.status == ContentStatus.ERROR) {
          result.errors.push(register.messageError)
        }
      }
      if (result.errors.length > 0) {
        coloredLog({
          content: `${result.errors.length} Transcriptions Errors`,
          color: "red",
        })
      }
      if (result.success > 0) {
        coloredLog({
          content: `${result.success} Transcriptions successfully!!`,
          color: "green",
        })
      }
      return result
    } catch (e: Error | any) {
      const message_error = `Error ContentService.processTranscriptions: ${e.message || e}`
      coloredLog({ content: message_error, color: "red" })
      throw message_error
    }
  }

  async processText() {
    try {
      let result: { success: number; errors: string[] } = {
        success: 0,
        errors: [],
      }
      const pendings = await this.contentService.pendingsTextGeneration(LIMIT)
      coloredLog(
        { content: `Run Text Generation Pendings`, color: "cyan" },
        {
          content: pendings.length,
          color: pendings.length ? "yellow" : "bright",
        }
      )
      if (pendings?.length <= 0) {
        return result
      }
      const pendingIds = []
      for (const [i, pendingReg] of pendings.entries()) {
        if (pendingReg.status == ContentStatus.PENDING) {
          pendings[i].status = ContentStatus.GENERATING_TEXT
          pendingIds.push(pendingReg.id)
        }
      }
      if (pendingIds?.length > 0) {
        await this.contentService.updateManyByIds(pendingIds, {
          status: ContentStatus.GENERATING_TEXT,
        })
      }

      const promises = pendings.map((content) =>
        this.textContentService.generateText(
          content,
          this.contentService,
          this.transcriptionService
        )
      )
      const registersSolved = await Promise.all(promises)
      for (const register of registersSolved) {
        result.success += register.status != ContentStatus.ERROR ? 1 : 0
        if (register.status == ContentStatus.ERROR) {
          result.errors.push(register.messageError)
        }
      }
      if (result.errors.length > 0) {
        coloredLog({
          content: `${result.errors.length} Text Generation Errors`,
          color: "red",
        })
      }
      if (result.success > 0) {
        coloredLog({
          content: `${result.success} Text Generation successfully!!`,
          color: "green",
        })
      }
      return result
    } catch (e: Error | any) {
      const message_error = `Error ContentService.processText: ${e.message || e}`
      coloredLog({ content: message_error, color: "red" })
      throw message_error
    }
  }

  async processRequestPresentation() {
    try {
      let result: { success: number; errors: string[] } = {
        success: 0,
        errors: [],
      }

      const pendings =
        await this.contentService.pendingsRequestPresentation(LIMIT)
      coloredLog(
        { content: `Run Request Presentation Pendings`, color: "cyan" },
        {
          content: pendings.length,
          color: pendings.length ? "yellow" : "bright",
        }
      )
      if (pendings?.length <= 0) {
        return result
      }
      const pendingIds = []
      for (const [i, pendingReg] of pendings.entries()) {
        if (pendingReg.status == ContentStatus.PENDING) {
          pendings[i].status = ContentStatus.REQUEST_PRESENTATION
          pendingIds.push(pendingReg.id)
        }
      }
      if (pendingIds?.length > 0) {
        await this.contentService.updateManyByIds(pendingIds, {
          status: ContentStatus.REQUEST_PRESENTATION,
        })
      }

      const promises = pendings.map((content) =>
        this.presentationService.requestPresentation(
          content,
          this.contentService,
          this.textContentService
        )
      )
      const registersSolved = await Promise.all(promises)
      for (const register of registersSolved) {
        result.success += register.status != ContentStatus.ERROR ? 1 : 0
        if (register.status == ContentStatus.ERROR) {
          result.errors.push(register.messageError)
        }
      }
      if (result.errors.length > 0) {
        coloredLog({
          content: `${result.errors.length} Request Presentation Errors`,
          color: "red",
        })
      }
      if (result.success > 0) {
        coloredLog({
          content: `${result.success} Request Presentation successfully!!`,
          color: "green",
        })
      }
      return result
    } catch (e: Error | any) {
      const message_error = `Error ContentService.processRequestPresentation: ${e.message || e}`
      coloredLog({ content: message_error, color: "red" })
      throw message_error
    }
  }

  async processPresentationGeneration() {
    try {
      let result: { success: number; errors: string[] } = {
        success: 0,
        errors: [],
      }

      const pendings =
        await this.contentService.pendingsPresentationGeneration(LIMIT)
      coloredLog(
        {
          content: `Run Presentation Generation Check Pendings`,
          color: "cyan",
        },
        {
          content: pendings.length,
          color: pendings.length ? "yellow" : "bright",
        }
      )
      if (pendings?.length <= 0) {
        return result
      }
      const pendingIds = []
      for (const [i, pendingReg] of pendings.entries()) {
        if (pendingReg.status == ContentStatus.PENDING) {
          pendings[i].status = ContentStatus.GENERATING_PRESENTATION
          pendingIds.push(pendingReg.id)
        }
      }
      if (pendingIds?.length > 0) {
        await this.contentService.updateManyByIds(pendingIds, {
          status: ContentStatus.GENERATING_PRESENTATION,
        })
      }

      const promises = pendings.map((content) =>
        this.presentationService.checkPresentationStatus(
          content,
          this.contentService
        )
      )
      const registersSolved = await Promise.all(promises)
      for (const register of registersSolved) {
        result.success += register.status != ContentStatus.ERROR ? 1 : 0
        if (register.status == ContentStatus.ERROR) {
          result.errors.push(register.messageError)
        }
      }
      if (result.errors.length > 0) {
        coloredLog({
          content: `${result.errors.length} Presentation Generation Check Errors`,
          color: "red",
        })
      }
      if (result.success > 0) {
        coloredLog({
          content: `${result.success} Presentation Generation Check successfully!!`,
          color: "green",
        })
      }
      return result
    } catch (e: Error | any) {
      const message_error = `Error ContentService.processPresentationGeneration: ${e.message || e}`
      coloredLog({ content: message_error, color: "red" })
      throw message_error
    }
  }

  async processDownloadPresentation() {
    try {
      let result: { success: number; errors: string[] } = {
        success: 0,
        errors: [],
      }

      const pendings =
        await this.contentService.pendingsDownloadPresentation(LIMIT)
      coloredLog(
        { content: `Run Download Presentation Pendings`, color: "cyan" },
        {
          content: pendings.length,
          color: pendings.length ? "yellow" : "bright",
        }
      )
      if (pendings?.length <= 0) {
        return result
      }
      const pendingIds = []
      for (const [i, pendingReg] of pendings.entries()) {
        if (pendingReg.status == ContentStatus.PENDING) {
          pendings[i].status = ContentStatus.DOWNLOADING_PRESENTATION
          pendingIds.push(pendingReg.id)
        }
      }
      if (pendingIds?.length > 0) {
        await this.contentService.updateManyByIds(pendingIds, {
          status: ContentStatus.DOWNLOADING_PRESENTATION,
        })
      }

      const promises = pendings.map((content) =>
        this.presentationService.downloadPresentation(
          content,
          this.contentService
        )
      )
      const registersSolved = await Promise.all(promises)
      for (const register of registersSolved) {
        result.success += register.status != ContentStatus.ERROR ? 1 : 0
        if (register.status == ContentStatus.ERROR) {
          result.errors.push(register.messageError)
        }
      }
      if (result.errors.length > 0) {
        coloredLog({
          content: `${result.errors.length} Download Presentation Errors`,
          color: "red",
        })
      }
      if (result.success > 0) {
        coloredLog({
          content: `${result.success} Download Presentation successfully!!`,
          color: "green",
        })
      }
      return result
    } catch (e: Error | any) {
      const message_error = `Error ContentService.processDownloadPresentation: ${e.message || e}`
      coloredLog({ content: message_error, color: "red" })
      throw message_error
    }
  }
}
