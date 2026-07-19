import { Module } from "@nestjs/common"
import { UserService } from "./services/user.service"
import { UserController } from "./controllers/user.controller"
import { PrismaModule } from "src/database/prisma/prisma.module"
import { UserRepository } from "./repositories/user.repository"
import { IsUniqueConstraint } from "src/common/validation/is-unique.validator"
import { UserAdminController } from "./controllers/user-admin.controller"
import { AuthService } from "../auth/services/auth.service"
import { JwtService } from "@nestjs/jwt"
import { TelegramService } from "./services/telegram.service"
import { ConfigModule } from "../config/config.module"
import { ServerInfoService } from "src/server-info.service"

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [UserAdminController, UserController],
  providers: [
    UserService,
    UserRepository,
    IsUniqueConstraint,
    JwtService,
    AuthService,
    ServerInfoService,
    TelegramService,
  ],
  exports: [UserService, UserRepository, ServerInfoService, TelegramService],
})
export class UserModule {}
