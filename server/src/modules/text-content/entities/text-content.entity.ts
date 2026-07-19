import { ID } from "src/database/types/id.type"

export class TextContent {
  id: ID
  contentId: string
  promptText?: string
  generatedText?: string
  textFile?: string
  textModel?: string
  createdAt: Date
  updatedAt: Date
}
