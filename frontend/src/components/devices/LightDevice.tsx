import { useState } from 'react';
import { ControlPanel } from "../ui/ControlPanel";
import lightImageOff from "../../assets/images/light.png";
import lightImageOn from "../../assets/images/light-on.png";
import "../../styles/Light.css";

const COLOR_OPTIONS = [
  { id: 'warm', name: 'Warm', color: '#FFB74D' },
  { id: 'cool', name: 'Cool', color: '#4FC3F7' },
  { id: 'daylight', name: 'Daylight', color: '#FFF176' },
  { id: 'red', name: 'Red', color: '#E57373' },
  { id: 'green', name: 'Green', color: '#81C784' },
  { id: 'blue', name: 'Blue', color: '#64B5F6' },
];

interface LightDeviceProps {
  label: string;
  isPowerOn: boolean;
  speed: number;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange?: (color: string) => void;
}

export const LightDevice = ({
  label,
  isPowerOn,
  speed,
  onTogglePower,
  onSpeedChange,
  onColorChange,
}: LightDeviceProps) => {
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  
  // Show lightImageOn when power is on, lightImageOff when power is off
  const lightImage = isPowerOn ? lightImageOn : lightImageOff;

  // Calculate brightness and glow based on speed and selected color (only when power is on and speed > 0)
  const brightness = isPowerOn && speed > 0 ? 0.5 + (speed / 100) * 0.7 : 0.5;
  const glowIntensity = isPowerOn && speed > 0 ? (speed / 100) * 0.8 : 0;
  const glowSize = isPowerOn && speed > 0 ? 20 + (speed / 100) * 40 : 0;
  
  // Apply the selected color to the glow effect
  const glowColor = isPowerOn ? selectedColor.color : '#FFD700'; // Default to gold when off

  const handleColorChange = (color: typeof COLOR_OPTIONS[0]) => {
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
            filter: `brightness(${brightness}) drop-shadow(0 0 ${glowSize}px ${glowColor}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')})`,
            transition: 'filter 0.3s ease'
          }}
        />
      </div>
      <div className="light-label">{label}</div>

      <div className="color-options">
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color.id}
            className={`color-option ${selectedColor.id === color.id ? 'active' : ''} ${!isPowerOn ? 'disabled' : ''}`}
            style={{ backgroundColor: color.color }}
            onClick={() => isPowerOn && handleColorChange(color)}
            disabled={!isPowerOn}
            title={color.name}
            aria-label={`Set color to ${color.name}`}
          />
        ))}
      </div>
      <ControlPanel
        isPowerOn={isPowerOn}
        speed={speed}
        onTogglePower={onTogglePower}
        onSpeedChange={onSpeedChange}
        speedLabel="Brightness"
        disabled={!isPowerOn}
      />
    </div>
  );
};
