"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import styles from "./Contact.module.css";

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

export default function Contact() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const ti = useTranslations("contact.info");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
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

            <div className={styles.contactDetails}>
              <p className={styles.contactRole}>{ti("general")}</p>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 15c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span>{ti("name")}</span>
              </div>

              <a href={`tel:${ti("phone").replace(/\s/g, "")}`} className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M6 2H3C2.4 2 2 2.4 2 3c0 8.3 6.7 15 15 15 .6 0 1-.4 1-1v-3l-4.5-1.5-1.1 2.2C9.7 13 5 8.3 3.3 5.6L5.5 4.5 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{ti("phone")}</span>
              </a>

              <a href={`mailto:${ti("email")}`} className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span>{ti("email")}</span>
              </a>
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

              <button
                type="submit"
                className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                disabled={status === "loading"}
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
