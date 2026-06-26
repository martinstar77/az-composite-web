"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  const tDetails = useTranslations("portfolio_details");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const items = (t.raw("items") as Array<{ id: string; title: string; body: string }>)
    .filter(item => item.id !== "prepregy");

  const selectedItem = items.find(item => item.id === selectedItemId);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (selectedItemId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItemId]);

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
              onClick={() => setSelectedItemId(item.id)}
              style={{ cursor: "pointer" }}
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

      {/* Slide-over Drawer for B2B details */}
      <AnimatePresence>
        {selectedItemId && selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemId(null)}
            />

            {/* Drawer */}
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              {/* Close Button */}
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedItemId(null)}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className={styles.drawerContent}>
                {/* Header */}
                <div className={styles.drawerHeader}>
                  <div className={styles.drawerSymbol}>
                    {CATEGORY_ICONS[selectedItem.id]}
                  </div>
                  <div>
                    <span className={styles.drawerSubtitle}>
                      {tDetails(`${selectedItem.id}.subtitle`)}
                    </span>
                    <h3 className={styles.drawerTitle}>{selectedItem.title}</h3>
                  </div>
                </div>

                <div className="accent-line" style={{ margin: "var(--space-6) 0", height: "1px", width: "100%" }} />

                {/* Intro */}
                <p className={styles.drawerIntro}>
                  {tDetails(`${selectedItem.id}.intro`)}
                </p>

                {/* Specs */}
                <div className={styles.specsSection}>
                  <h4 className={styles.sectionTitle}>
                    {selectedItem.id === "chemie" ? "Sortiment a vlastnosti" : "Technické parametry"}
                  </h4>
                  <div className={styles.specsTable}>
                    {(tDetails.raw(`${selectedItem.id}.specs`) as Array<{ label: string; value: string }>).map((spec, index) => (
                      <div key={index} className={styles.specsRow}>
                        <span className={styles.specsLabel}>{spec.label}</span>
                        <span className={styles.specsValue}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className={styles.highlightsSection}>
                  <h4 className={styles.sectionTitle}>B2B přednosti a aplikace</h4>
                  <ul className={styles.highlightsList}>
                    {(tDetails.raw(`${selectedItem.id}.highlights`) as string[]).map((highlight, index) => (
                      <li key={index} className={styles.highlightsItem}>
                        <span className={styles.checkIcon}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13.3 4.3L6 11.6l-3.3-3.3" />
                          </svg>
                        </span>
                        <span className={styles.highlightsText}>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  className={`btn btn-primary btn-lg ${styles.drawerCta}`}
                  onClick={() => {
                    const itemName = selectedItem.title;
                    const message = tDetails(`${selectedItem.id}.cta`).includes("spojovací")
                      ? "Dobrý den, mám zájem o kalkulaci a vzorky pro spojovací materiál (Specialinsert)..."
                      : `Dobrý den, mám zájem o bližší informace a nacenění z kategorie: ${itemName}.`;
                    
                    window.dispatchEvent(new CustomEvent("prefill-contact-form", {
                      detail: { message }
                    }));
                    setSelectedItemId(null);
                  }}
                >
                  {tDetails(`${selectedItem.id}.cta`)}
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 8h12M10 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
