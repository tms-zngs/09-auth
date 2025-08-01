import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkServerSession } from "./lib/api/serverApi";
import { parse } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoutes = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log({
    middleware: pathname,
    isAuthRoutes: isAuthRoutes,
    isPrivateRoute: isPrivateRoute,
    "hasAccessToken:": !!accessToken,
    "hasRefreshToken:": !!refreshToken,
  });

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkServerSession();
      const setCookie = data.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed["Max-Age"]),
          };
          if (parsed.accessToken)
            cookieStore.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken)
            cookieStore.set("refreshToken", parsed.refreshToken, options);
        }

        if (isAuthRoutes)
          return NextResponse.redirect(new URL("/profile", request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });

        if (isPrivateRoute)
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
      }
    }

    if (isAuthRoutes) return NextResponse.next();
    if (isPrivateRoute)
      return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoutes)
    return NextResponse.redirect(new URL("/profile", request.url));
  if (isPrivateRoute) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
