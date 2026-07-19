import { Module } from "@nestjs/common"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { ApiService } from "./services/api.service"
import { ConfigModule } from "../config/config.module"
import { OpenAIApi } from "./services/openai/openai.api"
import { GammaApiService } from "./services/gamma/gamma-api.service"
import { GammaController } from "./controllers/gamma.controller"

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [GammaController],
  providers: [ApiService, OpenAIApi, GammaApiService],
  exports: [ApiService, OpenAIApi, GammaApiService],
})
export class ApiModule {}
