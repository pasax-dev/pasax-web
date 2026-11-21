import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  // Block authenticated users from accessing /login and /register
  if (token && (pathname === "/login" || pathname === "/register")) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register"],
}
