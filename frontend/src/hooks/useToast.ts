import { useState, useCallback } from "react";

export const useToast = (duration: number = 3000) => {
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback(() => {
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), duration);
  }, [duration]);

  const hideToast = () => setIsVisible(false);

  return {
    isVisible,
    showToast,
    hideToast,
  };
};
