import "@/app/_common/assets/css/globals.scss"
import "@/app/_common/assets/css/style.css"
import "@/app/_common/assets/css/font-awesome-all.min.css"
import "react-quill/dist/quill.snow.css"

import { ReactNode } from "react"
import { AuthProvider } from "@/app/_common/contexts/auth.context"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GenEdu",
  description: "Gen Teaching Material AI",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  )
}
