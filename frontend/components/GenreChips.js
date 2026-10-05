"use client";

import styles from "./GenreChips.module.css";

const popular = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Sci-Fi", "Slice of Life"];

export default function GenreChips({ genres, activeGenre, onPick }) {
  function findId(name) {
    for (let i = 0; i < (genres || []).length; i++) {
      if (genres[i].name === name) {
        return String(genres[i].id);
      }
    }
    return "";
  }

  return (
    <div className={styles.row}>
      <button
        className={!activeGenre ? styles.chip + " " + styles.on : styles.chip}
        onClick={function () { onPick(""); }}
      >
        All
      </button>
      {popular.map(function (name) {
        const id = findId(name);
        const isOn = activeGenre === id && id !== "";
        return (
          <button
            key={name}
            className={isOn ? styles.chip + " " + styles.on : styles.chip}
            onClick={function () { onPick(id); }}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
