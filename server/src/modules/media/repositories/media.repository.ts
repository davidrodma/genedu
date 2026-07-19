import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "src/database/prisma/prisma.service"
import {
  DelegateArgs,
  DelegateReturnTypes,
  Repository,
} from "src/database/repositories/repository"
import { ID } from "src/database/types/id.type"

type MediaDelegate = Prisma.MediaDelegate<any>
export type MediaUpdateInput = Prisma.MediaUpdateInput
export type MediaCreateInput = Prisma.MediaCreateInput

@Injectable()
export class MediaRepository extends Repository<
  MediaDelegate,
  DelegateArgs<MediaDelegate>,
  DelegateReturnTypes<MediaDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.media)
  }

  async updateByContentId(contentId: string, data: MediaUpdateInput) {
    return await this.prisma.media.update({
      where: { contentId },
      data,
      include: { content: true },
    })
  }

  async deleteByContentId(contentId: ID) {
    return await this.prisma.media.delete({
      where: { contentId },
    })
  }
}
