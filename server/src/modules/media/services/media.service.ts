import { Injectable } from "@nestjs/common"
import {
  MediaCreateInput,
  MediaRepository,
  MediaUpdateInput,
} from "../repositories/media.repository"
import { ID } from "src/database/types/id.type"
import { Content } from "src/modules/content/entities/content.entity"
import { coloredLog } from "src/common/utilities/console.log.utility"
import { ContentStatus } from "src/modules/content/enum/content-status.enum"
import { destinationMedias } from "src/modules/content/constants/vars"
import youtubeDlExec from "youtube-dl-exec"
import fs from "fs"
import ffmpegStatic from "ffmpeg-static"
import ffmpeg from "fluent-ffmpeg"
import { ContentService } from "src/modules/content/services/content.service"
import path from "path"

@Injectable()
export class MediaService {
  constructor(private readonly repository: MediaRepository) {}

  async create(data: MediaCreateInput) {
    return await this.repository.create({ data })
  }

  async findById(id: ID) {
    return await this.repository.findUnique({
      where: { id },
      include: { content: true },
    })
  }

  async findByContentId(contentId: string) {
    return await this.repository.findUnique({
      where: { contentId },
      include: { content: true },
    })
  }

  async updateById(id: ID, data: MediaUpdateInput) {
    return await this.repository.updateById(id, data)
  }

  async updateByContentId(contentId: string, data: MediaUpdateInput) {
    return await this.repository.updateByContentId(contentId, data)
  }

  async deleteById(id: ID) {
    return await this.repository.deleteById(id)
  }

  async deleteByContentId(contentId: string) {
    return await this.repository.deleteByContentId(contentId)
  }

