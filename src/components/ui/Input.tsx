import type { InputHTMLAttributes, ReactElement } from "react";
import { cx } from "@/utils/cx";
import styles from "./Input.module.css";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...rest }: Props): ReactElement {
  return (
    <div className={cx(styles.field, error && styles.error)}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={cx(styles.input, className)} {...rest} />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
