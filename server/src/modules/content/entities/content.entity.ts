import { ID } from "src/database/types/id.type"
import { ContentStatus } from "../enum/content-status.enum"
import { Media } from "src/modules/media/entities/media.entity"
import { Transcription } from "src/modules/transcription/entities/transcription.entity"
import { TextContent } from "src/modules/text-content/entities/text-content.entity"
import { Presentation } from "src/modules/presentation/entities/presentation.entity"

export class Content {
  id?: ID
  subject: string
  language: string
  createdAt: Date
  updatedAt: Date
  messageError: string
  media?: Media
  transcription?: Transcription
  textContent?: TextContent
  presentation?: Presentation
  lastStatus: ContentStatus
  status: ContentStatus
}
