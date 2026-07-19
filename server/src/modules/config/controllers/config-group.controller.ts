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
import { PaginateDto } from "src/common/dto/paginate.dto"
import { UpdateConfigDto } from "../dto/update-config.dto"
import { ID } from "src/database/types/id.type"
import { ConfigGroupService } from "../services/config-group.service"
import { UpdateConfigGroupDto } from "../dto/update-config-group.dto"

@Controller("config/groups")
export class ConfigGroupController {
  constructor(private readonly service: ConfigGroupService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.service.create(createConfigDto)
  }

  @Get()
  paginate(@Query() paginateDto: PaginateDto) {
    return this.service.paginate(paginateDto)
  }

  @Get("all")
  groups(
    @Query() { excludeConfigs = false }: { excludeConfigs: boolean | string }
  ) {
    return this.service.groups(
      excludeConfigs === "true" || excludeConfigs === true
    )
  }

  @Get(":id")
  findById(@Param("id") id: ID) {
    return this.service.findById(id)
  }

  @Put(":id")
  updateById(
    @Param("id") id: ID,
    @Body() updateConfigGroupDto: UpdateConfigGroupDto
  ) {
    return this.service.updateById(id, updateConfigGroupDto)
  }

  @Patch("status")
  changeStatus(@Body() body: { ids: ID[] | ID; status: number }) {
    return this.service.changeStatus(body.ids, body.status)
  }

  @Delete(":id")
  async deleteById(@Param("id") id: ID) {
    return this.service.deleteById(id)
  }
}
