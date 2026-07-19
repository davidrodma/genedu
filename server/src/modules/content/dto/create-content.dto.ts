import { Transform } from "class-transformer"
import { Content } from "../entities/content.entity"
import { IsString, IsOptional, IsNumber, Max } from "class-validator"

export class CreateContentDto extends Content {
  @IsString()
  subject: string

  @IsString()
  language: string

  @IsOptional()
  @IsString()
  mediaDescription: string

  @IsOptional()
  @IsString()
  promptText: string

  @IsOptional()
  @IsString()
  promptPresentation: string

  @IsOptional()
  @IsString()
  themeId?: string

  @IsOptional()
  @IsString()
  themeName?: string

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Max(75)
  numCards: number

  @IsOptional()
  @IsString()
  imageOptions: string

  @IsOptional()
  @IsString()
  imageModel: string

  @IsOptional()
  @IsString()
  imageStyle: string

  @IsOptional()
  @IsString()
  youtubeLink: string

  @IsString()
  @IsOptional()
  textModel?: string

  @IsString()
  @IsOptional()
  transcriptionModel?: string
}
