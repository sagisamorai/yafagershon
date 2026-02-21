import { NextResponse, type NextRequest } from "next/server";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

async function handleWithClerk(req: NextRequest) {
  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );
  const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

  const adminIds = (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return clerkMiddleware(async (auth, request) => {
    if (isAdminRoute(request)) {
      const { userId } = await auth();
      if (!userId) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", request.url);
        return NextResponse.redirect(signInUrl);
      }
      if (adminIds.length > 0 && !adminIds.includes(userId)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  })(req, {} as any);
}

export default async function middleware(req: NextRequest) {
  if (hasClerk) {
    return handleWithClerk(req);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
