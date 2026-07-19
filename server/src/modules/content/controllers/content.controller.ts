import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Patch,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { CreateContentDto } from "../dto/create-content.dto"
import { PaginateDto } from "src/common/dto/paginate.dto"
import { UpdateContentDto } from "../dto/update-content.dto"
import { ID } from "src/database/types/id.type"
import { ContentService } from "../services/content.service"
import { FileInterceptor } from "@nestjs/platform-express"
import { FileInterceptorOptions } from "src/common/utilities/file.utility"
import { destinationMedias } from "../constants/vars"

@Controller("content")
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor(
      "mediaFile",
      FileInterceptorOptions({
        destination: destinationMedias,
      })
    )
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createContentDto: CreateContentDto
  ) {
    return this.service.create(createContentDto as any, file)
  }

  @Get()
  paginate(@Query() paginateDto: PaginateDto) {
    return this.service.paginate(paginateDto)
  }

  @Get(":id")
  findById(@Param("id") id: ID) {
    return this.service.findById(id)
  }

  @Put(":id")
  @UseInterceptors(
    FileInterceptor(
      "mediaFile",
      FileInterceptorOptions({
        destination: destinationMedias,
      })
    )
  )
  edit(
    @Param("id") id: ID,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateContentDto: UpdateContentDto & Partial<CreateContentDto>
  ) {
    const isDelete = !updateContentDto?.mediaFile
    return this.service.edit(id, updateContentDto, file, isDelete)
  }

  @Patch("status")
  changeStatus(@Body() body: { ids: ID[] | ID; status: number }) {
    return this.service.changeStatus(body.ids, body.status)
  }

  @Delete()
  async deleteManyByIds(@Body() body: { ids: ID[] | ID }) {
    return this.service.deleteManyByIds(body.ids)
  }
}
