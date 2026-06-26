"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import styles from "./HowWeWork.module.css";

interface Step {
  title: string;
  description: string;
}

export default function HowWeWork() {
  const t = useTranslations("how_we_work");
  const steps = t.raw("steps") as Step[];

  return (
    <section className={`section ${styles.howWeWork}`} id="jak-pracujeme">
      <div className="container">
        {/* Header */}
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

        {/* Steps Grid */}
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`glass-card ${styles.card}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.cardNumber} aria-hidden="true">
                0{index + 1}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardDescription}>{step.description}</p>
              </div>
              <div className={styles.cardGlow} aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
