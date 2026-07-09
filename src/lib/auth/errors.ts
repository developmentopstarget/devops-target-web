// Mirrors the RDA `parseAuthErrors` approach: djoser returns per-field arrays
// (username/email/password) plus a `non_field_errors` array for auth-level
// failures like invalid credentials. Normalize both into a flat field->message
// map so forms can show inline errors and a top banner from the same shape.
export function parseAuthErrors(payload: unknown): Record<string, string> {
  if (!payload || typeof payload !== "object") {
    return { form: "Something went wrong. Please try again." };
  }

  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    const message = Array.isArray(value) ? value[0] : typeof value === "string" ? value : undefined;
    if (typeof message !== "string" || !message) continue;
    errors[key === "non_field_errors" || key === "detail" ? "form" : key] = message;
  }

  if (Object.keys(errors).length === 0) {
    errors.form = "Something went wrong. Please try again.";
  }

  return errors;
}
