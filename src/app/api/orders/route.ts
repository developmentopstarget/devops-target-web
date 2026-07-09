import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

// Realistic mock orders for local offline verification
const mockOrders = [
  {
    orderNumber: "DT-482019",
    placedAt: "2026-07-01T10:14:22Z",
    email: "user@example.com",
    deliveryMethod: "delivery",
    address: {
      firstName: "Mehdi",
      lastName: "Developer",
      line1: "123 Main Street, Apt 4B",
      city: "Springfield",
      postalCode: "12345",
      phone: "(555) 123-4567",
    },
    items: [
      {
        productId: "p1",
        slug: "macbook-air-13-m3",
        name: 'MacBook Air 13" M3',
        price: 1199,
        qty: 1,
        image: "/images/products/macbook-air-13.jpg",
      },
      {
        productId: "p6",
        slug: "samsung-990-pro-2tb",
        name: "Samsung 990 Pro 2TB NVMe",
        price: 169,
        qty: 2,
        image: "/images/products/samsung-990-pro.jpg",
      },
    ],
    subtotal: 1537,
    discount: 50,
    promoCode: "WELCOME50",
    deliveryFee: 0,
    tax: 118.96,
    total: 1605.96,
    status: "completed",
  },
  {
    orderNumber: "DT-302918",
    placedAt: "2026-06-12T16:45:00Z",
    email: "user@example.com",
    deliveryMethod: "pickup",
    pickupContact: {
      firstName: "Mehdi",
      lastName: "Developer",
      phone: "(555) 123-4567",
    },
    items: [
      {
        productId: "p7",
        slug: "logitech-mx-keys-s-combo",
        name: "Logitech MX Keys S Combo",
        price: 199,
        qty: 1,
        image: "/images/products/logitech-mx-keys.jpg",
      },
    ],
    subtotal: 199,
    discount: 0,
    deliveryFee: 0,
    tax: 15.92,
    total: 214.92,
    status: "completed",
  },
  {
    orderNumber: "DT-893012",
    placedAt: "2026-07-08T11:22:15Z",
    email: "user@example.com",
    deliveryMethod: "delivery",
    address: {
      firstName: "Mehdi",
      lastName: "Developer",
      line1: "123 Main Street, Apt 4B",
      city: "Springfield",
      postalCode: "12345",
      phone: "(555) 123-4567",
    },
    items: [
      {
        productId: "p2",
        slug: "asus-rog-strix-g16",
        name: "ASUS ROG Strix G16",
        price: 1349,
        qty: 1,
        image: "/images/products/asus-rog-strix.jpg",
      },
    ],
    subtotal: 1349,
    discount: 0,
    deliveryFee: 0,
    tax: 107.92,
    total: 1456.92,
    status: "paid",
  },
];

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
