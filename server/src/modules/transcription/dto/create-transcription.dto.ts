import { IsString, IsNotEmpty, IsOptional } from "class-validator"

export class CreateTranscriptionDto {
  @IsString()
  @IsNotEmpty()
  contentId: string

  @IsString()
  @IsNotEmpty()
  transcriptionText: string

  @IsString()
  @IsNotEmpty()
  transcriptFile: string

  @IsString()
  @IsOptional()
  transcriptionModel?: string
}
