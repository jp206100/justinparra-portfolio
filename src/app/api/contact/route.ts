import { NextResponse } from "next/server";
import { Resend } from "resend";

// The inbox that receives inquiries, and the verified sender they come from.
// `onboarding@resend.dev` works out of the box on a fresh Resend account but
// can only deliver to the address the account was signed up with — set
// CONTACT_FROM_EMAIL to an address on a verified domain for production.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "justinparra206@gmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "JustinParra.com <onboarding@resend.dev>";
const SUBJECT = "JustinParra.com Form Inquiry";

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;

// Deliberately permissive — the real validation is whether the reply bounces.
// This only catches obvious typos and junk.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Lightweight per-instance throttle. Serverless instances are short-lived and
// not shared, so this is a speed bump for casual abuse rather than a real rate
// limiter — the honeypot below does most of the spam work.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recentSubmissions.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  hits.push(now);
  recentSubmissions.set(key, hits);

  // Keep the map from growing unbounded across a warm instance's lifetime.
  if (recentSubmissions.size > 500) {
    for (const [k, times] of recentSubmissions) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(k);
      }
    }
  }

  return hits.length > RATE_LIMIT_MAX;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** Escape user-supplied text before it goes into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strip CR/LF from anything that lands in a header (the Reply-To address and
 * display name) so a crafted submission can't inject additional headers.
 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  const {
    name: rawName,
    email: rawEmail,
    message: rawMessage,
    company,
  } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a field hidden from real users. Anything that fills it in is a
  // bot. Respond with success so the bot has no signal to adapt to.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof rawName === "string" ? rawName.trim() : "";
  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please enter your name.";
  else if (name.length > NAME_MAX) fieldErrors.name = "That name is too long.";

  if (!email) fieldErrors.email = "Please enter your email.";
  else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email))
    fieldErrors.email = "Please enter a valid email address.";

  if (!message) fieldErrors.message = "Please enter a message.";
  else if (message.length > MESSAGE_MAX)
    fieldErrors.message = `Please keep your message under ${MESSAGE_MAX.toLocaleString()} characters.`;

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ fieldErrors }, { status: 400 });
  }

  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a minute." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact form cannot send mail.");
    return NextResponse.json(
      {
        error:
          "The form is temporarily unavailable. Please email justinparra206@gmail.com directly.",
      },
      { status: 503 }
    );
  }

  const safeName = sanitizeHeaderValue(name);
  const safeEmail = sanitizeHeaderValue(email);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: SUBJECT,
      // Replying in Gmail goes straight back to the sender.
      replyTo: `${safeName} <${safeEmail}>`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; color: #1A1A1A; line-height: 1.6;">
          <p style="margin: 0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 0 0 20px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(safeEmail)}" style="color: #C8412B;">${escapeHtml(email)}</a></p>
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend rejected the contact form message:", error);
      return NextResponse.json(
        {
          error:
            "Something went wrong sending your message. Please email justinparra206@gmail.com directly.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong sending your message. Please email justinparra206@gmail.com directly.",
      },
      { status: 500 }
    );
  }
}
