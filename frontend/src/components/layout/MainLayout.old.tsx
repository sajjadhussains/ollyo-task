// import { useState, useRef } from "react";
// import fanIcon from "../../assets/icons/fan-icon.png";
// import lightIcon from "../../assets/icons/light-icon.png";
// import lightImage from "../../assets/images/light.png";

// interface MenuItem {
//   key: string;
//   label: string;
//   icon: string;
// }

// const menuItems: MenuItem[] = [
//   { key: "1", label: "Light", icon: lightIcon },
//   { key: "2", label: "Fan", icon: fanIcon },
// ];

// export default function MainLayout() {
//   const [selectedKey, setSelectedKey] = useState<string | undefined>();
//   const [droppedItem, setDroppedItem] = useState<MenuItem | null>(null);
//   const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
//   const [isPowerOn, setIsPowerOn] = useState(false);
//   const [speed, setSpeed] = useState(0);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const [showSaveModal, setShowSaveModal] = useState(false);
//   const [presetName, setPresetName] = useState("");
//   const [showSuccessToast, setShowSuccessToast] = useState(false);

//   const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
//     setDraggedItem(item);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     if (!draggedItem || !contentRef.current) return;

//     setDroppedItem(draggedItem);
//     setSelectedKey(draggedItem.key);
//     setDraggedItem(null);
//   };

//   const removeFan = () => {
//     setDroppedItem(null);
//   };

//   const togglePower = () => {
//     setIsPowerOn(!isPowerOn);
//   };

//   const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSpeed(Number(e.target.value));
//   };

//   const handleSaveClick = () => {
//     setShowSaveModal(true);
//   };

//   const handleSavePreset = () => {
//     if (presetName.trim() === "") {
//       return;
//     }
//     setShowSaveModal(false);
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//     setPresetName("");
//   };

//   const handleCancelSave = () => {
//     setShowSaveModal(false);
//     setPresetName("");
//   };

//   const rotationSpeed = isPowerOn && speed > 0 ? 3 - (speed / 100) * 2.8 : 0;

//   return (
//     <>
//       <style>
//         {`
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }

//           .layout-container {
//             display: flex;
//             height: 100vh;
//             background-color: #0A101D;
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           }

//           .sidebar {
//             width: 224px;
//             background-color: #1E2939;
//             padding: 16px 15px;
//             display: flex;
//             flex-direction: column;
//           }

//           .sidebar-title {
//             color: white;
//             font-size: 20px;
//             margin-bottom: 16px;
//             margin-left: 10px;
//           }

//           .menu-vertical {
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//             list-style: none;
//           }

//           .menu-item {
//             display: flex;
//             align-items: center;
//             padding: 12px 16px;
//             color: white;
//             background-color: transparent;
//             border: 1px solid rgba(54, 65, 83, 1);
//             border-radius: 10px;
//             cursor: grab;
//             transition: all 0.3s ease;
//             user-select: none;
//           }

//           .menu-item:active {
//             cursor: grabbing;
//           }

//           .menu-item-icon {
//             width: 16px;
//             height: 16px;
//             margin-right: 8px;
//           }

//           .menu-item:hover {
//             background-color: #FF6666;
//           }

//           .menu-item.active {
//             background-color: #646F7F;
//           }

//           .main-content {
//             flex: 1;
//             display: flex;
//             flex-direction: column;
//           }

//           .header {
//             background-color: #0A101D;
//             padding: 0 24px;
//             height: 64px;
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//           }

//           .header-title {
//             color: white;
//             font-size: 20px;
//           }

//           .header-actions {
//             display: flex;
//             gap: 8px;
//           }

//           .header-btn {
//             padding: 8px 16px;
//             border: none;
//             border-radius: 6px;
//             font-size: 13px;
//             font-weight: 500;
//             cursor: pointer;
//             transition: all 0.2s;
//           }

//           .header-clear-btn {
//             background-color: transparent;
//             color: #FF6666;
//             border: 1px solid #FF6666;
//           }

//           .header-clear-btn:hover {
//             background-color: rgba(255, 102, 102, 0.1);
//           }

//           .header-save-btn {
//             background-color: #4299E1;
//             color: white;
//           }

//           .header-save-btn:hover {
//             background-color: #3182CE;
//           }

