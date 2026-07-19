import { Injectable, OnModuleInit } from "@nestjs/common"
//import { ModuleRef } from '@nestjs/core'
import { delay } from "src/common/utilities/helpers.utility"
import { ContentService } from "src/modules/content/services/content.service"
import { ProcessingService } from "src/modules/processing/services/processing.service"

@Injectable()
export class BotService implements OnModuleInit {
  private isBotModule: boolean = false

  constructor(
    private readonly contentService: ContentService,
    private readonly processingService: ProcessingService
  ) {} // private readonly moduleRef: ModuleRef,

  static forRoot(): BotService {
    const botService = new BotService(null, null)
    botService.isBotModule = true
    return botService
  }

  onModuleInit() {
    if (this.isBotModule) {
      this.startBot()
    }
  }

  async startBot() {
    while (true) {
      try {
        console.log("startBot")
        await this.processingService.processDownloadMedia()
        await this.processingService.processConversionAudio()
        await this.processingService.processTranscription()
        await this.processingService.processText()
        await this.processingService.processRequestPresentation()
        await this.processingService.processPresentationGeneration()
        await this.processingService.processDownloadPresentation()
        await delay(1)
      } catch (error) {
        console.error("Error in startBot:", error)
      }
    }
  }
}
