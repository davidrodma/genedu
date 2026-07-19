import { Injectable } from "@nestjs/common"
import {
  TextContentCreateInput,
  TextContentRepository,
  TextContentUpdateInput,
} from "../repositories/text-content.repository"
import { ID } from "src/database/types/id.type"
import { coloredLog } from "src/common/utilities/console.log.utility"
import puppeteer from "puppeteer"
import { TranscriptionService } from "src/modules/transcription/services/transcription.service"
import { ContentStatus } from "src/modules/content/enum/content-status.enum"
import { ContentService } from "src/modules/content/services/content.service"
import { OpenAIApi } from "src/modules/api/services/openai/openai.api"
import { destinationDocs } from "src/modules/content/constants/vars"
import fs from "fs"
import {
  formatFileName,
  getUniqueFileName,
} from "src/common/utilities/file.utility"
import { Content } from "src/modules/content/entities/content.entity"

@Injectable()
export class TextContentService {
  constructor(
    private readonly repository: TextContentRepository,
    private readonly openAIApi: OpenAIApi
  ) {}

  async create(data: TextContentCreateInput) {
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

  async updateById(id: ID, data: TextContentUpdateInput) {
    return await this.repository.updateById(id, data)
  }

  async updateByContentId(contentId: string, data: TextContentUpdateInput) {
    return await this.repository.updateByContentId(contentId, data)
  }

  async deleteById(id: ID) {
    return await this.repository.deleteById(id)
  }

  async deleteByContentId(contentId: string) {
    return await this.repository.deleteByContentId(contentId)
  }

  async generateText(
    content: Content,
    contentService: ContentService,
    transcriptionService: TranscriptionService
  ) {
    try {
      coloredLog(
        { content: `[START_GENERATE_TEXT]`, color: "yellow" },
        { content: content.id, color: "blue" }
      )

      // Get transcription from TranscriptionService
      const transcription = await transcriptionService.findByContentId(
        content.id
      )
      if (!transcription || !transcription.transcriptionText) {
        throw new Error("Transcrição não encontrada")
      }

      // Get textContent record to access promptText
      const textContent = await this.findByContentId(content.id)
      if (!textContent) {
        throw new Error("Prompt de texto não encontrado")
      }

      // Combina o prompt com a transcrição
      const messages = [
        textContent?.promptText || "",
        `\n\nGere conteúdo com base na transcrição abaixo:\n\n`,
        transcription.transcriptionText,
      ]

      // Chama a API do ChatGPT
      const generatedText = await this.openAIApi.chatCompletions(
        messages,
        textContent?.textModel || "gpt-5.4-mini"
      )

      if (!generatedText) {
        throw new Error("Nenhum texto foi gerado pela API")
      }

      coloredLog({ content: `[FINISHED_GENERATE_TEXT]`, color: "green" })

      // Gera PDF formatado
      const textFileName = await this.generatePDF(content, generatedText)

      coloredLog({
        content: `[GENERATED_PDF] File: ${textFileName}`,
        color: "green",
      })

      // Create or update textContent record
      if (textContent) {
        await this.updateByContentId(content.id, {
          generatedText: generatedText,
          textFile: textFileName,
        })
      } else {
        await this.create({
          content: { connect: { id: content.id } },
          promptText: "",
          generatedText: generatedText,
          textFile: textFileName,
        })
      }

      // Update content status
      const updated = await contentService.updateById(content.id, {
        lastStatus: ContentStatus.REQUEST_PRESENTATION,
        status: ContentStatus.REQUEST_PRESENTATION,
      })

      return updated
    } catch (error: any) {
      const message_error = `[ERROR_GENERATE_TEXT] : ${error.message || error}`
      coloredLog({ content: `${message_error}`, color: "red" })
      const updated = await contentService.updateById(content.id, {
        messageError: message_error,
        lastStatus: ContentStatus.GENERATING_TEXT,
        status: ContentStatus.ERROR,
      })
      return updated
    }
  }

  private convertMarkdownToHtml(markdown: string): string {
    // Função para converter Markdown básico para HTML
    let html = markdown

    // Code blocks primeiro (para evitar conflitos)
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>")
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>")
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>")

    // Bold e Italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/__(.*?)__/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
    html = html.replace(/_(.*?)_/g, "<em>$1</em>")

    // Inline code
    html = html.replace(/`(.*?)`/g, "<code>$1</code>")

    // Processar listas
    const lines = html.split("\n")
    const processedLines = []
    let inList = false
    let listType = "ul"

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Verificar se é uma linha de lista
      const bulletMatch = line.match(/^[\s]*[\*\-] (.+)/)
      const numberMatch = line.match(/^[\s]*\d+\. (.+)/)

      if (bulletMatch || numberMatch) {
        if (!inList) {
          listType = numberMatch ? "ol" : "ul"
          processedLines.push(`<${listType}>`)
          inList = true
        }
        const content = bulletMatch ? bulletMatch[1] : numberMatch[1]
        processedLines.push(`<li>${content}</li>`)
      } else {
        if (inList) {
          processedLines.push(`</${listType}>`)
          inList = false
        }
        processedLines.push(line)
      }
    }

    // Fechar lista se ainda estiver aberta
    if (inList) {
      processedLines.push(`</${listType}>`)
    }

    html = processedLines.join("\n")

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    // Quebrar texto longo em palavras para melhor formatação
    // Adiciona quebras de linha em palavras muito longas
    html = html.replace(/(\S{50,})/g, (match) => {
      // Quebra palavras muito longas a cada 45 caracteres
      return match.replace(/(.{45})/g, "$1\u200B") // Zero-width space
    })

    // Line breaks - convert \n\n to paragraph breaks
    html = html.replace(/\n\n/g, "</p><p>")

    // Convert remaining \n to <br>
    html = html.replace(/\n/g, "<br>")

    // Limpar <br> tags desnecessárias antes de elementos de bloco
    html = html.replace(/<br><(h[1-6]|ul|ol|li|pre|p)>/g, "<$1>")
    html = html.replace(/<\/(h[1-6]|ul|ol|li|pre|p)><br>/g, "</$1>")

    // Wrap em parágrafos se necessário
    if (!html.startsWith("<")) {
      html = "<p>" + html + "</p>"
    }

    return html
  }

