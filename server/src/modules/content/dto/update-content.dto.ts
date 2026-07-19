import { OmitType, PartialType } from "@nestjs/mapped-types"
import { CreateContentDto } from "./create-content.dto"
import { IsOptional, IsString } from "class-validator"

export class UpdateContentDto extends PartialType(
  OmitType(CreateContentDto, [])
) {
  @IsOptional()
  @IsString()
  mediaFile?: string
}
