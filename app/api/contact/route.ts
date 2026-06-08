import { NextRequest, NextResponse } from "next/server";

// TODO: Uncomment when Resend API key is set
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

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

    // --- Resend integration (activate when RESEND_API_KEY is set) ---
    // const { data, error } = await resend.emails.send({
    //   from: "web@azcomposite.com",
    //   to: ["filip.klier@azcomposite.com"],
    //   replyTo: email,
    //   subject: `Nová poptávka od ${name}${company ? ` (${company})` : ""}`,
    //   text: `
    //     Jméno: ${name}
    //     Firma: ${company || "—"}
    //     E-mail: ${email}
    //     Telefon: ${phone || "—"}
    //     
    //     Zpráva:
    //     ${message}
    //   `,
    // });
    //
    // if (error) {
    //   console.error("Resend error:", error);
    //   return NextResponse.json({ error: "Email send failed" }, { status: 500 });
    // }

    // --- Fallback: log to console in development ---
    console.log("📧 Contact form submission:", { name, company, email, phone, message });

    // Simulate success for development
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
