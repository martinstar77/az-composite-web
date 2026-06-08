import { useTranslations } from "next-intl";
import Link from "next/link";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: "140px", paddingBottom: "80px", maxWidth: "800px" }}>
        <h1 className="section-heading" style={{ marginBottom: "20px" }}>{t("title")}</h1>
        <div className="accent-line" />
        
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-lg)", marginBottom: "40px", lineHeight: "1.7" }}>
          {t("intro")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "30px", marginBottom: "50px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", color: "var(--color-text-primary)", marginBottom: "10px" }}>
              {t("section1_title")}
            </h2>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
              {t("section1_text")}
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", color: "var(--color-text-primary)", marginBottom: "10px" }}>
              {t("section2_title")}
            </h2>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
              {t("section2_text")}
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", color: "var(--color-text-primary)", marginBottom: "10px" }}>
              {t("section3_title")}
            </h2>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
              {t("section3_text")}
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", color: "var(--color-text-primary)", marginBottom: "10px" }}>
              {t("section4_title")}
            </h2>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
              {t("section4_text")}
            </p>
          </div>
        </div>

        <Link href="/" className="btn btn-outline">
          &larr; {t("back")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
