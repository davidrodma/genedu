import { IsUnique } from 'src/common/validation/is-unique.validator'
import { ConfigGroup } from '../entities/config-group.entity'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateConfigGroupDto extends ConfigGroup {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsUnique({ tableName: 'ConfigGroup', column: 'title' })
  title: string
}

