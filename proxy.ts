import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const ADMIN_API_PREFIXES = [
  "/api/categories",
  "/api/lid-colors",
  "/api/lid-types",
  "/api/lid-variants",
  "/api/materials",
  "/api/price-types",
  "/api/product-types",
  "/api/products",
];

const PUBLIC_WRITE_API_PATTERNS = [
  /^\/api\/products\/[^/]+\/interact$/,
];

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

function matchesPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isPublicWriteApi(pathname: string) {
  return PUBLIC_WRITE_API_PATTERNS.some((pattern) => pattern.test(pathname));
}

function isProtectedAdminApi(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (READ_METHODS.has(request.method) || isPublicWriteApi(pathname)) {
    return false;
  }

  return ADMIN_API_PREFIXES.some((prefix) => matchesPath(pathname, prefix));
}

function unauthorizedResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedApi = isProtectedAdminApi(request);

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return unauthorizedResponse(request);
  }

  try {
    const secret = getJwtSecret();
    if (!secret) throw new Error("JWT_SECRET not set");
    
    await jose.jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error);
    return unauthorizedResponse(request);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
