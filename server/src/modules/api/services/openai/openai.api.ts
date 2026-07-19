import { Injectable } from "@nestjs/common"
import fs from "fs"
import OpenAI from "openai"
import { coloredLog } from "src/common/utilities/console.log.utility"
import { ConfigService } from "src/modules/config/services/config.service"

type TranscribeReturn = { text: string; srt?: string; raw?: any }

@Injectable()
export class OpenAIApi {
  private openai: OpenAI

  constructor(private readonly configService: ConfigService) {}

  private async getOpenAIClient(): Promise<OpenAI> {
    if (!this.openai) {
      try {
        const apiKey =
          await this.configService.getValue<string>("openai-api-key")
        if (!apiKey) {
          throw new Error("OpenAI API key not found in configuration")
        }
        this.openai = new OpenAI({ apiKey })
        coloredLog({
          content:
            "[OPENAI_INIT] OpenAI client initialized with database API key",
          color: "green",
        })
      } catch (error) {
        coloredLog({
          content: `[OPENAI_INIT_ERROR] ${error.message}`,
          color: "red",
        })
        throw error
      }
    }
    return this.openai
  }
  private pad(n: number) {
    return String(n).padStart(2, "0")
  }
  private toSrtTS(sec: number) {
    const ms = Math.round((sec % 1) * 1000)
    const s = Math.floor(sec) % 60
    const mTot = Math.floor(sec / 60)
    const m = mTot % 60
    const h = Math.floor(mTot / 60)
    return `${this.pad(h)}:${this.pad(m)}:${this.pad(s)},${String(ms).padStart(3, "0")}`
  }
  private wrapLine(t: string, max = 42) {
    const out: string[] = []
    let line = ""
    for (const word of t.split(/\s+/)) {
      if ((line + " " + word).trim().length > max) {
        out.push(line.trim())
        line = word
      } else {
        line += " " + word
      }
    }
    if (line.trim()) out.push(line.trim())
    return out.join("\n")
  }
  private segmentsToText(
    segments: Array<{ text: string }>,
    paragraphize = true
  ): string {
    if (!segments?.length) return ""
    if (!paragraphize) return segments.map((s) => s.text.trim()).join("\n")
    const lines: string[] = []
    let buf: string[] = []
    for (const s of segments) {
      const t = s.text.trim()
      if (!t) continue
      buf.push(t)
      if (/[.!?…]$/.test(t) || buf.join(" ").length > 400) {
        lines.push(buf.join(" "))
        buf = []
      }
    }
    if (buf.length) lines.push(buf.join(" "))
    return lines.join("\n\n")
  }
  private segmentsToSRT(
    segments: Array<{ start: number; end: number; text: string }>,
    { offset = 0, maxCharsPerLine = 42, startIndex = 1 } = {}
  ): { srt: string; lastIndex: number } {
    let idx = startIndex
    const blocks = segments.map((s) => {
      const a = this.toSrtTS(s.start + offset)
      const b = this.toSrtTS(s.end + offset)
      const body = this.wrapLine(s.text.trim(), maxCharsPerLine)
      return `${idx++}\n${a} --> ${b}\n${body}`
    })
    return { srt: blocks.join("\n\n"), lastIndex: idx - 1 }
  }

  /**
   * Gera um SRT básico quando não temos segments com timestamps
   * Divide o texto em segmentos de tempo estimados baseados na duração média de leitura
   */
  private generateBasicSRT(text: string): string {
    coloredLog({
      content: `[GENERATE_BASIC_SRT] Input text length: ${text?.length || 0}`,
      color: "cyan",
    })

    if (!text || text.trim().length === 0) {
      coloredLog({
        content: `[GENERATE_BASIC_SRT] Empty text, returning empty SRT`,
        color: "yellow",
      })
      return ""
    }

    // Estimativa: ~3 palavras por segundo (velocidade média de fala)
    const wordsPerSecond = 3
    const words = text.trim().split(/\s+/)
    const totalWords = words.length
    const estimatedDuration = Math.max(totalWords / wordsPerSecond, 10) // Mínimo 10 segundos

    coloredLog({
      content: `[GENERATE_BASIC_SRT] Words: ${totalWords}, Estimated duration: ${estimatedDuration}s`,
      color: "cyan",
    })

    // Dividir em segmentos de ~10 segundos cada
    const segmentDuration = 10
    const segments = Math.ceil(estimatedDuration / segmentDuration)
    const wordsPerSegment = Math.ceil(totalWords / segments)

    coloredLog({
      content: `[GENERATE_BASIC_SRT] Segments: ${segments}, Words per segment: ${wordsPerSegment}`,
      color: "cyan",
    })

    let srt = ""
    let currentTime = 0

    for (let i = 0; i < segments; i++) {
      const startTime = currentTime
      const endTime = Math.min(currentTime + segmentDuration, estimatedDuration)

      const startWords = i * wordsPerSegment
      const endWords = Math.min((i + 1) * wordsPerSegment, totalWords)
      const segmentText = words.slice(startWords, endWords).join(" ").trim()

      coloredLog({
        content: `[GENERATE_BASIC_SRT] Segment ${i + 1}: "${segmentText}"`,
        color: "cyan",
      })

      if (segmentText) {
        srt += `${i + 1}\n`
        srt += `${this.toSrtTS(startTime)} --> ${this.toSrtTS(endTime)}\n`
        srt += `${this.wrapLine(segmentText, 42)}\n\n`
      }

      currentTime = endTime
    }

    coloredLog({
      content: `[GENERATE_BASIC_SRT] Generated SRT length: ${srt.length}`,
      color: "green",
    })

    return srt
  }

