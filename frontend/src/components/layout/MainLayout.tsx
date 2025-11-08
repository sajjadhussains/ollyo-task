import { useState } from "react";
import fanIcon from "../../assets/icons/fan-icon.png";
import lightIcon from "../../assets/icons/light-icon.png";
import "./MainLayout.css";

const menuItems = [
  { key: "1", label: "Light", icon: lightIcon },
  { key: "2", label: "Fan", icon: fanIcon },
];

export default function MainLayout() {
  const [selectedKey, setSelectedKey] = useState("1");

  return (
    <>
      <div className="layout-container">
        {/* Sidebar - Desktop only */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Devices</h2>
          <ul className="menu-vertical">
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={`menu-item ${
                  selectedKey === item.key ? "active" : ""
                }`}
                onClick={() => setSelectedKey(item.key)}
              >
                <img src={item.icon} alt={item.label} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <header className="header">
            <h1 className="header-title">
              <span>Testing Canvas</span>
            </h1>

            {/* Horizontal Menu - Mobile only */}
            <ul className="menu-horizontal">
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  className={`menu-item ${
                    selectedKey === item.key ? "active" : ""
                  }`}
                  onClick={() => setSelectedKey(item.key)}
                >
                  <img src={item.icon} alt={item.label} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </header>

          {/* Mobile Title Section */}
          <div className="mobile-title-section">
            <h2 className="mobile-title">Testing Canvas</h2>
          </div>

          {/* Content Area */}
          <main className="content">
            <div className="content-inner">
              <h2 style={{ color: "white", marginTop: 0, marginBottom: 16 }}>
                Content Area
              </h2>
              <p style={{ color: "#ccc", marginBottom: 12 }}>
                Selected Device: {selectedKey === "1" ? "Light" : "Fan"}
              </p>
              <p style={{ color: "#999" }}>
                Resize your browser window to see the responsive behavior. The
                layout automatically adapts using pure CSS media queries without
                any JavaScript state management for responsiveness.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
