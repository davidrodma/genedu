import { Injectable } from "@nestjs/common"
import {
  TranscriptionCreateInput,
  TranscriptionRepository,
  TranscriptionUpdateInput,
} from "../repositories/transcription.repository"
import { ID } from "src/database/types/id.type"
import { ContentStatus } from "src/modules/content/enum/content-status.enum"
import { coloredLog } from "src/common/utilities/console.log.utility"
import { Content } from "src/modules/content/entities/content.entity"
import { ContentService } from "src/modules/content/services/content.service"
import { destinationMedias } from "src/modules/content/constants/vars"
import { OpenAIApi } from "src/modules/api/services/openai/openai.api"
import fs from "fs"
import { MediaService } from "src/modules/media/services/media.service"

@Injectable()
export class TranscriptionService {
  constructor(
    private readonly repository: TranscriptionRepository,
    private readonly openAIApi: OpenAIApi
  ) {}

  async create(data: TranscriptionCreateInput) {
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

  async updateById(id: ID, data: TranscriptionUpdateInput) {
    return await this.repository.updateById(id, data)
  }

  async updateByContentId(contentId: string, data: TranscriptionUpdateInput) {
    return await this.repository.updateByContentId(contentId, data)
  }

  async deleteById(id: ID) {
    return await this.repository.deleteById(id)
  }

  async deleteByContentId(contentId: string) {
    return await this.repository.deleteByContentId(contentId)
  }

  async transcribeAudio(
    content: Content,
    contentService: ContentService,
    mediaService: MediaService
  ) {
    try {
      coloredLog(
        { content: `[START_TRANSCRIPTION_AUDIO]`, color: "yellow" },
        { content: content.id, color: "blue" }
      )

      // Get media record to access audio files
      const media = await mediaService.findByContentId(content.id)
      const parts = media?.audioFilenames?.length
        ? media.audioFilenames
        : media?.mediaFile
          ? [media.mediaFile]
          : []

      if (parts.length === 0) throw new Error("Nenhum arquivo para transcrever")

      let fullText = ""
      let allSegments: Array<{ start: number; end: number; text: string }> = []
      let fallbackSrt = "" // Para modelos que não geram segments

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const absPath = `${destinationMedias}/${part}`

        const params = {
          pathFile: absPath,
          language: content.language,
          prompt: media?.mediaDescription || "Assunto: " + content.subject,
          model: content?.transcription?.transcriptionModel || "whisper-1",
          wantText: true,
          wantSrt: true,
          paragraphize: false,
        }
        coloredLog(
          {
            content: `[START_TRANSCRIBE_PART ${i + 1}/${parts.length}]`,
            color: "cyan",
          },
          { content: part, color: "blue" },
          { content: params, color: "magenta" }
        )

        // 1 chamada → texto + segments (para SRT local)
 
        const resp = await this.openAIApi.transcribeAudio(params)

        // texto legível (quebras)
        fullText += (fullText ? "\n\n" : "") + (resp.text ?? "")

        // Armazenar SRT da primeira parte para fallback
        if (i === 0 && resp.srt) {
          fallbackSrt = resp.srt
        }

        // offset desta parte = fim do último segmento já acumulado
        const base = allSegments.length
          ? allSegments[allSegments.length - 1].end
          : 0

        // acumula segments com offset contínuo
        const segs = Array.isArray(resp.raw?.segments) ? resp.raw.segments : []
        for (const s of segs) {
          const start = base + Number(s.start || 0)
          const end = base + Number(s.end || 0)
          allSegments.push({ start, end, text: s.text || "" })
        }

        coloredLog(
          {
            content: `[FINISHED_TRANSCRIBE_PART ${i + 1}/${parts.length}]`,
            color: "green",
          },
          { content: `${(resp.text || "").slice(0, 60)}...`, color: "bright" }
        )
      }

      // ---- gera SRT único contínuo ----
      const pad = (n: number) => String(n).padStart(2, "0")
      const toTS = (sec: number) => {
        const ms = Math.round((sec % 1) * 1000)
        const s = Math.floor(sec) % 60
        const mT = Math.floor(sec / 60)
        const m = mT % 60
        const h = Math.floor(mT / 60)
        return `${pad(h)}:${pad(m)}:${pad(s)},${String(ms).padStart(3, "0")}`
      }
      const wrap = (t: string, max = 42) => {
        const out: string[] = []
        let line = ""
        for (const w of t.split(/\s+/)) {
          if ((line + " " + w).trim().length > max) {
            out.push(line.trim())
            line = w
          } else line += " " + w
        }
        if (line.trim()) out.push(line.trim())
        return out.join("\n")
      }

      let srtCombined = ""

      if (allSegments.length > 0) {
        // Usar segments quando disponíveis (modelos Whisper)
        let idx = 1
        const srtBlocks = allSegments.map(
          (s) =>
            `${idx++}\n${toTS(s.start)} --> ${toTS(s.end)}\n${wrap(s.text.trim())}`
        )
        srtCombined = srtBlocks.join("\n\n")

        coloredLog({
          content: `[TRANSCRIBE_SRT_SEGMENTS] Using segments SRT, length: ${srtCombined.length}`,
          color: "green",
        })
      } else {
        // Usar SRT básico quando não há segments (modelos GPT Transcribe)
        srtCombined = fallbackSrt

        coloredLog({
          content: `[TRANSCRIBE_SRT_FALLBACK] Using basic SRT, length: ${srtCombined.length}`,
          color: "cyan",
        })
      }

      coloredLog({ content: `[FINISHED_TRANSCRIPION_AUDIO]`, color: "green" })

      // (opcional) grava SRT em disco
      const transcriptFile = `${content.id}.srt`
      const srtPath = `${destinationMedias}/${transcriptFile}`
      fs.writeFileSync(srtPath, srtCombined)

      // Create or update transcription record
      const existingTranscription = await this.findByContentId(content.id)
      if (existingTranscription) {
        await this.updateByContentId(content.id, {
          transcriptionText: fullText,
          transcriptFile,
        })
      } else {
        await this.create({
          transcriptionText: fullText,
          transcriptFile,
          content: { connect: { id: content.id } },
        })
      }

      // Update content status
      const updated = await contentService.updateById(content.id, {
        lastStatus: ContentStatus.GENERATING_TEXT,
        status: ContentStatus.GENERATING_TEXT,
      })
      return updated
    } catch (error: any) {
      const message_error = `[ERROR_TRANSCRIPION_AUDIO] : ${error.message || error}`
      coloredLog({ content: `${message_error}`, color: "red" })
      const updated = await contentService.updateById(content.id, {
        messageError: message_error,
        lastStatus: ContentStatus.TRANSCRIBING_AUDIO,
        status: ContentStatus.ERROR,
      })
      return updated
    }
  }
}
