import { ID } from "../../types/ID.type"

export interface Presentation {
  id?: ID
  contentId?: string
  promptPresentation?: string
  presentationId?: string
  presentationFile?: string
  themeId?: string
  themeName?: string
  numCards?: number
  imageOptions?: string
  imageModel?: string
  imageStyle?: string
  createdAt?: Date
  updatedAt?: Date
}
