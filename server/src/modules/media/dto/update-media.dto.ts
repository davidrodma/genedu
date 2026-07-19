import { PartialType } from "@nestjs/mapped-types"
import { CreateMediaDto } from "./create-media.dto"
import { IsOptional, IsString, IsNumber, IsArray } from "class-validator"

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
  @IsOptional()
  @IsString()
  mediaFile?: string

  @IsOptional()
  @IsNumber()
  sizeBytes?: number

  @IsOptional()
  @IsNumber()
  duration?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  audioFilenames?: string[]
}

