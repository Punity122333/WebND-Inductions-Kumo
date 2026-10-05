import styles from "./Skeleton.module.css";

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.poster} />
      <div className={styles.line} />
      <div className={styles.lineShort} />
    </div>
  );
}

export function SkeletonGrid({ count }) {
  const n = count || 12;
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(i);
  }
  return (
    <div>
      <div aria-hidden="true" className="sfx">ゴゴゴ</div>
      <div className={styles.grid}>
        {arr.map(function (k) {
          return <SkeletonCard key={k} />;
        })}
      </div>
    </div>
  );
}
