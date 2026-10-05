import styles from "./EmptyState.module.css";

export default function EmptyState({ onClear }) {
  return (
    <div className={styles.box}>
      <div className={styles.face}>{"( . .)"}</div>
      <h3>No anime found</h3>
      <p>Try a different search or loosen your filters a little.</p>
      {onClear ? (
        <button className={styles.btn} onClick={onClear}>Clear filters</button>
      ) : null}
    </div>
  );
}