//           .menu-horizontal {
//             display: none;
//             gap: 6px;
//             list-style: none;
//           }

//           .menu-horizontal .menu-item {
//             padding: 8px 12px;
//             height: 36px;
//             margin-bottom: 0;
//           }

//           .mobile-title-section {
//             display: none;
//             background-color: #0A101D;
//             padding: 12px 16px;
//             border-bottom: 1px solid rgba(54, 65, 83, 1);
//           }

//           .mobile-title {
//             color: white;
//             font-size: 18px;
//           }

//           .content {
//             flex: 1;
//             padding: 24px 24px 24px 16px;
//             background-color: #0A101D;
//             overflow: auto;
//           }

//           .content-inner {
//             padding: 24px;
//             min-height: 100%;
//             background-color: #1E2939;
//             border: 1px solid rgba(30, 41, 57, 1);
//             border-radius: 14px;
//             position: relative;
//           }

//           .drop-zone {
//             min-height: 400px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             position: relative;
//           }

//           .drop-hint {
//             color: #666;
//             font-size: 16px;
//             text-align: center;
//           }

//           .fan-container {
//             position: relative;
//             width: 320px;
//             margin: 20px;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//           }

//           .fan-visual {
//             position: relative;
//             width: 320px;
//             height: 320px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }

//           .fan-blades {
//             position: absolute;
//             width: 280px;
//             height: 280px;
//             animation: rotate-fan var(--rotation-speed) linear infinite;
//             animation-play-state: var(--animation-state);
//           }

//           @keyframes rotate-fan {
//             from {
//               transform: rotate(0deg);
//             }
//             to {
//               transform: rotate(360deg);
//             }
//           }

//           .fan-wing {
//             position: absolute;
//             width: 50px;
//             height: 130px;
//             left: 50%;
//             top: 50%;
//             transform-origin: center center;
//             border-radius: 50px 50px 0px 0px;
//             background: linear-gradient(
//               180deg,
//               rgba(32, 35, 50, 1) 0%,
//               rgba(45, 50, 70, 1) 30%,
//               rgba(60, 65, 82, 1) 70%,
//               rgba(74, 85, 104, 1) 100%
//             );
//             box-shadow:
//               0 2px 8px rgba(0, 0, 0, 0.3),
//               inset 0 2px 4px rgba(255, 255, 255, 0.1);
//           }

//           .fan-wing-1 {
//             transform: translate(-50%, -50%) rotate(0deg) translateY(-75px);
//           }

//           .fan-wing-2 {
//             transform: translate(-50%, -50%) rotate(90deg) translateY(-75px);
//           }

//           .fan-wing-3 {
//             transform: translate(-50%, -50%) rotate(180deg) translateY(-75px);
//           }

//           .fan-wing-4 {
//             transform: translate(-50%, -50%) rotate(270deg) translateY(-75px);
//           }

//           .fan-center {
//             position: absolute;
//             width: 70px;
//             height: 70px;
//             background-color: #1A2332;
//             border-radius: 50%;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             z-index: 10;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
//           }

//           .fan-center-inner {
//             width: 40px;
//             height: 40px;
//             background-color: #2D3D52;
//             border-radius: 50%;
//           }

//           .fan-label {
//             color: white;
//             font-size: 14px;
//             background-color: rgba(30, 41, 57, 0.8);
//             padding: 4px 12px;
//             border-radius: 6px;
//             white-space: nowrap;
//             margin-top: 10px;
//           }

//           .remove-btn {
//             position: absolute;
//             top: -10px;
//             right: -10px;
//             width: 24px;
//             height: 24px;
//             background-color: #FF6666;
//             color: white;
//             border: none;
//             border-radius: 50%;
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 14px;
//             z-index: 20;
//             transition: background-color 0.2s;
//           }

//           .remove-btn:hover {
//             background-color: #FF4444;
//           }

//           .fans-grid {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 40px;
//             justify-content: center;
//             align-items: center;
//             padding: 40px 20px;
//           }

//           .light-container {
//             position: relative;
//             width: 320px;
//             margin: 20px;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//           }

//           .light-visual {
//             position: relative;
//             width: 320px;
//             height: 320px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }

//           .light-image {
//             width: 200px;
//             height: auto;
//             filter: brightness(0.5);
//             transition: filter 0.3s ease;
//           }

