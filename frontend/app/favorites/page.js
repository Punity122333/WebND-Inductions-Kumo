"use client";

import { useFavorites } from "../../context/FavoritesContext";
import AnimeGrid from "../../components/AnimeGrid";
import { SkeletonGrid } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import styles from "./favorites.module.css";

export default function FavoritesPage() {
  const ctx = useFavorites();

  if (!ctx || !ctx.loaded) {
    return (
      <div className="page">
        <h1 className={styles.title}>Favorites</h1>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  const result = ctx.favorites || [];

  return (
    <div className="page">
      <h1 className={styles.title}>Favorites</h1>
      <p className={styles.sub}>{result.length === 0 ? "Nothing saved yet." : result.length + " saved"}</p>
      {result.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimeGrid items={result} />
      )}
    </div>
  );
}
