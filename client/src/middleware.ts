import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth_token_name } from "./app/_common/configs/constants"
import { _routes } from "./app/(website)/_configs/_routes"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore?.get(auth_token_name) || null
  if (!token && request.url.includes("dpanel")) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    `/((?!signup|signin|panel|api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|$).*)`,
  ],
}
