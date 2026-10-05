import styles from "./ErrorBox.module.css";

export default function ErrorBox({ message, onRetry }) {
  return (
    <div className={styles.box}>
      <p className={styles.title}>Something went wrong</p>
      <p className={styles.msg}>{message || "Failed to load data"}</p>
      <button className={styles.btn} onClick={onRetry}>Try again</button>
    </div>
  );
}
