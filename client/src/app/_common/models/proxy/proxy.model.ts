import { StatusDefault } from '../../enums/status.default.enum'
import { ID } from '../../types/ID.type'
import { ProxyType } from './proxy-type.enum'

export interface Proxy {
  id: ID
  url: string
  type: ProxyType
  noteError: string
  countryCode: string
  change: boolean
  countErrors: number
  countSuccess: number
  countChange: number
  countFewMinutes: number
  fewMinutesAt: Date
  createdAt: Date
  updatedAt: Date
  status: StatusDefault
}
