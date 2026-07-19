import { Type, Transform } from 'class-transformer'
import { IsOptional, Max, IsNumber, IsString } from 'class-validator'
import { parseJson } from '../validation/parse-json.validator'

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

export class PaginateDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number

  @IsNumber()
  @Type(() => Number)
  @Max(10000)
  @IsOptional()
  limit?: number

  @IsString()
  @IsOptional()
  search?: string

  @IsOptional()
  @Transform(parseJson)
  filters?: FilterFields

  @IsOptional()
  @Transform(parseJson)
  order?: OrderFields
}
