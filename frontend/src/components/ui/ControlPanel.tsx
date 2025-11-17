import "../../styles/ControlPanel.css";

interface ColorOption {
  id: string;
  name: string;
  color: string;
}

interface ControlPanelProps {
  isPowerOn: boolean;
  speed: number;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  speedLabel?: string;
  disabled?: boolean;
  // Color options for LightDevice
  colorOptions?: ColorOption[];
  selectedColorTemp?: string;
  onColorChange?: (colorId: string) => void;
}

export const ControlPanel = ({
  isPowerOn,
  speed,
  onTogglePower,
  onSpeedChange,
  speedLabel = "Speed",
  disabled = false,
  colorOptions,
  selectedColorTemp,
  onColorChange,
}: ControlPanelProps) => {
  const showColorOptions = colorOptions && colorOptions.length > 0;

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

      {showColorOptions && (
        <div className="color-temperature-section">
          <span className="control-label">Color Temperature</span>
          <div className="color-options">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                className={`color-option ${
                  selectedColorTemp === color.id ? "active" : ""
                } ${!isPowerOn ? "disabled" : ""}`}
                style={{ backgroundColor: color.color }}
                onClick={() => isPowerOn && onColorChange?.(color.id)}
                disabled={!isPowerOn}
                title={color.name}
                aria-label={`Set color to ${color.name}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="control-row">
        <span className="control-label">{speedLabel}</span>
        <span className="speed-value">{speed}%</span>
      </div>
      <input
        type="range"
        className={`speed-slider ${disabled ? "disabled" : ""}`}
        min="0"
        max="100"
        value={speed}
        onChange={onSpeedChange}
        disabled={disabled}
        style={{ "--slider-value": `${speed}%` } as React.CSSProperties}
      />
    </div>
  );
};
