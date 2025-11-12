import type { MenuItem } from "../../types/device.types";
import type { Preset } from "../../lib/api";

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
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Devices</h2>
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

      {presets.length > 0 && (
        <>
          <h2 className="sidebar-title" style={{ marginTop: "2rem" }}>
            Presets
          </h2>
          <ul className="menu-vertical">
            {presets.map((preset) => (
              <li
                key={preset.id}
                className="menu-item preset-item"
                draggable
                onDragStart={(e) => onPresetDragStart(e, preset)}
              >
                <span className="preset-name">{preset.name}</span>
                <button
                  className="preset-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (preset.id && window.confirm(`Delete preset "${preset.name}"?`)) {
                      onPresetDelete(preset.id);
                    }
                  }}
                  title="Delete preset"
                  aria-label={`Delete preset ${preset.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
};
