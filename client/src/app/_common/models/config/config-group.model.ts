import { StatusDefault } from "../../enums/status.default.enum"
import { ID } from "../../types/ID.type"
import { Config } from "./config.model"

export interface ConfigGroup {
  id?: ID
  title: string
  createdAt?: Date
  updatedAt?: Date
  status?: StatusDefault
  configs?: Config[]
}
