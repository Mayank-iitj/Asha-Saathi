export { default } from "next-auth/middleware";

export const config = {
  // Protect everything except the login page, API routes, Next.js static files, and PWA manifest/icons
  matcher: [
    "/((?!$|login|api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json).*)"
  ]
};
