import React from "react";
import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className={styles.pyramidLoader}>
        <div className={styles.wrapper}>
          <span className={`${styles.side} ${styles.side1}`} />
          <span className={`${styles.side} ${styles.side2}`} />
          <span className={`${styles.side} ${styles.side3}`} />
          <span className={`${styles.side} ${styles.side4}`} />
          <span className={styles.shadow} />
        </div>
      </div>
    </div>
  );
}