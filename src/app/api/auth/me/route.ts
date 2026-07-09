import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME, AUTH_ENDPOINTS } from "@/lib/auth/config";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token || !API_BASE_URL) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.me}`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      cookieStore.delete(AUTH_COOKIE_NAME);
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await res.json().catch(() => null);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 502 });
  }
}
