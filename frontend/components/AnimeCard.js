"use client";

import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import styles from "./AnimeCard.module.css";

export default function AnimeCard({ anime, index }) {
  const img = anime.image || "/placeholder.png";
  const delay = (index % 12) * 40;

  return (
    <Link
      href={"/anime/" + anime.id}
      className={styles.card}
      style={{ animationDelay: delay + "ms" }}
    >
      <div className={styles.poster}>
        {anime.image ? (
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 20vw"
            className={styles.img}
            onError={function (e) {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        ) : (
          <img src="/placeholder.png" alt={anime.title} className={styles.img} />
        )}
        {anime.score ? (
          <span className={styles.score}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
            </svg>
            {anime.score}
          </span>
        ) : null}
        <span className={styles.heart}>
          <FavoriteButton anime={anime} />
        </span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{anime.title}</h3>
        <p className={styles.meta}>
          {[anime.type, anime.year].filter(Boolean).join(" · ") || "Anime"}
        </p>
      </div>
    </Link>
  );
}
