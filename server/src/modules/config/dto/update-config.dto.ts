import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateConfigDto } from './create-config.dto'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateConfigDto extends PartialType(OmitType(CreateConfigDto, ['name'])) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string
}

