import { ConfigGroup } from '@prisma/client'
import { StatusDefault } from 'src/common/enums/status.default.enum'
import { ConfigType } from '../enum/config-type.enum'

export class Config {
  id?: string
  name: string
  title: string
  description: string
  configGroupId: string
  configGroup: ConfigGroup
  type: ConfigType
  value: string
  jsonOptions?: JSON
  classAdd?: string
  createdAt: Date
  updatedAt: Date
  status: StatusDefault
}
