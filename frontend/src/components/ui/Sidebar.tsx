import type { MenuItem } from "../../types/device.types";

interface SidebarProps {
  menuItems: MenuItem[];
  selectedKey?: string;
  onItemClick: (key: string) => void;
  onDragStart: (e: React.DragEvent, item: MenuItem) => void;
}

export const Sidebar = ({ menuItems, selectedKey, onItemClick, onDragStart }: SidebarProps) => {
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
    </aside>
  );
};
