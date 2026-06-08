"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./CookieBanner.module.css";

interface CustomWindow extends Window {
  dataLayer?: unknown[];
}

export default function CookieBanner() {
  const t = useTranslations("cookie_banner");
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const updateConsentMode = (granted: boolean) => {
    if (typeof window !== "undefined") {
      const customWindow = window as unknown as CustomWindow;
      const dataLayer = customWindow.dataLayer || [];
      customWindow.dataLayer = dataLayer;
      dataLayer.push({
        event: "consent_update",
        analytics_consent: granted ? "granted" : "denied",
        marketing_consent: granted ? "granted" : "denied",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        setShowBanner(true);
      } else {
        updateConsentMode(consent === "granted");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleConsent = (granted: boolean) => {
    localStorage.setItem("cookie_consent", granted ? "granted" : "denied");
    updateConsentMode(granted);
    setShowBanner(false);
  };

  if (!mounted || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.banner}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className={styles.content}>
          <div className={styles.title}>{t("title")}</div>
          <p className={styles.text}>{t("text")}</p>
        </div>
        <div className={styles.actions}>
          <button
            className={`btn ${styles.btnReject}`}
            onClick={() => handleConsent(false)}
          >
            {t("reject_all")}
          </button>
          <button
            className={`btn ${styles.btnAccept}`}
            onClick={() => handleConsent(true)}
          >
            {t("accept_all")}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
