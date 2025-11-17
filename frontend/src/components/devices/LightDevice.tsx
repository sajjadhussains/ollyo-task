import { useState } from "react";
import * as React from "react";
import { ControlPanel } from "../ui/ControlPanel";
import lightImageOff from "../../assets/images/light.png";
import lightImageOn from "../../assets/images/light-on.png";
import "../../styles/Light.css";

const COLOR_OPTIONS = [
  { id: "warm", name: "Warm", color: " #FFE5B4" },
  { id: "neutral", name: "neutral", color: "#F0F8FF" },
  { id: "cool", name: "cool", color: "#87CEEB" },
  { id: "pink", name: "pink", color: "#FFB6C1" },
];

interface LightDeviceProps {
  label: string;
  isPowerOn: boolean;
  speed: number;
  brightness?: number;
  colorTemp?: string;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange?: (color: string) => void;
}

export const LightDevice = ({
  // label,
  isPowerOn,
  speed,
  brightness: propBrightness,
  colorTemp: propColorTemp,
  onTogglePower,
  onSpeedChange,
  onColorChange,
}: LightDeviceProps) => {
  // Use prop values if provided, otherwise use speed for brightness
  const brightnessValue = propBrightness ?? speed;
  const colorTempValue = propColorTemp ?? "warm";

  // Find selected color from prop or default to warm
  const initialColor =
    COLOR_OPTIONS.find((c) => c.id === colorTempValue) || COLOR_OPTIONS[0];
  const [selectedColor, setSelectedColor] = useState(initialColor);

  // Update selected color when prop changes
  React.useEffect(() => {
    const color = COLOR_OPTIONS.find((c) => c.id === colorTempValue);
    if (color) {
      setSelectedColor(color);
    }
  }, [colorTempValue]);

  // Show lightImageOn when power is on, lightImageOff when power is off
  const lightImage = isPowerOn ? lightImageOn : lightImageOff;

  // Calculate brightness and glow based on brightnessValue and selected color (only when power is on and brightnessValue > 0)
  const brightness =
    isPowerOn && brightnessValue > 0
      ? 0.5 + (brightnessValue / 100) * 0.7
      : 0.5;
  const glowIntensity =
    isPowerOn && brightnessValue > 0 ? (brightnessValue / 100) * 0.8 : 0;
  const glowSize =
    isPowerOn && brightnessValue > 0 ? 20 + (brightnessValue / 100) * 40 : 0;

  // Apply the selected color to the glow effect
  const glowColor = isPowerOn ? selectedColor.color : "#FFD700"; // Default to gold when off

  const handleColorChange = (color: (typeof COLOR_OPTIONS)[0]) => {
    setSelectedColor(color);
    if (onColorChange) {
      onColorChange(color.id);
    }
  };

  return (
    <div className="light-container">
      <div className="light-visual">
        <img
          src={lightImage}
          alt="Light"
          className="light-image"
          style={{
            filter: `brightness(${brightness}) drop-shadow(0 0 ${glowSize}px ${glowColor}${Math.floor(
              glowIntensity * 255
            )
              .toString(16)
              .padStart(2, "0")})`,
            transition: "filter 0.3s ease",
          }}
        />
      </div>
      {/* <div className="light-label">{label}</div> */}

      <ControlPanel
        isPowerOn={isPowerOn}
        speed={brightnessValue}
        onTogglePower={onTogglePower}
        onSpeedChange={onSpeedChange}
        speedLabel="Brightness"
        disabled={!isPowerOn}
        colorOptions={COLOR_OPTIONS}
        selectedColorTemp={colorTempValue}
        onColorChange={(colorId) => {
          const color = COLOR_OPTIONS.find((c) => c.id === colorId);
          if (color) {
            handleColorChange(color);
          }
        }}
      />
    </div>
  );
};
