import "../../styles/Toast.css";

interface ToastProps {
  isVisible: boolean;
  message: string;
}

export const Toast = ({ isVisible, message }: ToastProps) => {
  if (!isVisible) return null;

  return (
    <div className="success-toast">
      <div className="success-icon">✓</div>
      <span className="success-text">{message}</span>
    </div>
  );
};
