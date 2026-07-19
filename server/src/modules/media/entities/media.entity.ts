import { ID } from "src/database/types/id.type"

export class Media {
  id?: ID
  contentId: string
  duration?: number
  sizeBytes?: number
  sourceType: string
  youtubeLink?: string
  mediaFile?: string
  mediaDescription?: string
  audioFilenames?: string[]
  createdAt: Date
  updatedAt: Date
}

