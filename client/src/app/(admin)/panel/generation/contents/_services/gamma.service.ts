import { api } from "@/app/_common/services/api/api.service"

export interface GammaThemeResponse {
  id: string
  name: string
  description?: string
}

export const GammaService = {
  async listThemes(): Promise<GammaThemeResponse[]> {
    const response = await api().get("/gamma/themes")
    return response as GammaThemeResponse[]
  },
}
