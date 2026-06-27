import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Helper functions for sanitization
function sanitizeString(str: string, maxLength: number): string {
  if (!str) return "";
  // Strip newlines and carriage returns (prevents header injection)
  let sanitized = str.replace(/[\r\n]/g, " ");
  // Strip HTML tags (prevents XSS)
  sanitized = sanitized.replace(/<[^>]*>/g, "");
  return sanitized.trim().slice(0, maxLength);
}

function sanitizeTextArea(str: string, maxLength: number): string {
  if (!str) return "";
  // Strip HTML tags (prevents XSS)
  let sanitized = str.replace(/<[^>]*>/g, "");
  return sanitized.trim().slice(0, maxLength);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Origin / Referer validation
    const origin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";
    const allowedOrigins = [
      "https://azcomposite.com",
      "https://www.azcomposite.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];
    
    const isAllowed = allowedOrigins.some((o) => origin.startsWith(o) || referer.startsWith(o));
    if (!isAllowed) {
      console.warn(`🛡️ Security Warning: Forbidden origin/referer. Origin=${origin}, Referer=${referer}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, company, email, phone, message, fax_number, form_submitted_at } = body;

    // 2. Honeypot check (Spam bot detection)
    if (fax_number) {
      console.warn("🛡️ Security Warning: Honeypot triggered. Bot submission detected.");
      // 2-second sleep penalty to waste bot resources
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Decoy success response so the bot thinks it succeeded and leaves
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 3. Timing check (Spam bot detection)
    const now = Date.now();
    if (form_submitted_at && now - Number(form_submitted_at) < 3000) {
      console.warn("🛡️ Security Warning: Submitted too fast. Bot suspected.");
      // 2-second sleep penalty
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Decoy success response
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 4. Cloudflare Turnstile verification
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const { turnstileToken } = body;
      if (!turnstileToken) {
        console.warn("🛡️ Security Warning: Turnstile token is missing.");
        return NextResponse.json({ error: "Captcha validation required" }, { status: 400 });
      }

      // Verify Turnstile token with Cloudflare
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}`,
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.warn("🛡️ Security Warning: Turnstile validation failed:", verifyData["error-codes"]);
        return NextResponse.json({ error: "Invalid captcha token" }, { status: 400 });
      }
    }

    // 5. Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 5. Sanitization & Length restrictions
    const cleanName = sanitizeString(name, 100);
    const cleanCompany = sanitizeString(company || "", 100);
    const cleanPhone = sanitizeString(phone || "", 30);
    const cleanMessage = sanitizeTextArea(message, 3000);

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const { error } = await resend.emails.send({
        from: "info@azcomposite.com",
        to: ["info@azcomposite.com"],
        replyTo: email,
        subject: `Nová poptávka od ${cleanName}${cleanCompany ? ` (${cleanCompany})` : ""}`,
        text: `
          Jméno: ${cleanName}
          Firma: ${cleanCompany || "—"}
          E-mail: ${email}
          Telefon: ${cleanPhone || "—"}
          
          Zpráva:
          ${cleanMessage}
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json({ error: "Email send failed" }, { status: 500 });
      }
    } else {
      // Fallback: log to console in development
      console.log("📧 (Dev Mode - No API Key) Contact form submission:", {
        name: cleanName,
        company: cleanCompany,
        email,
        phone: cleanPhone,
        message: cleanMessage,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
