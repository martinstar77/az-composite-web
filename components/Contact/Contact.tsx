"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import styles from "./Contact.module.css";
import { Turnstile } from "@marsidev/react-turnstile";

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  fax_number?: string;
  form_submitted_at?: number;
  turnstileToken?: string;
};

export default function Contact() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const ti = useTranslations("contact.info");
  
  interface Member {
    name: string;
    role: string;
    phone: string;
    email: string;
  }
  
  const members = (ti.raw("members") || []) as Member[];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mountedAt, setMountedAt] = useState<number>(0);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    setMountedAt(Date.now());
  }, []);

  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      if (customEvent.detail && customEvent.detail.message) {
        setValue("message", customEvent.detail.message);
        
        const el = document.getElementById("kontakt");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("prefill-contact-form", handlePrefill);
    return () => {
      window.removeEventListener("prefill-contact-form", handlePrefill);
    };
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    
    if (siteKey && !turnstileToken) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Client-side quick check: if submitted under 3 seconds, trigger decoy success instantly
    if (mountedAt && Date.now() - mountedAt < 3000) {
      console.warn("🛡️ Honeypot triggered: Submitted too quickly.");
      setTimeout(() => {
        setStatus("success");
        reset();
        setTurnstileToken("");
      }, 2000); // Simulate network delay
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          form_submitted_at: mountedAt,
          turnstileToken,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
      setTurnstileToken("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={`section ${styles.contact}`} id="kontakt">
      <div className="container">
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left: Info */}
          <div className={styles.info}>
            <div className="section-label">{t("heading")}</div>
            <h2 className="section-heading">{t("heading")}</h2>
            <p className={styles.subheading}>{t("subheading")}</p>

            <div className={styles.generalBlock}>
              <p className={styles.contactRole}>{ti("general")}</p>
              <a href={`mailto:${ti("general_email")}`} className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span>{ti("general_email")}</span>
              </a>
            </div>

            <div className={styles.teamSection}>
              <h3 className={styles.teamHeading}>{ti("team_heading")}</h3>
              <div className={styles.membersGrid}>
                {members.map((member, idx) => (
                  <div key={idx} className={styles.memberCard}>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.memberRole}>{member.role}</span>
                    </div>
                    <div className={styles.memberContacts}>
                      <a href={`tel:${member.phone.replace(/\s/g, "")}`} className={styles.memberContactItem}>
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={styles.memberIcon}>
                          <path d="M6 2H3C2.4 2 2 2.4 2 3c0 8.3 6.7 15 15 15 .6 0 1-.4 1-1v-3l-4.5-1.5-1.1 2.2C9.7 13 5 8.3 3.3 5.6L5.5 4.5 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {member.phone}
                      </a>
                      <a href={`mailto:${member.email}`} className={styles.memberContactItem}>
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={styles.memberIcon}>
                          <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M2 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {member.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className={styles.formWrapper}>
            <form
              className={`glass-card ${styles.form}`}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">{tf("name")} *</label>
                  <input
                    id="name"
                    className={`form-input ${errors.name ? styles.inputError : ""}`}
                    type="text"
                    placeholder={tf("placeholder_name")}
                    {...register("name", { required: true })}
                    aria-invalid={!!errors.name}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="company">{tf("company")}</label>
                  <input
                    id="company"
                    className="form-input"
                    type="text"
                    placeholder={tf("placeholder_company")}
                    {...register("company")}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">{tf("email")} *</label>
                  <input
                    id="email"
                    className={`form-input ${errors.email ? styles.inputError : ""}`}
                    type="email"
                    placeholder={tf("placeholder_email")}
                    {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                    aria-invalid={!!errors.email}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">{tf("phone")}</label>
                  <input
                    id="phone"
                    className="form-input"
                    type="tel"
                    placeholder={tf("placeholder_phone")}
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">{tf("message")} *</label>
                <textarea
                  id="message"
                  className={`form-textarea ${errors.message ? styles.inputError : ""}`}
                  placeholder={tf("placeholder_message")}
                  {...register("message", { required: true })}
                  aria-invalid={!!errors.message}
                />
              </div>

              {/* Decoy field for spam bot protection */}
              <div className={styles.decoyField} aria-hidden="true">
                <label htmlFor="fax_number">Fax Number</label>
                <input
                  id="fax_number"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("fax_number")}
                />
              </div>

              {status === "success" && (
                <div className={styles.successMsg} role="status">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {tf("success")}
                </div>
              )}

              {status === "error" && (
                <div className={styles.errorMsg} role="alert">
                  {tf("error")}
                </div>
              )}

              {/* Cloudflare Turnstile Widget */}
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken("")}
                    onExpire={() => setTurnstileToken("")}
                  />
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                disabled={status === "loading" || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
                id="contact-submit"
              >
                {status === "loading" ? (
                  <span className={styles.spinner} aria-label="Odesílání..." />
                ) : (
                  <>
                    {tf("send")}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
