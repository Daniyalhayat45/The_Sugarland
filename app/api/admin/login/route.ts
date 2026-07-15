import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────────────────
// STATIC ADMIN CREDENTIALS
// These are hardcoded here instead of coming from environment variables.
// To change the owner's login email/password, edit the two lines below,
// save this file, then commit + push (or re-upload) and redeploy.
// Nobody can change these from the website itself — only by editing this
// file directly in the code.
// ─────────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "sugarland@admin.com";
const ADMIN_PASSWORD = "ChangeThisPassword123!";
// ─────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = await createAdminToken(email);
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}
