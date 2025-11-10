import { ControlPanel } from "../ui/ControlPanel";
import lightImageOff from "../../assets/images/light.png";
import lightImageOn from "../../assets/images/light-on.png";
import "../../styles/Light.css";

interface LightDeviceProps {
  label: string;
  isPowerOn: boolean;
  speed: number;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LightDevice = ({
  label,
  isPowerOn,
  speed,
  onTogglePower,
  onSpeedChange,
}: LightDeviceProps) => {
  // Show lightImageOn when power is on, lightImageOff when power is off
  const lightImage = isPowerOn ? lightImageOn : lightImageOff;
  
  // Calculate brightness and glow based on speed (only when power is on and speed > 0)
  const brightness = isPowerOn && speed > 0 ? 0.5 + (speed / 100) * 0.7 : 0.5;
  const glowIntensity = isPowerOn && speed > 0 ? (speed / 100) * 0.8 : 0;
  const glowSize = isPowerOn && speed > 0 ? 20 + (speed / 100) * 40 : 0;

  return (
    <div className="light-container">
      <div className="light-visual">
        <img
          src={lightImage}
          alt="Light"
          className="light-image"
          style={{
            filter: `brightness(${brightness}) drop-shadow(0 0 ${glowSize}px rgba(255, 215, 0, ${glowIntensity}))`,
          }}
        />
      </div>
      <div className="light-label">{label}</div>

      <ControlPanel
        isPowerOn={isPowerOn}
        speed={speed}
        onTogglePower={onTogglePower}
        onSpeedChange={onSpeedChange}
        speedLabel="Brightness"
      />
    </div>
  );
};
