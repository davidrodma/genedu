export type matchModeOptions =
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThen'
  | 'lessThen'
  | 'greaterOrEqual'
  | 'lessOrEqual'
  | 'isNotEqual'
  | 'notContains'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'isAnyOf'
  | 'in'
  | 'contains'
export type OrderFields = { [field: string]: 1 | 'desc' | 'asc' | -1 | '1' | '-1' }
export type FilterFields = {
  [field: string]: {
    value: string | number | string[] | boolean
    matchMode: matchModeOptions
    fieldDb?: string
    condition?: 'AND' | 'OR'
  }
}

export class PaginateType {
  page?: number
  limit?: number
  search?: string
  filters?: FilterFields
  order?: OrderFields
}

export type PaginateResponse<Model = any> = {
  total: number
  page: number
  pages: number
  limit: number
  list: Model[]
}