//           .light-image.active {
//             filter: brightness(1.2) drop-shadow(0 0 30px rgba(255, 215, 0, 0.6));
//           }

//           .light-label {
//             color: white;
//             font-size: 14px;
//             background-color: rgba(30, 41, 57, 0.8);
//             padding: 4px 12px;
//             border-radius: 6px;
//             white-space: nowrap;
//             margin-top: 10px;
//           }

//           .control-panel {
//             background-color: rgba(30, 41, 57, 0.95);
//             border: 1px solid rgba(54, 65, 83, 1);
//             border-radius: 12px;
//             padding: 16px 24px;
//             display: flex;
//             flex-direction: column;
//             gap: 12px;
//             min-width: 280px;
//             margin-top: 20px;
//           }

//           .control-row {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//           }

//           .control-label {
//             color: white;
//             font-size: 14px;
//           }

//           .toggle-switch {
//             position: relative;
//             width: 48px;
//             height: 24px;
//             background-color: #4A5568;
//             border-radius: 12px;
//             cursor: pointer;
//             transition: background-color 0.3s;
//           }

//           .toggle-switch.active {
//             background-color: #4299E1;
//           }

//           .toggle-slider {
//             position: absolute;
//             top: 2px;
//             left: 2px;
//             width: 20px;
//             height: 20px;
//             background-color: white;
//             border-radius: 50%;
//             transition: transform 0.3s;
//           }

//           .toggle-switch.active .toggle-slider {
//             transform: translateX(24px);
//           }

//           .speed-slider {
//             width: 100%;
//             height: 4px;
//             background-color: #4A5568;
//             border-radius: 2px;
//             appearance: none;
//             outline: none;
//           }

//           .speed-slider::-webkit-slider-thumb {
//             appearance: none;
//             width: 16px;
//             height: 16px;
//             background-color: #4299E1;
//             border-radius: 50%;
//             cursor: pointer;
//           }

//           .speed-slider::-moz-range-thumb {
//             width: 16px;
//             height: 16px;
//             background-color: #4299E1;
//             border-radius: 50%;
//             cursor: pointer;
//             border: none;
//           }

//           .speed-value {
//             color: #4299E1;
//             font-size: 14px;
//             font-weight: 600;
//           }

//           .modal-overlay {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background-color: rgba(0, 0, 0, 0.7);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             z-index: 1000;
//           }

//           .modal-content {
//             background-color: #1E2939;
//             border-radius: 12px;
//             padding: 24px;
//             width: 90%;
//             max-width: 450px;
//             position: relative;
//           }

//           .modal-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             margin-bottom: 20px;
//           }

//           .modal-title {
//             color: white;
//             font-size: 18px;
//             font-weight: 600;
//           }

//           .modal-close {
//             background: none;
//             border: none;
//             color: #888;
//             font-size: 24px;
//             cursor: pointer;
//             padding: 0;
//             width: 24px;
//             height: 24px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             transition: color 0.2s;
//           }

//           .modal-close:hover {
//             color: white;
//           }

//           .modal-body {
//             margin-bottom: 20px;
//           }

//           .form-group {
//             margin-bottom: 16px;
//           }

//           .form-label {
//             color: white;
//             font-size: 13px;
//             display: block;
//             margin-bottom: 8px;
//           }

//           .form-input {
//             width: 100%;
//             padding: 10px 12px;
//             background-color: #2D3D52;
//             border: 1px solid rgba(54, 65, 83, 1);
//             border-radius: 6px;
//             color: white;
//             font-size: 14px;
//             outline: none;
//             transition: border-color 0.2s;
//           }

//           .form-input:focus {
//             border-color: #4299E1;
//           }

//           .form-input::placeholder {
//             color: #666;
//           }

//           .form-hint {
//             color: #888;
//             font-size: 12px;
//             margin-top: 8px;
//           }

//           .modal-footer {
//             display: flex;
//             justify-content: flex-end;
//             gap: 12px;
//           }

//           .modal-btn {
//             padding: 8px 20px;
//             border: none;
//             border-radius: 6px;
//             font-size: 14px;
//             font-weight: 500;
//             cursor: pointer;
//             transition: all 0.2s;
//           }

//           .modal-btn-cancel {
//             background-color: transparent;
//             color: #888;
//             border: 1px solid rgba(54, 65, 83, 1);
//           }