  async transcribeAudio({
    pathFile,
    language = "pt",
    model = "whisper-1",
    temperature = 0,
    prompt = "",
    paragraphize = true,
    // NEW: pede ambos sem segunda requisição
    wantText = true,
    wantSrt = true,
  }: {
    pathFile: string
    model?: string
    language?: string
    temperature?: number
    prompt?: string
    paragraphize?: boolean
    wantText?: boolean
    wantSrt?: boolean
  }): Promise<TranscribeReturn> {
    try {
      console.time()
      console.log("[START_TRANSCRIBE_OPENAI]")

      // Para obter texto + SRT em 1 call:
      // usar verbose_json quando suportado, senão usar json
      const responseFormat = model.includes("gpt-4o-transcribe")||model.includes("gpt-4o-mini-transcribe")
        ? "json"
        : "verbose_json"

      coloredLog({
        content: `[TRANSCRIBE] Using model: ${model}, response_format: ${responseFormat}`,
        color: "cyan",
      })

      const openai = await this.getOpenAIClient()
      const resp = await openai.audio.transcriptions.create({
        file: fs.createReadStream(pathFile),
        model,
        language,
        response_format: responseFormat,
        prompt,
        temperature,
      } as any)

      coloredLog({ content: `[FINISHED_TRANCRIBE_OPENAI]`, color: "green" })

      const data = resp as any

      
 /*      coloredLog({ content: `[TRANSCRIBE_JSON] Force Error`, color: "red" })
      coloredLog({ content: `[TRANSCRIBE_JSON] data: ${JSON.stringify(data)}`, color: "yellow" })
      throw new Error("Force Error") */
      

      // Quando usar json (modelos que não suportam verbose_json), não temos segments
      if (responseFormat === "json") {
        const text = wantText ? data.text || "" : ""

        coloredLog({
          content: `[TRANSCRIBE_JSON] Text length: ${text.length}, wantSrt: ${wantSrt}`,
          color: "cyan",
        })

        const srt = wantSrt ? this.generateBasicSRT(text) : undefined // SRT básico estimado

        coloredLog({
          content: `[TRANSCRIBE_JSON] Generated SRT length: ${srt?.length || 0}`,
          color: "green",
        })

        return { text, srt, raw: data }
      }

      // Para verbose_json, processar segments normalmente
      const segments = Array.isArray(data?.segments) ? data.segments : []
      const text = wantText ? this.segmentsToText(segments, paragraphize) : ""
      const srt = wantSrt ? this.segmentsToSRT(segments).srt : undefined

      return { text, srt, raw: data }
    } catch (error: any) {
      const message_error = `[ERROR_TRANCRIBE_OPENAI] ${error.message || error}`
      coloredLog({ content: message_error, color: "red" })
      throw new Error(message_error)
    } finally {
      console.timeEnd()
      console.log("[STOP_TRANSCRIBE_OPENAI]")
    }
  }

  async chatCompletions(messages: string[], model = "gpt-4o-mini") {
    coloredLog({ content: "chatCompletions", color: "yellow" })
    const msgs: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      messages.map((msg) => {
        return { role: "user", content: msg }
      })
    const openai = await this.getOpenAIClient()
    const stream = await openai.chat.completions.create({
      model,
      messages: msgs,
      stream: true,
    })
    let response = ""
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      response += content
      process.stdout.write(content)
    }
    return response
  }
}
