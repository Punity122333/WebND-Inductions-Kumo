import styles from "./TrailerEmbed.module.css";

export default function TrailerEmbed({ url }) {
  if (!url) {
    return null;
  }
  return (
    <div className={styles.box}>
      <h2 className={styles.h}>Trailer</h2>
      <div className={styles.frame}>
        <iframe
          src={url}
          title="Anime trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
