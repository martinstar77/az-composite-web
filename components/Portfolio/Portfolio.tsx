"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";

const CATEGORY_ICONS: Record<string, string> = {
  vyztuzne: "⬡",
  prepregy: "◈",
  pryskyrice: "◉",
  sendvic: "⬢",
  techmat: "◇",
  chemie: "⬟",
  spoj: "⬣",
};

export default function Portfolio() {
  const t = useTranslations("portfolio");
  const items = t.raw("items") as Array<{ id: string; title: string; body: string }>;

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

        {/* Bottom quote */}
        <motion.div
          className={styles.quoteRow}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.quoteLine} />
          <p className={styles.quote}>{t("quote")}</p>
          <div className={styles.quoteLine} />
        </motion.div>
      </div>
    </section>
  );
}
