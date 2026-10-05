"use client";

import { useFavorites } from "../context/FavoritesContext";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ anime }) {
  const ctx = useFavorites();
  if (!ctx) {
    return null;
  }
  const fav = ctx.isFavorite(anime.id);

  async function onSearchClick() {
    if (fav) {
      await ctx.removeFavorite(anime.id);
    } else {
      await ctx.addFavorite({
        id: anime.id,
        title: anime.title,
        image: anime.image,
        score: anime.score,
        type: anime.type,
        year: anime.year
      });
    }
  }

  return (
    <button
      onClick={function (e) {
        e.preventDefault();
        e.stopPropagation();
        onSearchClick();
      }}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      className={fav ? styles.btn + " " + styles.fav : styles.btn}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