  async getMediaFileInfo(
    filePath: string
  ): Promise<{ sizeBytes: number; duration: number }> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        coloredLog({
          content: `File does not exist: ${filePath}`,
          color: "red",
        })
        return { sizeBytes: 0, duration: 0 }
      }

      // Get file size using Node.js (always works)
      const stats = fs.statSync(filePath)
      const sizeBytes = stats.size

      coloredLog({
        content: `File exists: ${filePath}, Size: ${sizeBytes} bytes`,
        color: "cyan",
      })

      // If file is too small, it might be corrupted
      if (sizeBytes < 1000) {
        coloredLog({
          content: `File too small (${sizeBytes} bytes), might be corrupted`,
          color: "yellow",
        })
        return { sizeBytes, duration: 0 }
      }

      // Check file extension
      const fileExtension = filePath.toLowerCase().split(".").pop()
      coloredLog({
        content: `File extension: ${fileExtension}`,
        color: "cyan",
      })

      // For media files, we can estimate duration based on file size
      // This is a fallback when ffmpeg is not available
      let duration = 0

      if (fileExtension === "mp4") {
        // Rough estimation: MP4 video ≈ 1MB per minute (varies greatly)
        duration = Math.round(sizeBytes / 1000000) * 60
      } else if (fileExtension === "mp3") {
        // Rough estimation: MP3 at 128kbps ≈ 16KB per second
        duration = Math.round(sizeBytes / 16000)
      } else if (fileExtension === "m4a") {
        // Rough estimation: M4A at 128kbps ≈ 16KB per second
        duration = Math.round(sizeBytes / 16000)
      } else if (fileExtension === "webm") {
        // Rough estimation: WebM ≈ 20KB per second (audio) or 1MB per minute (video)
        duration =
          sizeBytes > 10000000
            ? Math.round(sizeBytes / 1000000) * 60
            : Math.round(sizeBytes / 20000)
      } else if (fileExtension === "mkv") {
        // Rough estimation: MKV video ≈ 1MB per minute
        duration = Math.round(sizeBytes / 1000000) * 60
      }

      coloredLog({
        content: `Media info - Size: ${sizeBytes} bytes, Duration: ${duration} seconds (estimated)`,
        color: "green",
      })

      return { sizeBytes, duration }
    } catch (error) {
      coloredLog({
        content: `Error in getMediaFileInfo: ${error}`,
        color: "red",
      })
      return { sizeBytes: 0, duration: 0 }
    }
  }

  // Alternative download method using youtube-dl-exec (most robust)
  private async downloadWithYoutubeDlExec(
    videoURL: string,
    outputPath: string
  ): Promise<{ success: boolean; error?: string; filename?: string }> {
    try {
      coloredLog({
        content: `[YOUTUBE-DL-EXEC] Starting download: ${videoURL}`,
        color: "cyan",
      })

      // Extract filename and directory from outputPath
      const filename = outputPath.split("/").pop()
      const outputDir = outputPath.replace(filename, "")
      const filenameWithoutExt = filename.replace(/\.[^/.]+$/, "") // Remove extension
      const finalOutputPath = `${outputDir}/${filenameWithoutExt}.%(ext)s`

      coloredLog({
        content: `[YOUTUBE-DL-EXEC] Output path: ${finalOutputPath}`,
        color: "cyan",
      })

      // Use youtube-dl-exec to download - try multiple format fallbacks
      // Try different format selections to avoid 403 errors
      const result = await youtubeDlExec(videoURL, {
        output: finalOutputPath,
        format:
          "best[ext=mp4][height<=720]/best[height<=720]/bestvideo+bestaudio/best", // Multiple fallbacks
        noPlaylist: true,
        verbose: true,
        // Minimal headers to avoid detection
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        referer: "https://www.youtube.com/",
        // Additional options to improve reliability
        noCheckCertificates: true,
        // Retry on errors
        retries: 3,
        // Add more time for network operations
        socketTimeout: 60,
      })

      coloredLog({
        content: `[YOUTUBE-DL-EXEC] Download completed successfully`,
        color: "green",
      })

      // Wait a moment for file system to settle
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if file was created
      const files = fs.readdirSync(outputDir)
      const downloadedFile = files.find(
        (file) =>
          file.includes(".mp4") ||
          file.includes(".webm") ||
          file.includes(".mkv")
      )

      if (downloadedFile) {
        coloredLog({
          content: `[YOUTUBE-DL-EXEC] Found downloaded file: ${downloadedFile}`,
          color: "cyan",
        })

        // Return the actual downloaded filename with correct extension
        const actualFilename = `${filenameWithoutExt}${downloadedFile.substring(downloadedFile.lastIndexOf("."))}`

        coloredLog({
          content: `[YOUTUBE-DL-EXEC] File downloaded successfully: ${actualFilename}`,
          color: "green",
        })

        return { success: true, filename: actualFilename }
      } else {
        coloredLog({
          content: `[YOUTUBE-DL-EXEC] No video file found after download`,
          color: "red",
        })
        return { success: false, error: "No video file found after download" }
      }
    } catch (error) {
      coloredLog(
        {
          content: `[YOUTUBE-DL-EXEC] Error:`,
          color: "red",
        },
        {
          content: error?.message || error?.toString(),
          color: "red",
        },
        {
          content: error,
          color: "red",
        }
      )
      return { success: false, error: error.toString() }
    }
  }

  downloadMedia = async (content: Content, contentService: ContentService) =>
    new Promise<Content>(async (resolve, reject) => {
      // Get media record to access YouTube link
      const media = await this.findByContentId(content.id)
      if (!media || !media.youtubeLink) {
        reject(new Error("YouTube link not found in media record"))
        return
      }

      const videoURL = media.youtubeLink
      const filenameOut = `${content.id}.mp4`

      // Use youtube-dl-exec for download (MP4 video for better SRT sync)
      coloredLog({
        content: `[START_DOWNLOAD_VIDEO] Using youtube-dl-exec: ${videoURL}`,
        color: "cyan",
      })

      const youtubeDlResult = await this.downloadWithYoutubeDlExec(
        videoURL,
        `${destinationMedias}/${filenameOut}`
      )

      if (youtubeDlResult.success) {
        coloredLog({
          content: `[FINISHED_DOWNLOAD_VIDEO] via youtube-dl-exec`,
          color: "green",
        })

        // Use the actual filename returned by downloadWithYoutubeDlExec
        const actualFilename = youtubeDlResult.filename || filenameOut

        // Get media file info for downloaded video
        let sizeBytes = 0
        let duration = 0
        try {
          const filePath = `${destinationMedias}/${actualFilename}`
          const mediaInfo = await this.getMediaFileInfo(filePath)
          sizeBytes = mediaInfo.sizeBytes
          duration = mediaInfo.duration
        } catch (error) {
          coloredLog({
            content: `Error getting media info for downloaded video: ${error}`,
            color: "red",
          })
        }

        // Update content status
        const updatedContent = await contentService.updateById(content.id, {
          lastStatus: ContentStatus.CONVERTING_AUDIO,
          status: ContentStatus.CONVERTING_AUDIO,
        })
        content = { ...content, ...updatedContent }

        // Update media record with downloaded file info
        await this.updateByContentId(content.id, {
          mediaFile: actualFilename,
          sizeBytes,
          duration,
        })
        resolve(content)
      } else {
        const message_error = `[ERROR_DOWNLOAD_VIDEO] : youtube-dl-exec failed: ${youtubeDlResult.error}`
        const updatedContent = await contentService.updateById(content.id, {
          messageError: message_error,
          lastStatus: ContentStatus.DOWNLOADING_MEDIA,
          status: ContentStatus.ERROR,
        })
        content = { ...content, ...updatedContent }
        reject(content)
      }
    })

  private readonly AUDIO_ONLY_EXTENSIONS = [
    ".mp3",
    ".m4a",
    ".wav",
    ".aac",
    ".ogg",
    ".oga",
    ".flac",
  ]

  createAudio = async (
    content: Content,
    contentService: ContentService
  ): Promise<Content> =>
    new Promise(async (resolve, reject) => {
      try {
        // Get media record to access media file
        const media = await this.findByContentId(content.id)
        if (!media || !media.mediaFile) {
          throw new Error("Arquivo de entrada ausente em media.mediaFile")
        }

        const filenameIn = media.mediaFile
        const inputPath = `${destinationMedias}/${filenameIn}`
        const fileExtension = path.extname(filenameIn || "").toLowerCase()
        const isAudioOnly = this.AUDIO_ONLY_EXTENSIONS.includes(fileExtension)

        // Limpa partes antigas (se existirem)
        const prefix = `${content.id}-`
        const ext = `.mp3`
        const outPattern = `${content.id}-%03d${ext}`
        const outFullPattern = `${destinationMedias}/${outPattern}`

        // apaga possíveis restos antigos
        try {
          const all = fs.readdirSync(destinationMedias)
          for (const f of all) {
            if (f.startsWith(prefix) && f.endsWith(ext)) {
              fs.unlinkSync(`${destinationMedias}/${f}`)
            }
          }
        } catch {}

        coloredLog(
          { content: `[START_CONVERT_AUDIO_SEGMENTS]`, color: "yellow" },
          { content: content.id, color: "blue" }
        )

        const segmentDuration =
          content?.transcription?.transcriptionModel ===
          "gpt-4o-mini-transcribe" || content?.transcription?.transcriptionModel === "gpt-4o-transcribe"
            ? 1300
            : 2000

        const baseOutputOptions = [
          "-f",
          "segment",
          "-segment_time",
          String(segmentDuration),
          "-reset_timestamps",
          "1",
          "-map",
          "0:a:0",
          "-sn",
          "-dn",
          "-write_xing",
          "0",
          "-y",
        ]

        const audioEncodeOptions = isAudioOnly
          ? ["-c:a", "copy"]
          : [
              "-vn",
              "-c:a",
              "libmp3lame",
              "-ar",
              "32000",
              "-ac",
              "1",
              "-b:a",
              "96k",
            ]

        const ffmpegCommand = ffmpeg().input(inputPath)
        /* Old Configuração
        ffmpeg.setFfmpegPath(ffmpegStatic as string)
        ffmpeg()
          .input(`${destinationMedias}/${filenameIn}`)
          // Qualidade baixa para caber confortável e facilitar o upload
          .outputOptions([
            "-ar",
            "48000", // sample rate
            "-ac",
            "1", // mono
            "-b:a",
            "64k", // bitrate
            // Segmentação
            "-f",
            "segment",
            "-segment_time",
            content?.transcription?.transcriptionModel=="gpt-4o-mini-transcribe"?"1300":"2000", // 1200s = 20min por parte (ajuste se quiser)
            "-reset_timestamps",
            "1",
            // evita escrever XING header que pode atrapalhar durações
            "-write_xing",
            "0",
          ])
        */

        ffmpeg.setFfmpegPath(ffmpegStatic as string)
        ffmpegCommand
          .outputOptions([...audioEncodeOptions, ...baseOutputOptions])
          .output(outFullPattern)
          .on("progress", (p) => {
            if (p.percent) console.log(`Processing: ${Math.floor(p.percent)}%`)
          })
          .on("end", async () => {
            coloredLog({
              content: `[FINISHED_CONVERT_AUDIO_SEGMENTS]`,
              color: "green",
            })

            // lista os arquivos gerados
            const generated = fs
              .readdirSync(destinationMedias)
              .filter((f) => f.startsWith(prefix) && f.endsWith(ext))
              .sort() // garante ordem

            if (generated.length === 0) {
              throw new Error("Nenhum segmento foi gerado")
            }

            // Update content status
            const updatedContent = await contentService.updateById(content.id, {
              lastStatus: ContentStatus.TRANSCRIBING_AUDIO,
              status: ContentStatus.TRANSCRIBING_AUDIO,
            })
            content = { ...content, ...updatedContent }

            // Update media record with converted audio files
            await this.updateByContentId(content.id, {
              audioFilenames: generated,
            })

            resolve(content)
          })
          .on("error", async (error) => {
            const message_error = `[ERROR_CONVERT_AUDIO] : ${error.message || error}`
            coloredLog({ content: `${message_error}`, color: "red" })
            const updatedContent = await contentService.updateById(content.id, {
              messageError: message_error,
              lastStatus: ContentStatus.CONVERTING_AUDIO,
              status: ContentStatus.ERROR,
            })
            content = { ...content, ...updatedContent }
            reject(content)
          })
          .run()
      } catch (err: any) {
        const message_error = `[ERROR_CONVERT_AUDIO] : ${err.message || err}`
        coloredLog({ content: `${message_error}`, color: "red" })
        const updated = await contentService.updateById(content.id, {
          messageError: message_error,
          lastStatus: ContentStatus.CONVERTING_AUDIO,
          status: ContentStatus.ERROR,
        })
        reject(updated)
      }
    })
}
