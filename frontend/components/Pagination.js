"use client";

import styles from "./Pagination.module.css";

export default function Pagination({ page, lastPage, onChange }) {
  const pageNum = Number(page) || 1;
  const total = Number(lastPage) || 1;

  function go(p) {
    if (p < 1 || p > total || p === pageNum) {
      return;
    }
    onChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pagess() {
    const out = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        out.push(i);
      }
      return out;
    }
    out.push(1);
    if (pageNum > 3) {
      out.push("...");
    }
    for (let i = pageNum - 1; i <= pageNum + 1; i++) {
      if (i > 1 && i < total) {
        out.push(i);
      }
    }
    if (pageNum < total - 2) {
      out.push("...");
    }
    out.push(total);
    return out;
  }

  const list = pagess();

  return (
    <div className={styles.wrap}>
      <button className={styles.btn} disabled={pageNum <= 1} onClick={function () { go(pageNum - 1); }} aria-label="Previous page">
        {"< Prev"}
      </button>
      <div className={styles.nums}>
        {list.map(function (p, i) {
          if (p === "...") {
            return <span key={"e" + i} className={styles.dots}>...</span>;
          }
          return (
            <button
              key={p}
              onClick={function () { go(p); }}
              className={p === pageNum ? styles.num + " " + styles.on : styles.num}
            >
              {p}
            </button>
          );
        })}
      </div>
      <button className={styles.btn} disabled={pageNum >= total} onClick={function () { go(pageNum + 1); }} aria-label="Next page">
        {"Next >"}
      </button>
    </div>
  );
}
