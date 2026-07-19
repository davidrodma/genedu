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
} from "@nestjs/common"
import { CreateConfigDto } from "../dto/create-config.dto"
import { ConfigService } from "../services/config.service"
import { PaginateDto } from "src/common/dto/paginate.dto"
import { UpdateConfigDto } from "../dto/update-config.dto"
import { ID } from "src/database/types/id.type"

@Controller("config")
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.service.create(createConfigDto)
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
  updateById(@Param("id") id: ID, @Body() updateConfigDto: UpdateConfigDto) {
    return this.service.updateById(id, updateConfigDto)
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
