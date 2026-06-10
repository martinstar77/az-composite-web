"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Hero.module.css";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Carbon fiber bg texture */}
      <div className={styles.bgTexture} aria-hidden="true" />

      {/* Purple glow orbs */}
      <div className={`${styles.orb} ${styles.orbLeft}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbRight}`} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        {/* Logo above heading */}
        <motion.div className={styles.logoWrapper} {...fadeUp(0)}>
          <Image
            src="/images/logo.png"
            alt="AZComposite"
            width={480}
            height={132}
            priority
            loading="eager"
            className={styles.heroLogo}
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1 className={styles.heading} {...fadeUp(0.15)}>
          <span className={styles.headingLine1}>{t("heading1")}</span>
          <span className={`${styles.headingLine2} text-gradient`}>
            {t("heading2")}
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p className={styles.sub} {...fadeUp(0.3)}>
          {t("sub")}
        </motion.p>

        {/* Feature pills */}
        <motion.div className={styles.pills} {...fadeUp(0.38)}>
          <span className={styles.pill}>{t("pill1")}</span>
          <span className={styles.pill}>{t("pill2")}</span>
          <span className={styles.pill}>{t("pill3")}</span>
        </motion.div>

        {/* CTAs */}
        <motion.div className={styles.ctas} {...fadeUp(0.45)}>
          <a href="#kontakt" className={`btn btn-primary btn-lg ${styles.ctaBtn}`}>
            {t("cta_primary")}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#portfolio" className={`btn btn-outline btn-lg ${styles.ctaBtn}`}>
            {t("cta_secondary")}
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          aria-hidden="true"
        >
          <div className={styles.scrollLine} />
          <span className={styles.scrollText}>{t("scroll")}</span>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
