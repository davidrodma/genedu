export interface GammaTheme {
  value: string
  label: string
  description?: string
}

export const defaultThemeOption: GammaTheme = {
  value: "",
  label: "Default (workspace)",
}
