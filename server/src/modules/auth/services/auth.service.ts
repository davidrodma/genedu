import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { UnauthorizedError } from "../errors/unauthorized.error"
import { User } from "../../user/entities/user.entity"
import { UserService } from "../../user/services/user.service"
import { UserPayload } from "../models/UserPayload"
import { UserToken } from "../models/UserToken"
import { ConfigService } from "src/modules/config/services/config.service"

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      telegram: user.telegram,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
    }
    if (!payload.isVerified) {
      const hasVerification = await this.configService.getValue<boolean>(
        "telegram-verification",
        "boolean"
      )
      if (!hasVerification) {
        payload.isVerified = true
      }
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email)

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        }
      }
    }

    throw new UnauthorizedError(
      "Email address or password provided is incorrect."
    )
  }
}
