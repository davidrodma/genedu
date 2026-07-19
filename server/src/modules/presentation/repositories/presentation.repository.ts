import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "src/database/prisma/prisma.service"
import {
  Repository,
  DelegateArgs,
  DelegateReturnTypes,
} from "src/database/repositories/repository"
import { ID } from "src/database/types/id.type"

type PresentationDelegate = Prisma.PresentationDelegate<any>
export type PresentationCreateInput = Prisma.PresentationCreateInput
export type PresentationUpdateInput = Prisma.PresentationUpdateInput

@Injectable()
export class PresentationRepository extends Repository<
  PresentationDelegate,
  DelegateArgs<PresentationDelegate>,
  DelegateReturnTypes<PresentationDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.presentation)
  }

  async findByContentId(contentId: string) {
    return await this.prisma.presentation.findFirst({
      where: { contentId },
    })
  }

  async updateByContentId(contentId: string, data: PresentationUpdateInput) {
    return await this.prisma.presentation.updateMany({
      where: { contentId },
      data,
    })
  }

  async deleteByContentId(contentId: string) {
    return await this.prisma.presentation.deleteMany({
      where: { contentId },
    })
  }
}
