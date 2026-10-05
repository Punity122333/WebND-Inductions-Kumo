"use client";

import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import styles from "./DetailHero.module.css";

export default function DetailHero({ anime }) {
  const img = anime.image || "/placeholder.png";
  const stats = [
    { k: "Score", v: anime.score ? anime.score + (anime.scoredBy ? " (" + anime.scoredBy + ")" : "") : "?" },
    { k: "Rank", v: anime.rank ? "#" + anime.rank : "?" },
    { k: "Episodes", v: anime.episodes || "?" },
    { k: "Status", v: anime.status || "?" }
  ];

  return (
    <div className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.poster}>
        {anime.image ? (
          <Image src={anime.image} alt={anime.title} width={280} height={420} className={styles.img} priority />
        ) : (
          <img src={img} alt={anime.title} className={styles.img} />
        )}
      </div>
      <div className={styles.body}>
        <h1 className={styles.title}>{anime.title}</h1>
        {anime.titleEnglish && anime.titleEnglish !== anime.title ? (
          <p className={styles.sub}>{anime.titleEnglish}</p>
        ) : null}
        {anime.titleJapanese ? (
          <p className={styles.sub2}>{anime.titleJapanese}</p>
        ) : null}
        <div className={styles.tags}>
          {(anime.genres || []).map(function (g) {
            return <span key={g} className={styles.tag}>{g}</span>;
          })}
          {(anime.themes || []).map(function (t) {
            return <span key={t} className={styles.tag2}>{t}</span>;
          })}
        </div>
        <div className={styles.stats}>
          {stats.map(function (s) {
            return (
              <div key={s.k} className={styles.stat}>
                <span className={styles.k}>{s.k}</span>
                <span className={styles.v}>{s.v}</span>
              </div>
            );
          })}
        </div>
        <p className={styles.meta}>
          {[anime.type, anime.year, anime.season, anime.studios ? anime.studios.join(", ") : ""].filter(Boolean).join(" · ")}
        </p>
        <div className={styles.actions}>
          <FavoriteButton anime={{ id: anime.id, title: anime.title, image: anime.image, score: anime.score, type: anime.type, year: anime.year }} />
          <span className={styles.hint}>Save to favorites</span>
        </div>
      </div>
    </div>
  );
}
