import { ID } from "../../types/ID.type"
import { ContentStatus } from "./content-status.enum"
import { Media } from "../media/media.model"
import { Transcription } from "../transcription/transcription.model"
import { TextContent } from "../text-content/text-content.model"
import { Presentation } from "../presentation/presentation.model"

export interface Content {
  id?: ID
  subject: string
  language: string
  createdAt: Date
  updatedAt: Date
  mediaDescription?: string
  messageError: string
  lastStatus: ContentStatus
  status: ContentStatus
  media?: Media
  transcription?: Transcription
  textContent?: TextContent
  presentation?: Presentation
}
