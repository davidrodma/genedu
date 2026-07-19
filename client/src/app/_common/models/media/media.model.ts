import { ID } from "../../types/ID.type"

export interface Media {
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

