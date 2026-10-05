import styles from "./CharacterList.module.css";

export default function CharacterList({ items }) {
  const list = items || [];
  if (list.length === 0) {
    return null;
  }
  return (
    <div className={styles.box}>
      <h2 className={styles.h}>Characters</h2>
      <div className={styles.row}>
        {list.map(function (c, i) {
          return (
            <div key={c.name + i} className={styles.card}>
              {c.image ? (
                <img src={c.image} alt={c.name} className={styles.img} loading="lazy" />
              ) : (
                <img src="/placeholder.png" alt={c.name} className={styles.img} loading="lazy" />
              )}
              <p className={styles.name}>{c.name}</p>
              <p className={styles.role}>{c.role || ""}</p>
              {c.voiceActor ? (
                <p className={styles.va}>{c.voiceActor}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