//           .modal-btn-cancel:hover {
//             background-color: rgba(54, 65, 83, 0.3);
//           }

//           .modal-btn-save {
//             background-color: #4299E1;
//             color: white;
//           }

//           .modal-btn-save:hover {
//             background-color: #3182CE;
//           }

//           .modal-btn-save:disabled {
//             background-color: #4A5568;
//             cursor: not-allowed;
//             opacity: 0.6;
//           }

//           .success-toast {
//             position: fixed;
//             top: 80px;
//             left: 50%;
//             transform: translateX(-50%);
//             background-color: #1E2939;
//             border: 1px solid rgba(54, 65, 83, 1);
//             border-radius: 8px;
//             padding: 12px 20px;
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             z-index: 1001;
//             animation: slideDown 0.3s ease;
//           }

//           @keyframes slideDown {
//             from {
//               opacity: 0;
//               transform: translateX(-50%) translateY(-20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateX(-50%) translateY(0);
//             }
//           }

//           .success-icon {
//             width: 20px;
//             height: 20px;
//             background-color: #48BB78;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             color: white;
//             font-size: 12px;
//             font-weight: bold;
//           }

//           .success-text {
//             color: white;
//             font-size: 14px;
//           }

//           @media (max-width: 767px) {
//             .sidebar {
//               display: none;
//             }

//             .header {
//               padding: 12px 16px;
//               height: auto;
//             }

//             .menu-horizontal {
//               display: flex;
//             }

//             .mobile-title-section {
//               display: block;
//             }

//             .light-container {
//               width: 240px;
//             }

//             .light-visual {
//               width: 240px;
//               height: 240px;
//             }

//             .light-image {
//               width: 150px;
//             }

//             .fan-container {
//               width: 240px;
//             }

//             .fan-visual {
//               width: 240px;
//               height: 240px;
//             }

//             .fan-blades {
//               width: 200px;
//               height: 200px;
//             }

//             .fan-wing {
//               width: 40px;
//               height: 100px;
//             }

//             .fan-wing-1 {
//               transform: translate(-50%, -50%) rotate(0deg) translateY(-60px);
//             }

//             .fan-wing-2 {
//               transform: translate(-50%, -50%) rotate(90deg) translateY(-60px);
//             }

//             .fan-wing-3 {
//               transform: translate(-50%, -50%) rotate(180deg) translateY(-60px);
//             }

//             .fan-wing-4 {
//               transform: translate(-50%, -50%) rotate(270deg) translateY(-60px);
//             }

//             .fan-center {
//               width: 55px;
//               height: 55px;
//             }

//             .fan-center-inner {
//               width: 30px;
//               height: 30px;
//             }

//             .control-panel {
//               min-width: 240px;
//               padding: 12px 16px;
//             }
//           }
//         `}
//       </style>

//       <div className="layout-container">
//         <aside className="sidebar">
//           <h2 className="sidebar-title">Devices</h2>
//           <ul className="menu-vertical">
//             {menuItems.map((item) => (
//               <li
//                 key={item.key}
//                 className={`menu-item ${
//                   selectedKey === item.key ? "active" : ""
//                 }`}
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, item)}
//                 onClick={() => setSelectedKey(item.key)}
//               >
//                 <img
//                   src={item.icon}
//                   alt={item.label}
//                   className="menu-item-icon"
//                 />
//                 <span>{item.label}</span>
//               </li>
//             ))}
//           </ul>
//         </aside>

//         <div className="main-content">
//           <header className="header">
//             <h1 className="header-title">Testing Canvas</h1>

//             <div className="header-actions">
//               {isPowerOn && speed > 0 && (
//                 <>
//                   <button className="header-btn header-clear-btn">Clear</button>
//                   <button
//                     className="header-btn header-save-btn"
//                     onClick={handleSaveClick}
//                   >
//                     Save Preset
//                   </button>
//                 </>
//               )}
//             </div>

//             <ul className="menu-horizontal">
//               {menuItems.map((item) => (
//                 <li
//                   key={item.key}
//                   className={`menu-item ${
//                     selectedKey === item.key ? "active" : ""
//                   }`}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, item)}
//                   onClick={() => setSelectedKey(item.key)}
//                 >
//                   <img
//                     src={item.icon}
//                     alt={item.label}
//                     className="menu-item-icon"
//                   />
//                   <span>{item.label}</span>
//                 </li>
//               ))}
//             </ul>
//           </header>

