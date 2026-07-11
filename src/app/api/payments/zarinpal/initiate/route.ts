import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { order_id } = body;
  if (!order_id) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 });
  }

  // If no backend configured, use mock response
  if (!API_BASE_URL) {
    const mockAuthority = `zarp-${Math.floor(1000000 + Math.random() * 9000000)}`;
    return NextResponse.json({
      status: "success",
      authority: mockAuthority,
      payment_url: `https://sandbox.zarinpal.com/pg/StartPay/${mockAuthority}`,
    });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/zarinpal/initiate/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(data || { error: "Failed to initiate Zarinpal payment" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Could not reach the Zarinpal initiate server" },
      { status: 502 }
    );
  }
}
