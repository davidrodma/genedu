import { ID } from "src/database/types/id.type"

export class Presentation {
  id: ID
  contentId: string
  promptPresentation?: string
  presentationId?: string
  presentationFile?: string
  themeId?: string
  themeName?: string
  numCards?: number
  imageOptions?: string
  imageModel?: string
  imageStyle?: string
  createdAt: Date
  updatedAt: Date
}
