import { Module } from "@nestjs/common"
import { BotService } from "./services/bot.service"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { ConfigModule } from "../config/config.module"
import { ContentModule } from "../content/content.module"
import { ApiModule } from "../api/api.module"
import { ProcessingModule } from "../processing/processing.module"
import { PresentationModule } from "../presentation/presentation.module"
import { ServerInfoService } from "src/server-info.service"

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    ContentModule,
    ApiModule,
    ProcessingModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [BotService, ServerInfoService],
  exports: [BotService],
})
export class BotModule {}
