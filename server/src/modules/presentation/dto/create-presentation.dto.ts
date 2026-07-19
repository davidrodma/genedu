import { IsString, IsOptional, IsInt } from "class-validator"

export class CreatePresentationDto {
  @IsString()
  contentId: string

  @IsString()
  @IsOptional()
  promptPresentation?: string

  @IsString()
  @IsOptional()
  presentationId?: string

  @IsString()
  @IsOptional()
  presentationFile?: string

  @IsString()
  @IsOptional()
  themeId?: string

  @IsString()
  @IsOptional()
  themeName?: string

  @IsInt()
  @IsOptional()
  numCards?: number

  @IsString()
  @IsOptional()
  imageOptions?: string

  @IsString()
  @IsOptional()
  imageModel?: string

  @IsString()
  @IsOptional()
  imageStyle?: string
}
