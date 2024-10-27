// middleware.ts
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) return;

  return NextResponse.rewrite(url);
}
