import { IsUnique } from 'src/common/validation/is-unique.validator'
import { Config } from '../entities/config.entity'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { parseJson } from 'src/common/validation/parse-json.validator'
import { ConfigType } from '../enum/config-type.enum'

export class CreateConfigDto extends Config {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsUnique({ tableName: 'config', column: 'name' })
  name: string

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description: string

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  type: ConfigType

  @IsString()
  @MaxLength(5000)
  value: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  groupTitle: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  groupDescription: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  configGroupId: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  classAdd: string

  @IsOptional()
  @Transform(parseJson)
  jsonOptions: JSON
}
