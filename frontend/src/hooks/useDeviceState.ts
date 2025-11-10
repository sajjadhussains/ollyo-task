import { useState } from "react";

export const useDeviceState = () => {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [speed, setSpeed] = useState(0);

  const togglePower = () => {
    setIsPowerOn(!isPowerOn);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  const resetState = () => {
    setIsPowerOn(false);
    setSpeed(0);
  };

  return {
    isPowerOn,
    speed,
    togglePower,
    handleSpeedChange,
    resetState,
  };
};
