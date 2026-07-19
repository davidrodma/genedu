import { Module } from "@nestjs/common"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { MediaRepository } from "./repositories/media.repository"
import { MediaService } from "./services/media.service"
import { ContentService } from "../content/services/content.service"
import { ContentRepository } from "../content/repositories/content.repository"
import { AutoIncrementService } from "src/database/services/auto-increment.service"
import { AutoIncrementRepository } from "src/database/repositories/auto-increment.repository"
import { ApiModule } from "../api/api.module"
import { ConfigModule } from "../config/config.module"
import { TranscriptionModule } from "../transcription/transcription.module"
import { TextContentModule } from "../text-content/text-content.module"
import { PresentationModule } from "../presentation/presentation.module"

@Module({
  imports: [
    PrismaModule,
    ApiModule,
    ConfigModule,
    TranscriptionModule,
    TextContentModule,
    PresentationModule,
  ],
  providers: [
    MediaRepository,
    MediaService,
    ContentService,
    ContentRepository,
    AutoIncrementService,
    AutoIncrementRepository,
  ],
  exports: [MediaRepository, MediaService],
})
export class MediaModule {}
