import { useState } from "react";
import { DEVICE_TYPES } from "../constants/devices";

export interface DeviceSettings {
  power: boolean;
  // For Fan
  speed?: number;
  // For Light
  brightness?: number;
  colorTemp?: string;
}

export const useDeviceState = (initialSettings?: DeviceSettings) => {
  const defaultSettings: DeviceSettings = {
    power: false,
    speed: 0,
    brightness: 50,
    colorTemp: 'warm',
  };

  const [settings, setSettings] = useState<DeviceSettings>(
    initialSettings || defaultSettings
  );

  const togglePower = () => {
    setSettings((prev) => ({ ...prev, power: !prev.power }));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, speed: Number(e.target.value) }));
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, brightness: Number(e.target.value) }));
  };

  const handleColorTempChange = (colorTemp: string) => {
    setSettings((prev) => ({ ...prev, colorTemp }));
  };

  const updateSettings = (newSettings: Partial<DeviceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetState = () => {
    setSettings(defaultSettings);
  };

  // For backward compatibility
  const isPowerOn = settings.power;
  const speed = settings.speed ?? 0;
  const brightness = settings.brightness ?? 50;
  const colorTemp = settings.colorTemp ?? 'warm';

  return {
    settings,
    isPowerOn,
    speed,
    brightness,
    colorTemp,
    togglePower,
    handleSpeedChange,
    handleBrightnessChange,
    handleColorTempChange,
    updateSettings,
    resetState,
  };
};
