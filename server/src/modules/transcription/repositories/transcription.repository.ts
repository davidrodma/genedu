import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "src/database/prisma/prisma.service"
import {
  Repository,
  DelegateArgs,
  DelegateReturnTypes,
} from "src/database/repositories/repository"
import { ID } from "src/database/types/id.type"
import { Transcription } from "../entities/transcription.entity"

type TranscriptionDelegate = Prisma.TranscriptionDelegate<any>
export type TranscriptionCreateInput = Prisma.TranscriptionCreateInput
export type TranscriptionUpdateInput = Prisma.TranscriptionUpdateInput

@Injectable()
export class TranscriptionRepository extends Repository<
  TranscriptionDelegate,
  DelegateArgs<TranscriptionDelegate>,
  DelegateReturnTypes<TranscriptionDelegate>
> {
  constructor(private prisma: PrismaService) {
    super(prisma.transcription)
  }

  async findByContentId(contentId: string): Promise<Transcription | null> {
    return await this.prisma.transcription.findUnique({
      where: { contentId },
    })
  }

  async updateByContentId(
    contentId: string,
    data: TranscriptionUpdateInput
  ): Promise<Transcription> {
    return await this.prisma.transcription.update({
      where: { contentId },
      data,
    })
  }

  async deleteByContentId(contentId: string): Promise<Transcription> {
    return await this.prisma.transcription.delete({
      where: { contentId },
    })
  }
}
