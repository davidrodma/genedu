import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "src/database/prisma/prisma.service"
import {
  Repository,
  DelegateArgs,
  DelegateReturnTypes,
} from "src/database/repositories/repository"
import { ID } from "src/database/types/id.type"

type TextContentDelegate = Prisma.TextContentDelegate<any>
export type TextContentCreateInput = Prisma.TextContentCreateInput
export type TextContentUpdateInput = Prisma.TextContentUpdateInput

@Injectable()
export class TextContentRepository extends Repository<
  TextContentDelegate,
  DelegateArgs<TextContentDelegate>,
  DelegateReturnTypes<TextContentDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.textContent)
  }

  async findByContentId(contentId: string) {
    return await this.prisma.textContent.findUnique({
      where: { contentId },
    })
  }

  async updateByContentId(contentId: string, data: TextContentUpdateInput) {
    return await this.prisma.textContent.update({
      where: { contentId },
      data,
    })
  }

  async deleteByContentId(contentId: string) {
    return await this.prisma.textContent.delete({
      where: { contentId },
    })
  }
}
