"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./CookieBanner.module.css";

interface CustomWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (command: string, action: string, config: Record<string, unknown>) => void;
  clarityInitialized?: boolean;
}

export default function CookieBanner() {
  const t = useTranslations("cookie_banner");
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Granular consent states (defaulting to true for pre-selection UX)
  const [consentAnalytical, setConsentAnalytical] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(true);

  // Helper function to dynamically initialize Microsoft Clarity
  const initializeClarity = () => {
    if (typeof window !== "undefined") {
      const customWindow = window as unknown as CustomWindow;
      const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

      if (!customWindow.clarityInitialized && clarityId) {
        customWindow.clarityInitialized = true;
        (function(c,l,a,r,i,t,y){
            // @ts-ignore
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            // @ts-ignore
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            // @ts-ignore
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script",clarityId);
      }
    }
  };

  // Define GTM consent update function
  const updateConsentMode = (analytical: boolean, marketing: boolean) => {
    if (typeof window !== "undefined") {
      const customWindow = window as unknown as CustomWindow;
      
      // Update Google Consent Mode v2
      if (typeof customWindow.gtag === "function") {
        customWindow.gtag("consent", "update", {
          ad_storage: marketing ? "granted" : "denied",
          analytics_storage: analytical ? "granted" : "denied",
          ad_user_data: marketing ? "granted" : "denied",
          ad_personalization: marketing ? "granted" : "denied",
        });
      }

      // Legacy custom dataLayer consent updates
      const dataLayer = customWindow.dataLayer || [];
      customWindow.dataLayer = dataLayer;
      
      dataLayer.push({
        event: "consent_update",
        analytics_consent: analytical ? "granted" : "denied",
        marketing_consent: marketing ? "granted" : "denied",
      });

      // Load/Initialize Clarity if analytical cookies are accepted
      if (analytical) {
        initializeClarity();
      }
    }
  };

  // Listen for the custom open event (e.g. from Footer)
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowBanner(true);
      setIsSettingsOpen(true);
    };

    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("open-cookie-settings", handleOpenSettings);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        setShowBanner(true);
      } else {
        try {
          if (consent === "granted") {
            setConsentAnalytical(true);
            setConsentMarketing(true);
            updateConsentMode(true, true);
          } else if (consent === "denied") {
            setConsentAnalytical(false);
            setConsentMarketing(false);
            updateConsentMode(false, false);
          } else {
            const parsed = JSON.parse(consent);
            const analytical = !!parsed.analytical;
            const marketing = !!parsed.marketing;
            setConsentAnalytical(analytical);
            setConsentMarketing(marketing);
            updateConsentMode(analytical, marketing);
          }
        } catch {
          // Fallback if local storage string is corrupted or obsolete
          setConsentAnalytical(false);
          setConsentMarketing(false);
          updateConsentMode(false, false);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    const consentObj = { analytical: true, marketing: true };
    localStorage.setItem("cookie_consent", JSON.stringify(consentObj));
    setConsentAnalytical(true);
    setConsentMarketing(true);
    updateConsentMode(true, true);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const consentObj = { analytical: false, marketing: false };
    localStorage.setItem("cookie_consent", JSON.stringify(consentObj));
    setConsentAnalytical(false);
    setConsentMarketing(false);
    updateConsentMode(false, false);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    const consentObj = { analytical: consentAnalytical, marketing: consentMarketing };
    localStorage.setItem("cookie_consent", JSON.stringify(consentObj));
    updateConsentMode(consentAnalytical, consentMarketing);
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

        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              className={styles.settingsPanel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              {/* Essential Cookies */}
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    className={styles.checkboxInput}
                    onChange={() => {}}
                  />
                  <span className={styles.checkboxCustom}></span>
                  <div className={styles.checkboxText}>
                    <span className={styles.checkboxTitle}>
                      {t("essential_title")}
                      <span className={styles.badgeRequired}>
                        {t("essential_title") === "Nezbytné" ? "Aktivní" : "Active"}
                      </span>
                    </span>
                    <p className={styles.checkboxDescription}>
                      {t("essential_desc")}
                    </p>
                  </div>
                </label>
              </div>

              {/* Analytical Cookies */}
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={consentAnalytical}
                    onChange={(e) => setConsentAnalytical(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxCustom}></span>
                  <div className={styles.checkboxText}>
                    <span className={styles.checkboxTitle}>
                      {t("analytical_title")}
                    </span>
                    <p className={styles.checkboxDescription}>
                      {t("analytical_desc")}
                    </p>
                  </div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={consentMarketing}
                    onChange={(e) => setConsentMarketing(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxCustom}></span>
                  <div className={styles.checkboxText}>
                    <span className={styles.checkboxTitle}>
                      {t("marketing_title")}
                    </span>
                    <p className={styles.checkboxDescription}>
                      {t("marketing_desc")}
                    </p>
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.actions}>
          {!isSettingsOpen ? (
            <>
              <button
                className={`btn ${styles.btnSettings}`}
                onClick={() => setIsSettingsOpen(true)}
              >
                {t("settings")}
              </button>
              <button
                className={`btn ${styles.btnReject}`}
                onClick={handleRejectAll}
              >
                {t("reject_all")}
              </button>
              <button
                className={`btn ${styles.btnAccept}`}
                onClick={handleAcceptAll}
              >
                {t("accept_all")}
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn ${styles.btnSettings}`}
                onClick={() => setIsSettingsOpen(false)}
              >
                {t("settings") === "Nastavení" ? "Zpět" : "Back"}
              </button>
              <button
                className={`btn ${styles.btnReject}`}
                onClick={handleRejectAll}
              >
                {t("reject_all")}
              </button>
              <button
                className={`btn ${styles.btnSave}`}
                onClick={handleSaveSettings}
              >
                {t("save")}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
