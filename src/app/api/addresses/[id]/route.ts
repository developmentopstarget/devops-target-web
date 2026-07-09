import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

// We'll write helper to update the local mock data
// Note: Normally we'd use a database, but we want this to work when the Django API is offline.
import { GET as getAddresses } from "../route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const { id } = await params;
  const addressId = parseInt(id, 10);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    if (!API_BASE_URL) {
      // In offline mock mode, update our mock address list.
      // Since it's module level in the route.ts file, we need a way to edit it.
      // We can just import and edit if it is exposed, or we can use a simple global trick
      // (like assigning it to a global variable in Node.js global state) to keep it sync.
      // Let's use a global store to share mockAddresses across both route files!
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

      const idx = g.mockAddresses.findIndex((addr) => addr.id === addressId);
      if (idx === -1) {
        return NextResponse.json({ error: "Address not found." }, { status: 404 });
      }

      const updated = {
        ...g.mockAddresses[idx],
        ...body,
      };

      if (body.is_default) {
        g.mockAddresses = g.mockAddresses.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId,
        }));
      } else {
        g.mockAddresses[idx] = updated;
      }

      return NextResponse.json(updated);
    }

    const res = await fetch(`${API_BASE_URL}/api/addresses/${addressId}/`, {
      method: "PATCH",
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

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Could not reach the database server." }, { status: 502 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const { id } = await params;
  const addressId = parseInt(id, 10);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!API_BASE_URL) {
      const g = global as unknown as { mockAddresses?: any[] };
      if (g.mockAddresses) {
        g.mockAddresses = g.mockAddresses.filter((addr) => addr.id !== addressId);
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const res = await fetch(`${API_BASE_URL}/api/addresses/${addressId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to delete address" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not reach the database server." }, { status: 502 });
  }
}
