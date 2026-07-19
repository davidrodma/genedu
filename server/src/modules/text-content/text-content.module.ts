import { Module } from "@nestjs/common"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { TextContentRepository } from "./repositories/text-content.repository"
import { TextContentService } from "./services/text-content.service"
import { ApiModule } from "../api/api.module"

@Module({
  imports: [PrismaModule, ApiModule],
  providers: [TextContentRepository, TextContentService],
  exports: [TextContentRepository, TextContentService],
})
export class TextContentModule {}
