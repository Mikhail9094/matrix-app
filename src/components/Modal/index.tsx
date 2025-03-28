import { useEffect, useCallback } from "react";
import styles from "./styles.module.scss";
import { ModalProps } from "./types";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  title,
  onClose,
  children,
  closeOnOverlayClick = true,
  disablePortal,
}: ModalProps) {
  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const render = () => (
    <div
      className={`${styles.modal} ${isOpen ? styles.open : styles.close}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        <header className={styles.modal__header}>
          {title && <h2 className={styles.modal__title}>{title}</h2>}
          <button className={styles.modal__closeButton} onClick={onClose}>
            ×
          </button>
        </header>
        <main className={styles.modal__body}>{children}</main>
      </div>
    </div>
  );
  if (disablePortal) return render();

  const root = document.getElementById("root");
  if (!root) return null;

  return createPortal(render(), root);
}