  private async generatePDF(
    content: Content,
    generatedText: string
  ): Promise<string> {
    try {
      // Garante que a pasta docs existe
      if (!fs.existsSync(destinationDocs)) {
        fs.mkdirSync(destinationDocs, { recursive: true })
      }

      // Formata o nome do arquivo baseado no subject
      const baseFileName = formatFileName(content.subject)
      const textFileName = getUniqueFileName(
        destinationDocs,
        baseFileName,
        ".pdf",
        content.id
      )
      const pdfPath = `${destinationDocs}/${textFileName}`

      coloredLog({
        content: `[GENERATE_PDF] Creating PDF: ${textFileName}`,
        color: "cyan",
      })

      // Converte Markdown para HTML
      const formattedContent = this.convertMarkdownToHtml(generatedText)

      coloredLog({
        content: `[GENERATE_PDF] Converted Markdown to HTML`,
        color: "cyan",
      })

      // Cria HTML formatado para o PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="${content.language}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${content.subject}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 40px;
              color: #333;
              background: white;
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #16a34a;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #16a34a;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 20px;
            }
            .metadata {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #888;
              margin-top: 20px;
            }
            .content {
              font-size: 14px;
              text-align: left;
              margin-bottom: 30px;
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
              max-width: 100%;
            }
            .content h1, .content h2, .content h3 {
              color: #16a34a;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .content h1 {
              font-size: 22px;
              border-bottom: 2px solid #16a34a;
              padding-bottom: 5px;
            }
            .content h2 {
              font-size: 18px;
            }
            .content h3 {
              font-size: 16px;
            }
            .content p {
              margin-bottom: 15px;
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
            }
            .content ul, .content ol {
              margin-bottom: 15px;
              padding-left: 20px;
            }
            .content li {
              margin-bottom: 5px;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            .content strong {
              font-weight: bold;
              color: #333;
            }
            .content em {
              font-style: italic;
              color: #555;
            }
            .content code {
              background-color: #f4f4f4;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
              font-size: 13px;
              color: #d63384;
            }
            .content pre {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #16a34a;
              margin: 15px 0;
              overflow-x: auto;
            }
            .content pre code {
              background-color: transparent;
              padding: 0;
              color: #333;
              font-size: 12px;
            }
            .content a {
              color: #16a34a;
              text-decoration: none;
            }
            .content a:hover {
              text-decoration: underline;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #888;
            }
            /* Melhorias para quebra de linha */
            .content * {
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
            }
            
            /* Quebra de linha forçada em elementos específicos */
            .content h1, .content h2, .content h3 {
              word-break: break-word;
              line-height: 1.3;
            }
            
            /* Melhora a formatação de código */
            .content code {
              white-space: pre-wrap;
              word-break: break-all;
            }
            
            /* Melhora a formatação de pre */
            .content pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            @page {
              margin: 2cm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${content.subject}</div>
            <div class="subtitle">Material Educacional Gerado por IA</div>
            <div class="metadata">
              <span>Idioma: ${content.language.toUpperCase()}</span>
              <span>Gerado em: ${new Date().toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
          
          <div class="content">
            ${formattedContent}
          </div>
          
          <div class="footer">
            <p>Documento gerado automaticamente pelo sistema GenEdu</p>
          </div>
        </body>
        </html>
      `

      // Inicia o navegador Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })

      const page = await browser.newPage()

      // Define o conteúdo HTML
      await page.setContent(htmlContent, { waitUntil: "networkidle0" })

      // Gera o PDF
      await page.pdf({
        path: pdfPath,
        format: "A4",
        margin: {
          top: "2cm",
          right: "2cm",
          bottom: "2cm",
          left: "2cm",
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `
          <div style="font-size: 10px; color: #888; text-align: center; width: 100%;">
            Página <span class="pageNumber"></span> de <span class="totalPages"></span>
          </div>
        `,
      })

      await browser.close()

      coloredLog({
        content: `[PDF_CREATED] File saved: ${pdfPath}`,
        color: "green",
      })

      return textFileName
    } catch (error: any) {
      coloredLog({
        content: `[ERROR_GENERATE_PDF] ${error.message}`,
        color: "red",
      })
      throw error
    }
  }
}
