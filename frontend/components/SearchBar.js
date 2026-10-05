"use client";

import { useEffect, useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange }) {
  const [querry, setQuerry] = useState(value || "");

  useEffect(function () {
    setQuerry(value || "");
  }, [value]);

  useEffect(function () {
    const t = setTimeout(function () {
      if (querry !== (value || "")) {
        onChange(querry);
      }
    }, 400);
    return function () {
      clearTimeout(t);
    };
  }, [querry, value, onChange]);

  function handleClick() {
    setQuerry("");
    onChange("");
  }

  return (
    <div className={styles.row}>
      <div className={styles.wrap}>
        <svg className={styles.icon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          className={styles.input}
          value={querry}
          placeholder="Search anime..."
          onChange={function (e) {
            setQuerry(e.target.value);
          }}
          aria-label="Search anime"
        />
        {querry ? (
          <button className={styles.clear} onClick={handleClick} aria-label="Clear search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : null}
      </div>
      <button className={styles.go} onClick={function () { onChange(querry); }} aria-label="Search">
        GO!
      </button>
    </div>
  );
}
