import { ControlPanel } from "../ui/ControlPanel";
import "../../styles/Fan.css";

interface FanDeviceProps {
  label: string;
  isPowerOn: boolean;
  speed: number;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FanDevice = ({
  label,
  isPowerOn,
  speed,
  onTogglePower,
  onSpeedChange,
}: FanDeviceProps) => {
  const rotationSpeed = isPowerOn && speed > 0 ? 3 - (speed / 100) * 2.8 : 0;

  return (
    <div className="fan-container">
      <div className="fan-visual">
        <div
          className="fan-blades"
          style={
            {
              "--rotation-speed": `${rotationSpeed}s`,
              "--animation-state": isPowerOn ? "running" : "paused",
            } as React.CSSProperties
          }
        >
          <div className="fan-wing fan-wing-1"></div>
          <div className="fan-wing fan-wing-2"></div>
          <div className="fan-wing fan-wing-3"></div>
          <div className="fan-wing fan-wing-4"></div>
        </div>
        <div className="fan-center">
          <div className="fan-center-inner"></div>
        </div>
      </div>
      <div className="fan-label">{label}</div>

      <ControlPanel
        isPowerOn={isPowerOn}
        speed={speed}
        onTogglePower={onTogglePower}
        onSpeedChange={onSpeedChange}
        speedLabel="Speed"
      />
    </div>
  );
};
