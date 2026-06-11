"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  vyztuzne: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8h20M2 16h20M8 2v20M16 2v20" />
      <path d="M5 5l2 2M11 11l2 2M17 17l2 2" />
    </svg>
  ),
  prepregy: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M12 9c4.42 0 8-1.34 8-3" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  ),
  pryskyrice: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 007-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 007 7z" />
      <path d="M12 18a3 3 0 003-3" />
    </svg>
  ),
  sendvic: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5h20M2 19h20" strokeWidth="2" />
      <path d="M6 9l3 3-3 3M12 9l3 3-3 3M18 9l3 3-3 3" />
      <path d="M9 12h3M15 12h3" />
    </svg>
  ),
  techmat: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h20M4 14h16" />
      <path d="M12 6c-4 0-7 2.5-7 5.5h14C19 8.5 16 6 12 6z" strokeDasharray="2 2" />
      <path d="M12 6V2M9 4l3-2 3 2" />
    </svg>
  ),
  chemie: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M10 3v5L4 19a2 2 0 002 2h12a2 2 0 002-2L14 8V3" />
      <path d="M6 16h12" strokeDasharray="2 2" />
      <path d="M8 12h8" />
    </svg>
  ),
  spoj: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M7 7h10v3H7z" />
      <path d="M10 10v11a1 1 0 001 1h2a1 1 0 001-1V10" />
      <path d="M10 13h4M10 16h4M10 19h4" />
    </svg>
  ),
};

export default function Portfolio() {
  const t = useTranslations("portfolio");
  const items = (t.raw("items") as Array<{ id: string; title: string; body: string }>)
    .filter(item => item.id !== "prepregy");

  return (
    <section className={`section ${styles.portfolio}`} id="portfolio">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-label">{t("heading")}</div>
          <h2 className="section-heading">{t("heading")}</h2>
          <p className={styles.subheading}>{t("subheading")}</p>
        </motion.div>

        {/* Grid */}
        <div className={styles.grid}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className={styles.card}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardSymbol}>{CATEGORY_ICONS[item.id]}</div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.body}</p>
                </div>
                <div className={styles.cardArrow} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className={styles.cardGlow} aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom banner (Full width, matching Stats style) */}
      <motion.div
        className={styles.banner}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.bannerGlow} aria-hidden="true" />
        <div className="container">
          <p className={styles.bannerText}>
            {t.rich("quote", {
              gradient: (chunks) => <span className="text-gradient font-semibold">{chunks}</span>
            })}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
