import styles from "./Loader.module.css";
import Image from "next/image";
export default function Loader({
  size = "small",
}: {
  size?: "small" | "large";
}) {
  return (
    <span
      className={`${styles.loader} ${size === "large" ? styles.loaderLarge : ""}`}
      role="status"
      aria-label="Завантаження"
    >
      <span className={`${styles.stroke} ${styles.stroke1}`} />
      <span className={`${styles.stroke} ${styles.stroke2}`} />
      <span className={`${styles.stroke} ${styles.stroke3}`} />
      <Image
        src="/loader/pen.svg"
        alt=""
        width={42}
        height={42}
        className={styles.pen}
        priority
      />
    </span>
  );
}
