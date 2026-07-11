import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

interface MockQuote {
  id: number;
  product: string;
  product_name: string;
  user: string;
  quantity: number;
  contact_phone: string;
  message: string;
  status: "new" | "contacted" | "quoted" | "approved" | "closed";
  agreed_price: string | null;
  order_id: number | null;
  order_number: string | null;
  created_at: string;
}

// Initialize global mockQuotes if not present
const getMockQuotes = () => {
  const g = global as unknown as { mockQuotes?: MockQuote[] };
  if (!g.mockQuotes) {
    g.mockQuotes = [
      {
        id: 1,
        product: "service-os-install",
        product_name: "Operating System Installation / نصب سیستم‌عامل",
        user: "user",
        quantity: 1,
        contact_phone: "+989123456789",
        message: "Please install Windows 11 Pro.",
        status: "approved",
        agreed_price: "45.00",
        order_id: 1003,
        order_number: "DT-893012",
        created_at: "2026-07-09T14:30:00Z",
      },
      {
        id: 2,
        product: "service-gaming-setup",
        product_name: "Custom Gaming PC Assembly / سیستم گیمینگ/رندر",
        user: "user",
        quantity: 1,
        contact_phone: "+989123456789",
        message: "Requesting a quote for assembly service.",
        status: "new",
        agreed_price: null,
        order_id: null,
        order_number: null,
        created_at: "2026-07-11T16:00:00Z",
      },
    ];
  }
  return g.mockQuotes;
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quotes = getMockQuotes();

  // If no backend configured, use mock data
  if (!API_BASE_URL) {
    return NextResponse.json(quotes);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/quotes/`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Fallback to mocks if backend returns server error
      return NextResponse.json(quotes);
    }

    const data = await res.json().catch(() => null);
    return NextResponse.json(data || quotes);
  } catch {
    // Backend offline fallback
    return NextResponse.json(quotes);
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    
    // Validate required fields
    const errors: Record<string, string> = {};
    if (!body.product) errors.product = "Product is required.";
    if (!body.quantity || body.quantity < 1) errors.quantity = "Quantity must be at least 1.";
    if (!body.contact_phone) errors.contact_phone = "Contact phone is required.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(errors, { status: 400 });
    }

    const quotes = getMockQuotes();

    if (!API_BASE_URL) {
      const newQuote: MockQuote = {
        id: Date.now(),
        product: body.product,
        product_name: body.product_name || body.product,
        user: "user",
        quantity: Number(body.quantity),
        contact_phone: body.contact_phone,
        message: body.message || "",
        status: "new",
        agreed_price: null,
        order_id: null,
        order_number: null,
        created_at: new Date().toISOString(),
      };
      quotes.push(newQuote);
      return NextResponse.json(newQuote, { status: 201 });
    }

    const res = await fetch(`${API_BASE_URL}/api/quotes/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: body.product,
        quantity: Number(body.quantity),
        contact_phone: body.contact_phone,
        message: body.message || "",
      }),
    });

    const data = await res.json().catch(() => null);
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not reach the quotes server." }, { status: 502 });
  }
}
