import { loadEnv } from "src/load-env"
loadEnv()
import { NestFactory } from "@nestjs/core"
import { BotModule } from "./modules/bot/bot.module"
import { BotService } from "./modules/bot/services/bot.service"
import { ServerInfoService } from "./server-info.service"
async function bootstrap() {
  const app = await NestFactory.create(BotModule)

  const serverInfoService = app.get(ServerInfoService)
  serverInfoService.setPort(parseInt(process.env.BOT_PORT))

  const botService = app.get(BotService)
  botService.startBot()

  await app.listen(process.env.BOT_PORT)
}

bootstrap()
