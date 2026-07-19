import { Injectable } from "@nestjs/common"
import { PaginateResult } from "src/common/types/paginate-result.type"
import { PaginateDto } from "../../common/dto/paginate.dto"
import { ID } from "src/database/types/id.type"
import { filterPaginate } from "../utilities/filter-paginate.utility"
import { orderPaginate } from "../utilities/order-paginate.utility"

export type Operation =
  | "findFirst"
  | "findUnique"
  | "findMany"
  | "create"
  | "createMany"
  | "update"
  | "updateMany"
  | "delete"
  | "deleteMany"
  | "count"

@Injectable()
export abstract class Repository<
  Db extends { [Key in Operation]: (data: any) => unknown },
  Args extends { [K in Operation]: unknown },
  Return extends { [K in Operation]: unknown },
> {
  constructor(protected db: Db) {}

  findFirst(data?: Args["findFirst"]): Return["findFirst"] {
    return this.db.findFirst(data)
  }

  findUnique<Entity = Return["findUnique"]>(
    data: Args["findUnique"]
  ): Promise<Entity> {
    return this.db.findUnique(data) as Promise<Entity>
  }

  findMany<Entities = Return["findMany"]>(
    data?: Args["findMany"]
  ): Promise<Entities> {
    return this.db.findMany(data) as Promise<Entities>
  }

  create(data: Args["create"]): Return["create"] {
    return this.db.create(data)
  }

  createMany(data: Args["createMany"]): Return["createMany"] {
    return this.db.createMany(data)
  }

  update<Entity = Return["update"]>(data: Args["update"]): Promise<Entity> {
    return this.db.update(data) as Promise<Entity>
  }

  updateMany(data: Args["updateMany"]): Return["updateMany"] {
    return this.db.updateMany(data)
  }

  delete(data: Args["delete"]): Return["delete"] {
    return this.db.delete(data)
  }

  deleteMany(data?: Args["deleteMany"]): Return["deleteMany"] {
    return this.db.deleteMany(data)
  }

  count(data?: Args["count"]): Return["count"] {
    return this.db.count(data)
  }

  findById<Entity = Return["findUnique"]>(id: ID): Promise<Entity> {
    return this.findUnique({ where: { id } })
  }

  findManyByIds(ids: ID[] | ID) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    return this.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }

  async updateById<Entity = Return["update"]>(
    id: ID,
    data: any,
    options: any = {}
  ): Promise<Entity> {
    const { returning = false, ...optionsRest } = options
    const result = await this.update({
      where: {
        id,
      },
      data,
      ...optionsRest,
    })
    if (returning) {
      return await this.findById(id)
    }
    return result as Entity
  }

  updateManyByIds(ids: ID[] | ID, data: any) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    return this.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data,
    })
  }

  deleteById(id: ID) {
    return this.delete({ where: { id } })
  }

  deleteManyByIds(ids: ID[] | ID) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    return this.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }

  changeStatus(ids: ID[] | ID, status: number): Return["updateMany"] {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    return this.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: { status },
    })
  }

  async paginate<Entity = Return["findUnique"]>({
    paginateDto,
    findManyArgs,
    fieldsSearch,
    allowedOrderFields,
    removeFilters = false,
    removeOrders = false,
  }: {
    paginateDto: PaginateDto
    findManyArgs?: Args["findMany"]
    fieldsSearch?: string[]
    allowedOrderFields?: string[]
    removeFilters?: boolean
    removeOrders?: boolean
  }) {
    const { page = 1, limit = 100 } = paginateDto
    const skip = (page - 1) * limit
    let args: any = findManyArgs ? findManyArgs : {}
    if (!removeFilters) {
      const filters = filterPaginate({ paginateDto, fieldsSearch })
      args = { ...args, ...filters }
    }
    if (!removeOrders) {
      const orderBy = orderPaginate({ paginateDto, allowedOrderFields })
      args = { ...args, orderBy }
    }
    const list = (await this.findMany({
      ...args,
      take: limit,
      skip: skip,
    })) as []
    const total = (await this.count({
      where: args?.where,
      cursor: args?.cursor,
    })) as number
    const pages = Math.ceil(total / limit)
    const result: PaginateResult<Entity> = {
      total,
      page,
      pages,
      limit,
      list,
    }
    return result
  }
}

export type DelegateArgs<T> = {
  [Key in keyof T]: T[Key] extends (args: infer A) => unknown ? A : never
}

export type DelegateReturnTypes<T> = {
  [Key in keyof T]: T[Key] extends (...args: any[]) => any
    ? ReturnType<T[Key]>
    : never
}
