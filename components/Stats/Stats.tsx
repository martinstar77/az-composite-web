"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import styles from "./Stats.module.css";

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

function StatItem({ label, value, isNumber, numVal }: {
  label: string;
  value: string;
  isNumber: boolean;
  numVal: number;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(numVal, 1200, visible && isNumber);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.statItem}>
      <div className={styles.statValue}>
        {isNumber && visible ? `${count}+` : value}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Stats() {
  const t = useTranslations("stats");

  const items = [
    { key: "categories", value: t("categories.value"), label: t("categories.label"), isNumber: false, numVal: 0 },
    { key: "rd", value: t("rd.value"), label: t("rd.label"), isNumber: false, numVal: 0 },
    { key: "origin", value: t("origin.value"), label: t("origin.label"), isNumber: false, numVal: 0 },
    { key: "logistics", value: t("logistics.value"), label: t("logistics.label"), isNumber: false, numVal: 0 },
  ];

  return (
    <section className={styles.stats}>
      <div className={`container ${styles.grid}`}>
        {items.map((item, i) => (
          <StatItem key={item.key} value={item.value} label={item.label} isNumber={item.isNumber} numVal={item.numVal} index={i} />
        ))}
      </div>
    </section>
  );
}
