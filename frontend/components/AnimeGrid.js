import AnimeCard from "./AnimeCard";
import styles from "./AnimeGrid.module.css";

export default function AnimeGrid({ items }) {
  return (
    <div className={styles.grid}>
      {(items || []).map(function (a, i) {
        return <AnimeCard key={a.id} anime={a} index={i} />;
      })}
    </div>
  );
}
