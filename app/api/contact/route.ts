import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const { error } = await resend.emails.send({
        from: "web@azcomposite.com",
        to: ["filip.klier@azcomposite.com"],
        replyTo: email,
        subject: `Nová poptávka od ${name}${company ? ` (${company})` : ""}`,
        text: `
          Jméno: ${name}
          Firma: ${company || "—"}
          E-mail: ${email}
          Telefon: ${phone || "—"}
          
          Zpráva:
          ${message}
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json({ error: "Email send failed" }, { status: 500 });
      }
    } else {
      // Fallback: log to console in development
      console.log("📧 (Dev Mode - No API Key) Contact form submission:", {
        name,
        company,
        email,
        phone,
        message,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
