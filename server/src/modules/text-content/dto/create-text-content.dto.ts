import { IsString, IsOptional } from "class-validator"

export class CreateTextContentDto {
  @IsString()
  contentId: string

  @IsString()
  @IsOptional()
  promptText?: string

  @IsString()
  @IsOptional()
  generatedText?: string

  @IsString()
  @IsOptional()
  textFile?: string

  @IsString()
  @IsOptional()
  textModel?: string
}
