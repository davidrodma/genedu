import { Injectable } from "@nestjs/common"
import { PaginateDto } from "src/common/dto/paginate.dto"
import { CreateConfigGroupDto } from "../dto/create-config-group.dto"
import { ConfigGroup } from "../entities/config-group.entity"
import { ConfigGroupRepository } from "../repositories/config-group.repository"
import { UpdateConfigGroupDto } from "../dto/update-config-group.dto"
import { ID } from "src/database/types/id.type"
import { configGroupDeleteValidation } from "../validation/config-group-delete.validation"
import { Exception } from "src/common/errors/Exception"

@Injectable()
export class ConfigGroupService {
  constructor(private readonly repository: ConfigGroupRepository) {}

  async create(createConfigDto: CreateConfigGroupDto): Promise<ConfigGroup> {
    return this.repository.create({
      data: { ...(createConfigDto as any) },
    })
  }

  async findByTitleAndCreateIfNotExist(title: string) {
    const group = await this.groupByTitle(title)
    if (group) {
      return group
    }
    const data: CreateConfigGroupDto = {
      title,
    }
    return this.create(data)
  }

  async groupByTitle(title: string) {
    const group = await this.repository.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    })
    return group
  }

  async paginate(paginateDto: PaginateDto) {
    let paginate = await this.repository.paginate<ConfigGroup>({ paginateDto })
    paginate.list = paginate.list.map((obj: ConfigGroup) => {
      return { ...obj, password: undefined }
    })
    return paginate
  }

  async updateById(id: ID, updateDto: UpdateConfigGroupDto) {
    await this.repository.updateById(id, updateDto)
    return this.findByIdWithConfigs(id)
  }

  async findById(id: ID) {
    return this.repository.findById(id)
  }

  async findByIdWithConfigs(id: ID) {
    const group = await this.repository.findUnique({
      where: { id },
      include: {
        configs: true,
      },
    })
    return group
  }

  async deleteById(id: ID) {
    const group = await this.findByIdWithConfigs(id)
    const validated = configGroupDeleteValidation(group)
    if (validated) {
      return this.repository.deleteById(id)
    } else {
      new Exception("Not Validated")
    }
  }

  async findMany(data?: any) {
    return this.repository.findMany(data)
  }

  async groups(excludeConfigs = false) {
    return this.repository.findMany({
      orderBy: {
        title: "asc",
      },
      include: {
        configs: !excludeConfigs,
      },
    })
  }

  async changeStatus(ids: ID[] | ID, status: number) {
    return await this.repository.changeStatus(ids, status)
  }

  async deleteManyByIds(ids: ID[] | ID) {
    return this.repository.deleteManyByIds(ids)
  }
}
