import type { Metadata } from "next";
import { Outfit, Afacad_Flux } from "next/font/google";
import { getLocale } from "next-intl/server";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const afacadFlux = Afacad_Flux({
  subsets: ["latin"],
  variable: "--font-afacad",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AZComposite — Komplexní partner pro kompozitní výrobu",
  description:
    "AZComposite poskytuje prémiové materiály pro kompozitní výrobu: výztužné tkaniny, prepregy, pryskyřice, sendvičové materiály a technologické materiály. Váš agile partner pro laminaci.",
  keywords:
    "kompozity, uhlíkové tkaniny, prepregy, pryskyřice, sendvičové materiály, laminace, carbon fiber, AZComposite",
  icons: {
    icon: "/images/logo-icon.png",
    shortcut: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  openGraph: {
    title: "AZComposite — Komplexní partner pro kompozitní výrobu",
    description:
      "Prémiové materiály pro kompozitní výrobu. Vlastní vývoj, globální sourcing, agile delivery.",
    url: "https://azcomposite.com",
    siteName: "AZComposite",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AZComposite — Premium Composite Supplier",
    description:
      "Complete range of composite materials. Carbon, glass, aramid, resins, prepregs, process materials.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the locale set by next-intl middleware so the <html lang> attribute
  // is always accurate — avoids hydration mismatch.
  const locale = await getLocale();
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-R4WN01DDYY";

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${afacadFlux.variable}`}
    >
      <head>
        {/* Google Consent Mode v2 Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              
              // Default to denied
              var consentAnalytical = 'denied';
              var consentMarketing = 'denied';
              
              // Check if user has already granted/denied consent in a previous session
              try {
                var storedConsent = localStorage.getItem('cookie_consent');
                if (storedConsent) {
                  if (storedConsent === 'granted') {
                    consentAnalytical = 'granted';
                    consentMarketing = 'granted';
                  } else if (storedConsent === 'denied') {
                    // Stays denied
                  } else {
                    var parsed = JSON.parse(storedConsent);
                    if (parsed.analytical) consentAnalytical = 'granted';
                    if (parsed.marketing) consentMarketing = 'granted';
                  }
                }
              } catch (e) {}
              
              gtag('consent', 'default', {
                'ad_storage': consentMarketing,
                'ad_user_data': consentMarketing,
                'ad_personalization': consentMarketing,
                'analytics_storage': consentAnalytical,
                'wait_for_update': 500
              });
            `,
          }}
        />
        {/* Google Analytics 4 — loaded via next/script to avoid hydration issues */}
        <Script
          id="google-tag"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-tag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
