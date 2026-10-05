"use client";

import { useState } from "react";
import styles from "./FilterPanel.module.css";

const typeOptions = ["", "tv", "movie", "ova", "special", "ona"];
const statusOptions = ["", "airing", "complete", "upcoming"];
const sortOptions = [
  { v: "", label: "Default" },
  { v: "popularity", label: "Popularity" },
  { v: "score", label: "Score" },
  { v: "start_date", label: "Newest" },
  { v: "title", label: "Title" }
];

export default function FilterPanel({ filters, genres, onUpdate, onReset }) {
  const [open, setOpen] = useState(false);

  function setField(name, val) {
    const copy = { ...filters };
    copy[name] = val;
    onUpdate(copy);
  }

  const body = (
    <div className={styles.fields}>
      <label className={styles.field}>
        <span>Genre</span>
        <select value={filters.genre || ""} onChange={function (e) { setField("genre", e.target.value); }}>
          <option value="">All genres</option>
          {(genres || []).map(function (g) {
            return <option key={g.id} value={String(g.id)}>{g.name}</option>;
          })}
        </select>
      </label>
      <label className={styles.field}>
        <span>Type</span>
        <select value={filters.type || ""} onChange={function (e) { setField("type", e.target.value); }}>
          {typeOptions.map(function (t) {
            return <option key={t} value={t}>{t === "" ? "All types" : t.toUpperCase()}</option>;
          })}
        </select>
      </label>
      <label className={styles.field}>
        <span>Status</span>
        <select value={filters.status || ""} onChange={function (e) { setField("status", e.target.value); }}>
          {statusOptions.map(function (s) {
            return <option key={s} value={s}>{s === "" ? "Any status" : s}</option>;
          })}
        </select>
      </label>
      <label className={styles.field}>
        <span>Min score: {filters.minScore || "0"}</span>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={filters.minScore || 0}
          onChange={function (e) { setField("minScore", e.target.value); }}
        />
      </label>
      <label className={styles.field}>
        <span>Sort by</span>
        <select value={filters.orderBy || ""} onChange={function (e) { setField("orderBy", e.target.value); }}>
          {sortOptions.map(function (o) {
            return <option key={o.v} value={o.v}>{o.label}</option>;
          })}
        </select>
      </label>
      <div className={styles.row}>
        <button
          className={styles.toggle}
          onClick={function () {
            const next = filters.sort === "asc" ? "desc" : "asc";
            setField("sort", next);
          }}
          aria-label="Toggle sort direction"
        >
          {filters.sort === "asc" ? "Asc ↑" : "Desc ↓"}
        </button>
        <button className={styles.reset} onClick={onReset}>Reset</button>
      </div>
    </div>
  );

  return (
    <div className={styles.panel}>
      <button className={styles.mobileBtn} onClick={function () { setOpen(!open); }}>
        {open ? "Hide filters" : "Show filters"}
      </button>
      <div className={open ? styles.show : styles.hide}>
        {body}
      </div>
      <div className={styles.desktop}>
        {body}
      </div>
    </div>
  );
}
