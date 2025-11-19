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
import {
  useGetPresetsQuery,
} from "../../store/api/deviceApi";
import { MENU_ITEMS, DEVICE_TYPES } from "../../constants/devices";
import { usePresetOperations } from "../../hooks/usePresetOperations";
import type { Preset } from "../../lib/api";
import { PresetList } from "../ui/PresetList";
import "../../styles/MainLayout.css";

export default function MainLayout() {
  const [selectedKey, setSelectedKey] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState("Preset saved");

  // RTK Query hooks with automatic caching
  const {
    data: presets = [],
  } = useGetPresetsQuery();

  // Custom hooks for state management
  const {
    droppedItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setDroppedItemDirectly,
    removeDevice,
  } = useDragAndDrop();

  const {
    isPowerOn,
    speed,
    brightness,
    colorTemp,
    togglePower,
    handleSpeedChange,
    handleBrightnessChange,
    handleColorTempChange,
    updateSettings,
    resetState,
  } = useDeviceState();

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

  const handlePresetDragStart = (e: React.DragEvent, preset: Preset) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("preset", JSON.stringify(preset));
  };

  const { handleSavePreset, handlePresetDelete, handlePresetDrop } =
    usePresetOperations({
      presetName,
      droppedItem,
      isPowerOn,
      speed,
      brightness,
      colorTemp,
      setToastMessage,
      displayToast,
      closeModal,
      setDroppedItemDirectly,
      updateSettings,
    });

  const handleClear = () => {
    removeDevice();
    resetState();
  };

  // Enhanced drop handler that supports both device items and presets
  const handleCanvasDrop = (e: React.DragEvent) => {
    const presetData = e.dataTransfer.getData("preset");
    if (presetData) {
      handlePresetDrop(e);
    } else {
      handleDrop(e);
    }
  };

  const showActions =
    droppedItem !== null &&
    ((droppedItem.key === DEVICE_TYPES.LIGHT && isPowerOn && brightness > 0) ||
      (droppedItem.key === DEVICE_TYPES.FAN && isPowerOn && speed > 0));

  return (
    <div className="layout-container">
      <Sidebar
        menuItems={MENU_ITEMS}
        presets={presets}
        selectedKey={selectedKey}
        onItemClick={handleItemClick}
        onDragStart={handleDragStart}
        onPresetDragStart={handlePresetDragStart}
        onPresetDelete={handlePresetDelete}
      />

      <div className="main-content">
        <Header
          title="Testing Canvas"
          showActions={showActions}
          onSaveClick={openModal}
          onClearClick={handleClear}
          menuItems={MENU_ITEMS}
          selectedKey={selectedKey}
          onItemClick={handleItemClick}
          onDragStart={handleDragStart}
        />

        <div className="mobile-title-section">
          {presets.length > 0 && (
            <PresetList
              presets={presets}
              lightIcon={MENU_ITEMS[0].icon}
              fanIcon={MENU_ITEMS[1]?.icon || MENU_ITEMS[0].icon}
              onDragStart={handlePresetDragStart}
              onDelete={handlePresetDelete}
            />
          )}
        </div>

        <main className="content">
          <DeviceCanvas
            droppedItem={droppedItem}
            isPowerOn={isPowerOn}
            speed={speed}
            brightness={brightness}
            colorTemp={colorTemp}
            onTogglePower={togglePower}
            onSpeedChange={handleSpeedChange}
            onBrightnessChange={handleBrightnessChange}
            onColorTempChange={handleColorTempChange}
            onDragOver={handleDragOver}
            onDrop={handleCanvasDrop}
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

      <Toast isVisible={showToast} message={toastMessage} />
    </div>
  );
}