//           <div className="mobile-title-section">
//             <h2 className="mobile-title">Testing Canvas</h2>
//           </div>

//           <main className="content">
//             <div
//               className="content-inner"
//               ref={contentRef}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             >
//               <div className="drop-zone">
//                 {!droppedItem ? (
//                   <div className="drop-hint">
//                     Drag and drop items here to create fan controls
//                   </div>
//                 ) : droppedItem.key === "2" ? (
//                   <div className="fans-grid">
//                     <div className="fan-container">
//                       <button className="remove-btn" onClick={removeFan}>
//                         ×
//                       </button>
//                       <div className="fan-visual">
//                         <div
//                           className="fan-blades"
//                           style={
//                             {
//                               "--rotation-speed": `${rotationSpeed}s`,
//                               "--animation-state": isPowerOn
//                                 ? "running"
//                                 : "paused",
//                             } as React.CSSProperties
//                           }
//                         >
//                           <div className="fan-wing fan-wing-1"></div>
//                           <div className="fan-wing fan-wing-2"></div>
//                           <div className="fan-wing fan-wing-3"></div>
//                           <div className="fan-wing fan-wing-4"></div>
//                         </div>
//                         <div className="fan-center">
//                           <div className="fan-center-inner"></div>
//                         </div>
//                       </div>
//                       <div className="fan-label">{droppedItem.label}</div>

//                       <div className="control-panel">
//                         <div className="control-row">
//                           <span className="control-label">Power</span>
//                           <div
//                             className={`toggle-switch ${
//                               isPowerOn ? "active" : ""
//                             }`}
//                             onClick={togglePower}
//                           >
//                             <div className="toggle-slider"></div>
//                           </div>
//                         </div>
//                         <div className="control-row">
//                           <span className="control-label">Speed</span>
//                           <span className="speed-value">{speed}%</span>
//                         </div>
//                         <input
//                           type="range"
//                           className="speed-slider"
//                           min="0"
//                           max="100"
//                           value={speed}
//                           onChange={handleSpeedChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="fans-grid">
//                     <div className="light-container">
//                       <button className="remove-btn" onClick={removeFan}>
//                         ×
//                       </button>
//                       <div className="light-visual">
//                         <img
//                           src={lightImage}
//                           alt="Light"
//                           className={`light-image ${isPowerOn ? "active" : ""}`}
//                         />
//                       </div>
//                       <div className="light-label">{droppedItem.label}</div>

//                       <div className="control-panel">
//                         <div className="control-row">
//                           <span className="control-label">Power</span>
//                           <div
//                             className={`toggle-switch ${
//                               isPowerOn ? "active" : ""
//                             }`}
//                             onClick={togglePower}
//                           >
//                             <div className="toggle-slider"></div>
//                           </div>
//                         </div>
//                         <div className="control-row">
//                           <span className="control-label">Brightness</span>
//                           <span className="speed-value">{speed}%</span>
//                         </div>
//                         <input
//                           type="range"
//                           className="speed-slider"
//                           min="0"
//                           max="100"
//                           value={speed}
//                           onChange={handleSpeedChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </main>
//         </div>

//         {showSaveModal && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h3 className="modal-title">Give me a name</h3>
//                 <button className="modal-close" onClick={handleCancelSave}>
//                   ×
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <div className="form-group">
//                   <label className="form-label">Name *</label>
//                   <input
//                     type="text"
//                     className="form-input"
//                     placeholder="Enter preset name"
//                     value={presetName}
//                     onChange={(e) => setPresetName(e.target.value)}
//                     autoFocus
//                   />
//                   <p className="form-hint">
//                     By adding this effect as a preset you can reuse this
//                     anytime.
//                   </p>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="modal-btn modal-btn-cancel"
//                   onClick={handleCancelSave}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="modal-btn modal-btn-save"
//                   onClick={handleSavePreset}
//                   disabled={presetName.trim() === ""}
//                 >
//                   Save Preset
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showSuccessToast && (
//           <div className="success-toast">
//             <div className="success-icon">✓</div>
//             <span className="success-text">Preset saved</span>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
