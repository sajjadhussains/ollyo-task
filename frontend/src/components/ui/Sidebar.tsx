import type { MenuItem } from "../../types/device.types";
import type { Preset } from "../../lib/api";
import { PresetList } from "./PresetList";

interface SidebarProps {
  menuItems: MenuItem[];
  presets: Preset[];
  selectedKey?: string;
  onItemClick: (key: string) => void;
  onDragStart: (e: React.DragEvent, item: MenuItem) => void;
  onPresetDragStart: (e: React.DragEvent, preset: Preset) => void;
  onPresetDelete: (id: number) => void;
}

export const Sidebar = ({
  menuItems,
  presets,
  selectedKey,
  onItemClick,
  onDragStart,
  onPresetDragStart,
  onPresetDelete,
}: SidebarProps) => {
  const lightIcon = menuItems[0].icon; // Light icon
  const fanIcon = menuItems[1]?.icon || menuItems[0].icon; // Fan icon fallback

  return (
    <aside className="sidebar">
      <p className="sidebar-title">Devices</p>

      {/* Devices */}
      <ul className="menu-vertical">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`menu-item ${selectedKey === item.key ? "active" : ""}`}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onClick={() => onItemClick(item.key)}
          >
            <img src={item.icon} alt={item.label} className="menu-item-icon" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      {/* Presets */}
      <PresetList
        presets={presets}
        lightIcon={lightIcon}
        fanIcon={fanIcon}
        onDragStart={onPresetDragStart}
        onDelete={onPresetDelete}
      />
    </aside>
  );
};
