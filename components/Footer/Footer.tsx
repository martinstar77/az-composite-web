"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("footer");
  const ti = useTranslations("contact.info");
  const locale = useLocale();
  const year = new Date().getFullYear();

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

        {/* Billing Info */}
        <div className={styles.billing}>
          <h3 className={styles.billingHeading}>{ti("billing_heading")}</h3>
          <p className={styles.billingText}>
            <strong>{ti("billing_name")}</strong><br />
            {ti("billing_address")}<br />
            {ti("billing_city")}<br />
            {ti("billing_country")}
          </p>
          <p className={styles.billingIds}>
            {ti("ico")} &nbsp;·&nbsp; {ti("dic")}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <span className={styles.copy}>
              © {year} AZComposite · Ing. Filip Klier · IČO: 23048255 · {t("rights")}
            </span>
            <div className={styles.bottomLinks}>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("open-cookie-settings"));
                  }
                }}
                className={styles.bottomLink}
              >
                {t("cookie_settings")}
              </button>
              <span className={styles.separator}>|</span>
              <Link href="/privacy" className={styles.bottomEmail}>
                {t("privacy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
