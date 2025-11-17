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
      {presets.length === 0 ? (
        <div className="saved-presets">
          <p className="sidebar-title">Saved Presets</p>
          <div className="noting-added">
            <span>Nothing Added Yet</span>
          </div>
        </div>
      ) : (
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
                {/* Device Icon Logic */}
                <img
                  src={preset.devices?.[0]?.type === "1" ? lightIcon : fanIcon}
                  alt={
                    preset.devices?.[0]?.type === "1"
                      ? "Light Device"
                      : "Fan Device"
                  }
                  className="menu-item-icon"
                />

                <span className="preset-name">{preset.name}</span>
                <button
                  className="preset-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      preset.id &&
                      window.confirm(`Delete preset "${preset.name}"?`)
                    ) {
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
