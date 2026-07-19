import { loadEnv } from "src/load-env"
loadEnv()
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as bodyParser from "body-parser"
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.setGlobalPrefix("api")
  if (process.env.MAX_MB_UPLOAD) {
    app.use(bodyParser.json({ limit: process.env.MAX_MB_UPLOAD + "mb" }))
    app.use(
      bodyParser.urlencoded({
        limit: process.env.MAX_MB_UPLOAD + "mb",
        extended: true,
      })
    )
  }

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  await app.listen(process.env.PORT)
}

bootstrap()
