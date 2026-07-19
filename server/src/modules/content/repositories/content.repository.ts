import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { Repository } from "src/database/repositories/repository"
import { PrismaService } from "src/database/prisma/prisma.service"
import { DelegateArgs } from "src/database/types/delegate-args.type"
import { DelegateReturnTypes } from "src/database/types/delegate-return-types.type"

type ContentDelegate = Prisma.ContentDelegate<any>

export type ContentCreateInput = Prisma.ContentCreateInput
export type ContentCreateManyInput = Prisma.ContentCreateManyInput
export type ContentUpdateInput = Prisma.ContentUpdateInput
export type ContenContentFindManyArgs = Prisma.ContentFindManyArgs

@Injectable()
export class ContentRepository extends Repository<
  ContentDelegate,
  DelegateArgs<ContentDelegate>,
  DelegateReturnTypes<ContentDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.content)
  }

  async findByIdWithMedia(id: string) {
    return await this.prisma.content.findUnique({
      where: { id },
      include: { media: true },
    } as any)
  }

  async findByIdWithMediaAndTranscription(id: string) {
    return await this.prisma.content.findUnique({
      where: { id },
      include: { media: true, transcription: true },
    } as any)
  }

  async findByIdWithAllRelations(id: string) {
    return await this.prisma.content.findUnique({
      where: { id },
      include: { media: true, transcription: true, textContent: true, presentation: true },
    } as any)
  }

  async findManyWithMedia() {
    return await this.prisma.content.findMany({
      include: { media: true },
    } as any)
  }
}
