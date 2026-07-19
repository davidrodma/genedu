import "@/app/_common/assets/primereact/themes/tailwind/tailwind-light/theme.scss" // theme
import "primeicons/primeicons.css"
import "primereact/resources/primereact.css"
import { PrimeReactProvider } from "primereact/api"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GenEdu",
  description: "Test the generation of teaching material content by AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PrimeReactProvider>{children}</PrimeReactProvider>
}
