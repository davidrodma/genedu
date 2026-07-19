import { Module } from "@nestjs/common"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { PresentationRepository } from "./repositories/presentation.repository"
import { PresentationService } from "./services/presentation.service"
import { ApiModule } from "../api/api.module"

@Module({
  imports: [PrismaModule, ApiModule],
  providers: [PresentationRepository, PresentationService],
  exports: [PresentationRepository, PresentationService],
})
export class PresentationModule {}
