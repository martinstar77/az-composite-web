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

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${afacadFlux.variable}`}
    >
      <head>
        {/* Google Tag Manager — loaded via next/script to avoid hydration issues */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GT-TBVWFS2N');
            `,
          }}
        />
      </head>
      <body>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GT-TBVWFS2N"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
