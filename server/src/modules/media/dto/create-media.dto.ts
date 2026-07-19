import { Transform } from "class-transformer"
import { Media } from "../entities/media.entity"
import { IsString, IsOptional, IsNumber, IsArray } from "class-validator"

export class CreateMediaDto extends Media {
  @IsString()
  contentId: string

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  duration?: number

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  sizeBytes?: number

  @IsOptional()
  @IsString()
  sourceType: string

  @IsOptional()
  @IsString()
  youtubeLink?: string

  @IsOptional()
  @IsString()
  mediaFile?: string

  @IsOptional()
  @IsString()
  mediaDescription?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  audioFilenames?: string[]
}
