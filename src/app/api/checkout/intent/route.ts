import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!API_BASE_URL) {
    return NextResponse.json(
      { detail: "Backend is not configured (set NEXT_PUBLIC_API_BASE_URL)." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const orderId = body?.order_id;
  if (!orderId) {
    return NextResponse.json({ order_id: "This field is required." }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/checkout/intent/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: orderId }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(data ?? { detail: "Could not initialize payment." }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ detail: "Could not reach the payment server." }, { status: 502 });
  }
}
