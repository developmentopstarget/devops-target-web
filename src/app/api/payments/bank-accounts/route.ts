import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE_NAME } from "@/lib/auth/config";

interface MockBankAccount {
  id: number;
  bank_name: string;
  card_number: string;
  sheba_number: string;
  holder_name: string;
  is_active: boolean;
}

const mockBankAccounts: MockBankAccount[] = [
  {
    id: 1,
    bank_name: "Mellat Bank / بانک ملت",
    card_number: "6104337890123456",
    sheba_number: "IR120120000000001234567890",
    holder_name: "Mehdi Karimi / مهدی کریمی",
    is_active: true,
  },
  {
    id: 2,
    bank_name: "Saman Bank / بانک سامان",
    card_number: "6219861012345678",
    sheba_number: "IR560560000000008765432109",
    holder_name: "Mehdi Karimi / مهدی کریمی",
    is_active: true,
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
    return NextResponse.json(mockBankAccounts);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/bank-accounts/`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Fallback to mocks if backend returns server error
      return NextResponse.json(mockBankAccounts);
    }

    const data = await res.json().catch(() => null);
    return NextResponse.json(data || mockBankAccounts);
  } catch {
    // Backend offline fallback
    return NextResponse.json(mockBankAccounts);
  }
}
