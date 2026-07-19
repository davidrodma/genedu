import { Module } from "@nestjs/common"
import { APP_FILTER } from "@nestjs/core"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AllExceptionsFilter } from "./common/errors/http-exception.filter"
import { PrismaModule } from "./database/prisma/prisma.module"
import { AuthModule } from "./modules/auth/auth.module"
import { UserModule } from "./modules/user/user.module"
import { ConfigModule } from "./modules/config/config.module"
import { ApiService } from "./modules/api/services/api.service"
import { ApiModule } from "./modules/api/api.module"
import { ContentModule } from "./modules/content/content.module"

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ConfigModule,
    ApiModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApiService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
