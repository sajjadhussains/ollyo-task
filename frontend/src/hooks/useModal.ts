import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const openModal = () => setIsOpen(true);
  
  const closeModal = () => {
    setIsOpen(false);
    setInputValue("");
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return {
    isOpen,
    inputValue,
    openModal,
    closeModal,
    handleInputChange,
  };
};
