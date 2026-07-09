import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

// Realistic mock orders for local offline verification — shaped like Django's
// OrderSerializer (see api/backend/shop/serializers.py) so the same lib/checkout.ts
// mappers work whether NEXT_PUBLIC_API_BASE_URL is set or not.
const mockOrders = [
  {
    id: 1001,
    number: "DT-482019",
    created_at: "2026-07-01T10:14:22Z",
    status: "delivered",
    fulfillment: "delivery",
    shipping_address: {
      full_name: "Mehdi Developer",
      line1: "123 Main Street, Apt 4B",
      line2: "",
      city: "Springfield",
      postal_code: "12345",
      phone: "(555) 123-4567",
    },
    items: [
      {
        id: 1,
        product: "macbook-air-13-m3",
        name: 'MacBook Air 13" M3',
        sku: "MBA13-M3",
        unit_price: "1199.00",
        quantity: 1,
        line_total: "1199.00",
      },
      {
        id: 2,
        product: "samsung-990-pro-2tb",
        name: "Samsung 990 Pro 2TB NVMe",
        sku: "SS990P-2TB",
        unit_price: "169.00",
        quantity: 2,
        line_total: "338.00",
      },
    ],
    subtotal: "1537.00",
    discount: "50.00",
    promo_code: "WELCOME50",
    delivery_fee: "0.00",
    tax: "118.96",
    total: "1605.96",
  },
  {
    id: 1002,
    number: "DT-302918",
    created_at: "2026-06-12T16:45:00Z",
    status: "delivered",
    fulfillment: "pickup",
    shipping_address: {},
    items: [
      {
        id: 3,
        product: "logitech-mx-keys-s-combo",
        name: "Logitech MX Keys S Combo",
        sku: "LGMXKS-COMBO",
        unit_price: "199.00",
        quantity: 1,
        line_total: "199.00",
      },
    ],
    subtotal: "199.00",
    discount: "0.00",
    promo_code: "",
    delivery_fee: "0.00",
    tax: "15.92",
    total: "214.92",
  },
  {
    id: 1003,
    number: "DT-893012",
    created_at: "2026-07-08T11:22:15Z",
    status: "paid",
    fulfillment: "delivery",
    shipping_address: {
      full_name: "Mehdi Developer",
      line1: "123 Main Street, Apt 4B",
      line2: "",
      city: "Springfield",
      postal_code: "12345",
      phone: "(555) 123-4567",
    },
    items: [
      {
        id: 4,
        product: "asus-rog-strix-g16",
        name: "ASUS ROG Strix G16",
        sku: "ASRSG16",
        unit_price: "1349.00",
        quantity: 1,
        line_total: "1349.00",
      },
    ],
    subtotal: "1349.00",
    discount: "0.00",
    promo_code: "",
    delivery_fee: "0.00",
    tax: "107.92",
    total: "1456.92",
  },
];

interface OrderCreateAddress {
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface OrderCreateBody {
  fulfillment: "pickup" | "delivery";
  items: { product: string; quantity: number }[];
  promo_code?: string;
  address?: OrderCreateAddress;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Order creation always needs the real backend — it recomputes totals and
  // decrements stock, which can't be faithfully faked offline like the GET stub above.
  if (!API_BASE_URL) {
    return NextResponse.json(
      { detail: "Backend is not configured (set NEXT_PUBLIC_API_BASE_URL)." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as OrderCreateBody | null;
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ items: "At least one item is required." }, { status: 400 });
  }

  const authHeaders = {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  };

  try {
    let addressId: number | undefined;

    if (body.fulfillment === "delivery") {
      const address = body.address;
      if (!address) {
        return NextResponse.json({ address_id: "A delivery address is required." }, { status: 400 });
      }

      const addressRes = await fetch(`${API_BASE_URL}/api/addresses/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          full_name: `${address.firstName} ${address.lastName}`.trim(),
          line1: address.line1,
          line2: "",
          city: address.city,
          postal_code: address.postalCode,
          phone: address.phone,
          is_default: false,
        }),
      });

      const addressData = await addressRes.json().catch(() => null);
      if (!addressRes.ok) {
        return NextResponse.json(addressData ?? { address_id: "Could not save delivery address." }, {
          status: addressRes.status,
        });
      }
      addressId = addressData.id;
    }

    const orderRes = await fetch(`${API_BASE_URL}/api/orders/`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        fulfillment: body.fulfillment,
        address_id: addressId,
        items: body.items,
        promo_code: body.promo_code ?? "",
      }),
    });

    const orderData = await orderRes.json().catch(() => null);

    if (!orderRes.ok) {
      if (orderRes.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(orderData ?? { detail: "Could not place your order." }, {
        status: orderRes.status,
      });
    }

    return NextResponse.json(orderData, { status: 201 });
  } catch {
    return NextResponse.json({ detail: "Could not reach the order server." }, { status: 502 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If no backend configured, use mock data
  if (!API_BASE_URL) {
    return NextResponse.json(mockOrders);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(mockOrders);
    }

    const data = await res.json().catch(() => null);
    return NextResponse.json(data || mockOrders);
  } catch {
    // Backend offline fallback
    return NextResponse.json(mockOrders);
  }
}
