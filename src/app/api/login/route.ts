import { NextResponse } from "next/server";
import { COOKIE_NAME, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/");
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  if (password !== expected) {
    const url = new URL(req.url);
    url.pathname = "/login";
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }
  const url = new URL(req.url);
  url.pathname = next.startsWith("/") ? next : "/";
  url.search = "";
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set({
    name: COOKIE_NAME,
    value: await signToken(String(Date.now())),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  url.pathname = "/login";
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
