import { ControlPanel } from "../ui/ControlPanel";
import lightImage from "../../assets/images/light.png";
import "../../styles/Light.css";

interface LightDeviceProps {
  label: string;
  isPowerOn: boolean;
  speed: number;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const LightDevice = ({
  label,
  isPowerOn,
  speed,
  onTogglePower,
  onSpeedChange,
  onRemove,
}: LightDeviceProps) => {
  return (
    <div className="light-container">
      <button className="remove-btn" onClick={onRemove}>
        ×
      </button>
      <div className="light-visual">
        <img
          src={lightImage}
          alt="Light"
          className={`light-image ${isPowerOn ? "active" : ""}`}
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
