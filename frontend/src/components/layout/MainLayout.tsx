import { useState } from "react";
import { Sidebar } from "../ui/Sidebar";
import { Header } from "../ui/Header";
import { Modal } from "../ui/Modal";
import { Toast } from "../ui/Toast";
import { DeviceCanvas } from "../devices/DeviceCanvas";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useDeviceState } from "../../hooks/useDeviceState";
import { useModal } from "../../hooks/useModal";
import { useToast } from "../../hooks/useToast";
import { MENU_ITEMS } from "../../constants/devices";
import "../../styles/MainLayout.css";

export default function MainLayout() {
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  // Custom hooks for state management
  const {
    droppedItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    removeDevice,
  } = useDragAndDrop();

  const { isPowerOn, speed, togglePower, handleSpeedChange } = useDeviceState();

  const {
    isOpen: isModalOpen,
    inputValue: presetName,
    openModal,
    closeModal,
    handleInputChange,
  } = useModal();

  const { isVisible: showToast, showToast: displayToast } = useToast(3000);

  // Event handlers
  const handleItemClick = (key: string) => {
    setSelectedKey(key);
  };

  const handleSavePreset = () => {
    if (presetName.trim() === "") return;
    console.log(isPowerOn, speed, droppedItem, presetName)
    closeModal();
    displayToast();
  };

  const showActions = droppedItem !== null && isPowerOn && speed > 0;

  return (
    <div className="layout-container">
      <Sidebar
        menuItems={MENU_ITEMS}
        selectedKey={selectedKey}
        onItemClick={handleItemClick}
        onDragStart={handleDragStart}
      />

      <div className="main-content">
        <Header
          title="Testing Canvas"
          showActions={showActions}
          onSaveClick={openModal}
          onClearClick={removeDevice}
          menuItems={MENU_ITEMS}
          selectedKey={selectedKey}
          onItemClick={handleItemClick}
          onDragStart={handleDragStart}
        />

        <div className="mobile-title-section">
          <h2 className="mobile-title">Testing Canvas</h2>
        </div>

        <main className="content">
          <DeviceCanvas
            droppedItem={droppedItem}
            isPowerOn={isPowerOn}
            speed={speed}
            onTogglePower={togglePower}
            onSpeedChange={handleSpeedChange}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Give me a name"
        value={presetName}
        onValueChange={handleInputChange}
        onSave={handleSavePreset}
        onCancel={closeModal}
      />

      <Toast isVisible={showToast} message="Preset saved" />
    </div>
  );
}
