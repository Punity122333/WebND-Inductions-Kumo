"use client";

import Link from "next/link";
import styles from "./RecommendationList.module.css";

export default function RecommendationList({ items }) {
  const list = items || [];
  if (list.length === 0) {
    return null;
  }
  return (
    <div className={styles.box}>
      <h2 className={styles.h}>You may also like</h2>
      <div className={styles.row}>
        {list.map(function (r) {
          return (
            <Link key={r.id} href={"/anime/" + r.id} className={styles.card}>
              {r.image ? (
                <img src={r.image} alt={r.title} className={styles.img} loading="lazy" />
              ) : (
                <img src="/placeholder.png" alt={r.title} className={styles.img} loading="lazy" />
              )}
              <p className={styles.name}>{r.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
