"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const links = [
    { href: "#reseni", label: nav("solution") },
    { href: "#inovace", label: nav("innovation") },
    { href: "#portfolio", label: nav("portfolio") },
    { href: "#kontakt", label: nav("contact") },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Logo + tagline */}
        <div className={styles.brand}>
          <Link href={`/${locale}`} aria-label="AZComposite">
            <Image
              src="/images/logo.png"
              alt="AZComposite"
              width={140}
              height={38}
              style={{ height: "32px", width: "auto" }}
              className={styles.logo}
            />
          </Link>
          <p className={styles.tagline}>{t("tagline")}</p>
        </div>

        {/* Nav links */}
        <nav className={styles.nav} aria-label="Footer navigace">
          {links.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Social / lang */}
        <div className={styles.right}>
          <Link href={locale === "cs" ? "/en" : "/cs"} className={styles.langLink}>
            {locale === "cs" ? "🇬🇧 EN" : "🇨🇿 CS"}
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <span className={styles.copy}>
              © {year} AZComposite · Ing. Filip Klier · IČO: 23048255 · {t("rights")}
            </span>
            <a href="mailto:filip.klier@azcomposite.com" className={styles.bottomEmail}>
              filip.klier@azcomposite.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
