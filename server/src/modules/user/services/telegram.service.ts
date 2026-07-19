import { Injectable } from "@nestjs/common"
import TelegramBot from "node-telegram-bot-api"
import { UserService } from "./user.service"
import { ConfigService } from "src/modules/config/services/config.service"
import { Exception } from "src/common/errors/Exception"
import { User } from "../entities/user.entity"
import { ID } from "src/database/types/id.type"
import { ServerInfoService } from "src/server-info.service"
import { coloredLog } from "src/common/utilities/console.log.utility"

@Injectable()
export class TelegramService {
  private bot: TelegramBot

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private serverInfoService: ServerInfoService
  ) {
    setTimeout(() => {
      console.log(
        "TELEGRAM PORT",
        this.serverInfoService.getPort(),
        "==",
        parseInt(process.env.BOT_PORT)
      )
      if (this.serverInfoService.getPort() == parseInt(process.env.BOT_PORT)) {
        return
      }

      this.configService
        .getValue<boolean>("telegram-verification", "boolean")
        .then(async (verification) => {
          if (verification) {
            const token =
              await this.configService.getValue<string>("telegram-bot-token")
            if (token) {
              this.bot = new TelegramBot(token, { polling: true })
              if (this.bot) {
                coloredLog({
                  content: "TELEGRAM SERVICE STARTED",
                  color: "green",
                })
              }
              // Listener para qualquer mensagem recebida
              this.bot.on("message", async (msg) => {
                const chatId = msg.chat.id.toString()
                const telegramUsername = msg.chat.username

                if (!telegramUsername) {
                  await this.bot.sendMessage(
                    chatId,
                    "Please set up a public username on Telegram to confirm your registration."
                  )
                  return
                }

                // Verificar se existe um usuário com esse telegramUsername
                const user = await userService.findByTelegram(telegramUsername)
                if (user && !user.isVerified) {
                  // Atualizar o usuário como verificado
                  await this.userService.updateById(user.id, {
                    isVerified: true,
                    chatId,
                  })
                  await this.bot.sendMessage(
                    chatId,
                    "Telegram confirmed successfully. Thanks!"
                  )
                } else if (user && user.isVerified) {
                  await this.bot.sendMessage(
                    chatId,
                    "Your Telegram has already been confirmed previously."
                  )
                } else {
                  await this.bot.sendMessage(
                    chatId,
                    `We did not find the username ${telegramUsername} associated with Telegram in our registration.`
                  )
                }
              })
            }
          }
        })
    }, 200)
  }

  // Método para enviar mensagens, se necessário
  async sendMessage(chatId: string, text: string) {
    return this.bot.sendMessage(chatId, text)
  }

  // Método para enviar mensagens, se necessário
  async getRecoveryCode(telegramUsername: string) {
    const user = await this.userService.findByTelegram(telegramUsername)
    if (!user?.id) {
      throw new Exception(
        `We did not find the username ${telegramUsername} associated with Telegram in our registration.`
      )
    }
    if (!user?.isVerified || !user?.chatId) {
      const usernameBot = await this.configService.getValue<string>(
        "telegram-bot-username"
      )
      if (!usernameBot) {
        throw new Exception(`Usename Bot Not Found.`)
      }
      const botLinkTelegram = `https://web.telegram.org/k/#@${usernameBot.replace("@", "")}`
      return {
        error: `Your Telegram has not been confirmed yet. Enter the Telegram link below and send an "ok" message from your Telegram account "${telegramUsername}". Confirm the telegram and then continue`,
        botLinkTelegram,
      }
    }
    const code = this.userService.generateConfirmationCode()
    const text = `Password recovery code: ${code}`
    this.userService.updateById(user.id, {
      code,
    })
    await this.sendMessage(user.chatId, text)
    return { success: true, message: "Fill in the code below in your telegram" }
  }

  async checkVerified(
    userId: ID,
    role: string
  ): Promise<{
    user: User
    botLinkTelegram: string
  }> {
    const user = await this.userService.findCurrentUser(userId, role)
    let username = await this.configService.getValue<string>(
      "telegram-bot-username"
    )
    username = username || ""
    const link = `https://web.telegram.org/k/#@${username.replace("@", "")}`
    return {
      user: { ...user, password: undefined },
      botLinkTelegram: link,
    }
  }
}
