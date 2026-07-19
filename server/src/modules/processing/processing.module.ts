import { Module } from "@nestjs/common"
import { ApiModule } from "../api/api.module"
import { ProcessingService } from "./services/processing.service"
import { ContentModule } from "../content/content.module"
import { MediaModule } from "../media/media.module"
import { TranscriptionModule } from "../transcription/transcription.module"
import { TextContentModule } from "../text-content/text-content.module"
import { PresentationModule } from "../presentation/presentation.module"

@Module({
  imports: [
    ApiModule,
    ContentModule,
    MediaModule,
    TranscriptionModule,
    TextContentModule,
    PresentationModule,
  ],
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingModule {}
