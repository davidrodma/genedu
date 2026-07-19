import { Module } from "@nestjs/common"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { TranscriptionRepository } from "./repositories/transcription.repository"
import { TranscriptionService } from "./services/transcription.service"
import { ApiModule } from "../api/api.module"

@Module({
  imports: [PrismaModule, ApiModule],
  providers: [TranscriptionRepository, TranscriptionService],
  exports: [TranscriptionRepository, TranscriptionService],
})
export class TranscriptionModule {}
