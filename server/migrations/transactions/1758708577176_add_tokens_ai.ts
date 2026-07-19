import { Db } from "mongodb"
import { MigrationInterface } from "mongo-migrate-ts"

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export class add_tokens_ai1758708577176 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    let $titleGroup = "AI API Keys"
    let $nameConfig = ""
    let group = await prisma.configGroup.findUnique({
      where: {
        title: $titleGroup,
      },
    })
    if (!group) {
      group = await prisma.configGroup.create({
        data: {
          title: $titleGroup,
        },
      })
    }

    $nameConfig = "openai-api-key"
    await prisma.config.create({
      data: {
        configGroupId: group.id,
        name: $nameConfig,
        title: "OpenAI API Key",
        description: "OpenAI API Key for ChatGPT and Whisper Transcription",
        type: "password",
        jsonOptions: undefined,
        value: "",
        classAdd: undefined,
      },
    })

    $nameConfig = "gamma-api-key"
    await prisma.config.create({
      data: {
        configGroupId: group.id,
        name: $nameConfig,
        title: "Gamma API Key",
        description: "Gamma App API Key for Generating Presentations",
        type: "password",
        jsonOptions: undefined,
        value: "",
        classAdd: undefined,
      },
    })
  }

  public async down(db: Db): Promise<any> {
    await prisma.config.delete({ where: { name: "openai-api-key" } })
    await prisma.config.delete({ where: { name: "gamma-api-key" } })
    await prisma.configGroup.delete({ where: { title: "AI API Keys" } })
  }
}
