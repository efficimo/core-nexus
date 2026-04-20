import type { ReactElement } from "react";
import styles from "./Footer.module.css";

export function Footer(): ReactElement {
  return (
    <footer className={styles.footer}>
      <span className={styles.motto}>Tenir la Ligne Zéro. Corriger l'irréparable.</span>
      <span className={styles.build}>build {__APP_VERSION__}</span>
    </footer>
  );
}
