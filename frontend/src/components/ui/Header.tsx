import type { MenuItem } from "../../types/device.types";

interface HeaderProps {
  title: string;
  showActions: boolean;
  onSaveClick: () => void;
  onClearClick: () => void;
  menuItems: MenuItem[];
  selectedKey?: string;
  onItemClick: (key: string) => void;
  onDragStart: (e: React.DragEvent, item: MenuItem) => void;
}

export const Header = ({
  title,
  showActions,
  onSaveClick,
  onClearClick,
  menuItems,
  selectedKey,
  onItemClick,
  onDragStart,
}: HeaderProps) => {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>

      <div className="header-actions">
        {showActions && (
          <>
            <button className="header-btn header-clear-btn" onClick={onClearClick}>
              Clear
            </button>
            <button className="header-btn header-save-btn" onClick={onSaveClick}>
              Save Preset
            </button>
          </>
        )}
      </div>

      <ul className="menu-horizontal">
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
    </header>
  );
};
