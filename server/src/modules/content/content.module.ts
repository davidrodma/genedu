import { Module } from "@nestjs/common"
import { ContentService } from "./services/content.service"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { ContentRepository } from "./repositories/content.repository"
import { ContentController } from "./controllers/content.controller"
import { ConfigModule } from "../config/config.module"
import { AutoIncrementService } from "src/database/services/auto-increment.service"
import { AutoIncrementRepository } from "src/database/repositories/auto-increment.repository"
import { ApiModule } from "../api/api.module"
import { MediaModule } from "../media/media.module"
import { TranscriptionModule } from "../transcription/transcription.module"
import { TextContentModule } from "../text-content/text-content.module"
import { PresentationModule } from "../presentation/presentation.module"

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    ApiModule,
    MediaModule,
    TranscriptionModule,
    TextContentModule,
    PresentationModule,
  ],
  controllers: [ContentController],
  providers: [
    AutoIncrementService,
    ContentRepository,
    AutoIncrementRepository,
    ContentService,
  ],
  exports: [
    ContentService,
    ContentRepository,
    AutoIncrementService,
    AutoIncrementRepository,
  ],
})
export class ContentModule {}
