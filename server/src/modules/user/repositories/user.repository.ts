import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { Repository } from "src/database/repositories/repository"
import { PrismaService } from "src/database/prisma/prisma.service"
import { User } from "../entities/user.entity"
import { ID } from "src/database/types/id.type"
import { DelegateArgs } from "src/database/types/delegate-args.type"
import { DelegateReturnTypes } from "src/database/types/delegate-return-types.type"
import { Exception } from "src/common/errors/Exception"

type UserDelegate = Prisma.UserDelegate<any>
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput
@Injectable()
export class UserRepository extends Repository<
  UserDelegate,
  DelegateArgs<UserDelegate>,
  DelegateReturnTypes<UserDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.user)
  }

  async deleteUsers(ids: ID[] | ID, userLogged: User) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    return await this.deleteMany({
      where: {
        id: {
          in: ids,
          not: {
            equals: userLogged.id,
          },
        },
      },
    })
  }

  async statusUsers(ids: ID[] | ID, status: number, userLogged: User) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    return this.updateMany({
      where: {
        id: {
          in: ids,
          not: {
            equals: userLogged.id,
          },
        },
      },
      data: { status },
    })
  }
}
