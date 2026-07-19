import { Controller, Get } from "@nestjs/common"
import {
  GammaApiService,
  GammaTheme,
} from "../services/gamma/gamma-api.service"

@Controller("gamma")
export class GammaController {
  constructor(private readonly gammaApiService: GammaApiService) {}

  @Get("themes")
  async listThemes(): Promise<GammaTheme[]> {
    return await this.gammaApiService.listThemes()
  }
}
