import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const orderId = formData.get("order_id");
  const receiptImage = formData.get("receipt_image");
  const referenceNumber = formData.get("reference_number");

  if (!orderId || !receiptImage || !referenceNumber) {
    return NextResponse.json(
      { error: "order_id, receipt_image, and reference_number are required." },
      { status: 400 }
    );
  }

  // If no backend configured, use mock response
  if (!API_BASE_URL) {
    return NextResponse.json({
      detail: "Bank transfer payment receipt submitted successfully (Mock).",
      payment_id: Date.now(),
      status: "pending",
    }, { status: 201 });
  }

  try {
    const forwardData = new FormData();
    forwardData.append("order_id", orderId);
    forwardData.append("receipt_image", receiptImage);
    forwardData.append("reference_number", referenceNumber);

    const res = await fetch(`${API_BASE_URL}/api/payments/bank-transfer/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        // Note: Do NOT set Content-Type header here. Fetch will automatically set it
        // with the correct boundary parameter.
      },
      body: forwardData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(data || { error: "Failed to submit bank transfer details." }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the bank transfer server." },
      { status: 502 }
    );
  }
}
