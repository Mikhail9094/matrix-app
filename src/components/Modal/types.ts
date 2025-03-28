import { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  closeOnOverlayClick?: boolean;
  disablePortal?: boolean;
}
