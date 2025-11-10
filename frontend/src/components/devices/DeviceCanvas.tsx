import type { MenuItem } from "../../types/device.types";
import { FanDevice } from "./FanDevice";
import { LightDevice } from "./LightDevice";
import { DEVICE_TYPES } from "../../constants/devices";

interface DeviceCanvasProps {
  droppedItem: MenuItem | null;
  isPowerOn: boolean;
  speed: number;
  onTogglePower: () => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const DeviceCanvas = ({
  droppedItem,
  isPowerOn,
  speed,
  onTogglePower,
  onSpeedChange,
  onRemove,
  onDragOver,
  onDrop,
}: DeviceCanvasProps) => {
  return (
    <div className="content-inner" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="drop-zone">
        {!droppedItem ? (
          <div className="drop-hint">
            Drag and drop items here to create fan controls
          </div>
        ) : (
          <div className="fans-grid">
            {droppedItem.key === DEVICE_TYPES.FAN ? (
              <FanDevice
                label={droppedItem.label}
                isPowerOn={isPowerOn}
                speed={speed}
                onTogglePower={onTogglePower}
                onSpeedChange={onSpeedChange}
                onRemove={onRemove}
              />
            ) : (
              <LightDevice
                label={droppedItem.label}
                isPowerOn={isPowerOn}
                speed={speed}
                onTogglePower={onTogglePower}
                onSpeedChange={onSpeedChange}
                onRemove={onRemove}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
