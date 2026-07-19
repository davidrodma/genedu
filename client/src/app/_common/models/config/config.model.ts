import { ConfigType } from '..'
import { StatusDefault } from '../../enums/status.default.enum'
import { ID } from '../../types/ID.type'
import { ConfigGroup } from './config-group.model'

export interface Config {
  id?: ID
  name: string
  title: string
  description: string
  configGroupId?: string
  configGroup?: ConfigGroup
  type: ConfigType
  value: string
  jsonOptions?: JSON
  classAdd?: string
  createdAt?: Date
  updatedAt?: Date
  status: StatusDefault
}
