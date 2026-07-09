import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

// Initialize global mockAddresses if not present
const getMockAddresses = () => {
  const g = global as unknown as { mockAddresses?: any[] };
  if (!g.mockAddresses) {
    g.mockAddresses = [
      {
        id: 1,
        first_name: "Mehdi",
        last_name: "Developer",
        line1: "123 Main Street, Apt 4B",
        city: "Springfield",
        postal_code: "12345",
        phone: "(555) 123-4567",
        is_default: true,
      },
      {
        id: 2,
        first_name: "Mehdi",
        last_name: "Work Office",
        line1: "789 Enterprise Blvd, Suite 100",
        city: "Springfield",
        postal_code: "54321",
        phone: "(555) 987-6543",
        is_default: false,
      },
    ];
  }
  return g.mockAddresses;
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = getMockAddresses();

  // If no backend configured, use mock data
  if (!API_BASE_URL) {
    return NextResponse.json(addresses);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/addresses/`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Fallback to mocks if backend returns server error
      return NextResponse.json(addresses);
    }

    const data = await res.json().catch(() => null);
    return NextResponse.json(data || addresses);
  } catch {
    // Backend offline fallback
    return NextResponse.json(addresses);
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
    const required = ["first_name", "last_name", "line1", "city", "postal_code", "phone"];
    const errors: Record<string, string> = {};
    required.forEach((field) => {
      if (!body[field]) {
        errors[field] = "This field is required.";
      }
    });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(errors, { status: 400 });
    }

    const addresses = getMockAddresses();

    if (!API_BASE_URL) {
      const newAddress = {
        id: Date.now(),
        first_name: body.first_name,
        last_name: body.last_name,
        line1: body.line1,
        city: body.city,
        postal_code: body.postal_code,
        phone: body.phone,
        is_default: Boolean(body.is_default),
      };

      const g = global as unknown as { mockAddresses: any[] };
      if (newAddress.is_default) {
        g.mockAddresses = g.mockAddresses.map((addr) => ({ ...addr, is_default: false }));
      }
      g.mockAddresses.push(newAddress);
      return NextResponse.json(newAddress, { status: 201 });
    }

    const res = await fetch(`${API_BASE_URL}/api/addresses/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not reach the database server." }, { status: 502 });
  }
}

