import { NextResponse } from "next/server";

// TODO(2fa): django-otp lands in the api repo in Phase 4. Replace this stub with a real
// call to the OTP challenge/verify endpoint, and thread the challenge token issued at
// login through to this route instead of trusting the client-submitted code alone.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";

  if (code.trim().length < 4) {
    return NextResponse.json({ form: "Enter a valid code." }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({ ok: true });
}
