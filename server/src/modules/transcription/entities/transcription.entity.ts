import { ID } from "src/database/types/id.type"

export class Transcription {
  id: ID
  contentId: string
  transcriptionText: string
  transcriptFile: string
  transcriptionModel?: string
  createdAt: Date
  updatedAt: Date
}
