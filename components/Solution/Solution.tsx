"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import styles from "./Solution.module.css";

export default function Solution() {
  const t = useTranslations("solution");

  return (
    <section className={`section ${styles.solution}`} id="reseni">
      <div className="container">
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left: Section label */}
          <div className={styles.left}>
            <div className="section-label">{t("heading")}</div>
            <div className="accent-line" />
            <p className={styles.tagline}>
              {t("tagline1")}<br />
              <span className="text-gradient">{t("tagline2")}</span>
            </p>
          </div>

          {/* Right: Quote cards */}
          <div className={styles.right}>
            <div className={`glass-card ${styles.quoteCard}`}>
              <div className={styles.quoteIcon} aria-hidden="true">&ldquo;</div>
              <p className={styles.quoteText}>{t("quote1")}</p>
            </div>
            <div className={`glass-card ${styles.quoteCard} ${styles.quoteCardAccent}`}>
              <div className={styles.quoteIcon} aria-hidden="true">&ldquo;</div>
              <p className={styles.quoteText}>{t("quote2")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
