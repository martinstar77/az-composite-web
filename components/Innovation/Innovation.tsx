"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./Innovation.module.css";

const ICONS = {
  data: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
      <path d="M14 8v2M14 18v2M8 14H6M22 14h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  activecore: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4L5 9v10l9 5 9-5V9L14 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 4v20M5 9l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  partners: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 24l4-8 6 4 4-10 6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 9v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const IMAGES: Record<string, string> = {
  data: "/images/microscope-carbon.jpg",
  activecore: "/images/active-core-foam.jpg",
  partners: "/images/fiber-roll.jpg",
};

export default function Innovation() {
  const t = useTranslations("innovation");
  const items = t.raw("items") as Array<{ id: string; title: string; body: string }>;

  return (
    <section className={`section ${styles.innovation}`} id="inovace">
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

        <div className={styles.grid}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className={`glass-card ${styles.card}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Image */}
              <div className={styles.cardImage}>
                <Image
                  src={IMAGES[item.id] || "/images/fiber-roll.jpg"}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={styles.imageOverlay} />
              </div>

              {/* Icon */}
              <div className={styles.icon}>
                {ICONS[item.id as keyof typeof ICONS]}
              </div>

              {/* Content */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
