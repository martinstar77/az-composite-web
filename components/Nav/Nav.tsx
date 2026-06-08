"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./Nav.module.css";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect current locale from pathname
  const currentLocale = pathname.startsWith("/en") ? "en" : "cs";
  const otherLocale = currentLocale === "cs" ? "en" : "cs";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { href: "#reseni", label: t("solution") },
    { href: "#inovace", label: t("innovation") },
    { href: "#portfolio", label: t("portfolio") },
    { href: "#kontakt", label: t("contact") },
  ];

  const switchLocale = () => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${otherLocale}`);
    router.push(newPath);
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href={`/${currentLocale}`} className={styles.logo} aria-label="AZComposite — domovská stránka">
            <Image
              src="/images/logo.png"
              alt="AZComposite"
              width={160}
              height={44}
              priority
              style={{ height: "36px", width: "auto" }}
              className={styles.logoImg}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.links} aria-label="Hlavní navigace">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side: Locale switcher + CTA */}
          <div className={styles.actions}>
            <button
              className={styles.localeSwitcher}
              onClick={switchLocale}
              aria-label={`Switch to ${otherLocale.toUpperCase()}`}
            >
              {otherLocale.toUpperCase()}
            </button>
            <a href="#kontakt" className="btn btn-primary">
              {t("cta")}
            </a>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
        id="mobile-menu"
      >
        <nav className={styles.mobileLinks} aria-label="Mobilní navigace">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className={styles.mobileDivider} />
          <button className={styles.mobileLocale} onClick={switchLocale}>
            {otherLocale === "en" ? "🇬🇧 English" : "🇨🇿 Česky"}
          </button>
          <a
            href="#kontakt"
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={() => setMenuOpen(false)}
          >
            {t("cta")}
          </a>
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
