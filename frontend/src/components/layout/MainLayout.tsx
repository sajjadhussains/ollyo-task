import { useState, useCallback } from "react";
import { Sidebar } from "../ui/Sidebar";
import { Header } from "../ui/Header";
import { Modal } from "../ui/Modal";
import { Toast } from "../ui/Toast";
import { DeviceCanvas } from "../devices/DeviceCanvas";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useDeviceState } from "../../hooks/useDeviceState";
import { useModal } from "../../hooks/useModal";
import { useToast } from "../../hooks/useToast";
import { useDevices } from "../../contexts/DeviceContext";
import { MENU_ITEMS, DEVICE_TYPES } from "../../constants/devices";
import { normalizeDevice } from "../../utils/deviceNormalizer";
// import type { MenuItem } from "../../types/device.types";
import type { Preset } from "../../lib/api";
import "../../styles/MainLayout.css";

export default function MainLayout() {
  const [selectedKey, setSelectedKey] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState("Preset saved");

  // Device context
  const { presets, addPreset, deletePreset } = useDevices();

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
    // settings,
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

  const handleSavePreset = async () => {
    if (presetName.trim() === "") return;

    if (!droppedItem) {
      setToastMessage("Please add a device first");
      displayToast();
      return;
    }

    try {
      // Create device configuration from current state
      const deviceConfig = normalizeDevice({
        type: droppedItem.key,
        name: droppedItem.label,
        settings: {
          power: isPowerOn,
          ...(droppedItem.key === DEVICE_TYPES.LIGHT
            ? { brightness, colorTemp }
            : { speed }),
        },
      });

      // Create preset with device configuration
      await addPreset({
        name: presetName.trim(),
        devices: [deviceConfig],
      });

      setToastMessage("Preset saved successfully");
      closeModal();
      displayToast();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save preset";
      setToastMessage(errorMessage);
      displayToast();
    }
  };

  const handlePresetDragStart = (e: React.DragEvent, preset: Preset) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("preset", JSON.stringify(preset));
  };

  const handlePresetDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const presetData = e.dataTransfer.getData("preset");
      if (!presetData) return;

      try {
        const preset: Preset = JSON.parse(presetData);
        if (!preset.devices || preset.devices.length === 0) {
          setToastMessage("Preset has no devices");
          displayToast();
          return;
        }

        // Load first device from preset
        const device = preset.devices[0];
        const normalizedDevice = normalizeDevice(device);

        // Find matching menu item
        const menuItem = MENU_ITEMS.find(
          (item) => item.key === normalizedDevice.type
        );

        if (!menuItem) {
          setToastMessage("Device type not found");
          displayToast();
          return;
        }

        // Set the dropped item directly
        setDroppedItemDirectly(menuItem);

        // Update device state with preset settings
        const settings = normalizedDevice.settings || {};
        updateSettings({
          power: settings.power || false,
          speed: settings.speed ?? 0,
          brightness: settings.brightness ?? 50,
          colorTemp: settings.colorTemp || "warm",
        });

        setToastMessage(`Preset "${preset.name}" loaded`);
        displayToast();
      } catch (err) {
        console.error("Error loading preset:", err);
        setToastMessage("Failed to load preset");
        displayToast();
      }
    },
    [setDroppedItemDirectly, updateSettings, displayToast]
  );

  const handlePresetDelete = async (id: number) => {
    try {
      await deletePreset(id);
      setToastMessage("Preset deleted");
      displayToast();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete preset";
      setToastMessage(errorMessage);
      displayToast();
    }
  };

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
          <h2 className="mobile-title">Testing Canvas</h2>
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
