import "../../styles/ControlPanel.css";

interface ControlPanelProps {
  isPowerOn: boolean;
  speed: number;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  speedLabel?: string;
}

export const ControlPanel = ({
  isPowerOn,
  speed,
  onTogglePower,
  onSpeedChange,
  speedLabel = "Speed",
}: ControlPanelProps) => {
  return (
    <div className="control-panel">
      <div className="control-row">
        <span className="control-label">Power</span>
        <div
          className={`toggle-switch ${isPowerOn ? "active" : ""}`}
          onClick={onTogglePower}
        >
          <div className="toggle-slider"></div>
        </div>
      </div>
      <div className="control-row">
        <span className="control-label">{speedLabel}</span>
        <span className="speed-value">{speed}%</span>
      </div>
      <input
        type="range"
        className="speed-slider"
        min="0"
        max="100"
        value={speed}
        onChange={onSpeedChange}
      />
    </div>
  );
};
