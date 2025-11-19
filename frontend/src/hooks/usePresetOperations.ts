import { useCallback } from "react";
import {
    useCreatePresetMutation,
    useDeletePresetMutation,
} from "../store/api/deviceApi";
import { normalizeDevice } from "../utils/deviceNormalizer";
import { DEVICE_TYPES, MENU_ITEMS } from "../constants/devices";
import type { Preset } from "../lib/api";
import type { MenuItem } from "../types/device.types";

interface UsePresetOperationsProps {
    presetName: string;
    droppedItem: MenuItem | null;
    isPowerOn: boolean;
    speed: number;
    brightness: number;
    colorTemp: string;
    setToastMessage: (msg: string) => void;
    displayToast: () => void;
    closeModal: () => void;
    setDroppedItemDirectly: (item: MenuItem) => void;
    updateSettings: (settings: any) => void;
}

export const usePresetOperations = ({
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
}: UsePresetOperationsProps) => {
    const [createPreset] = useCreatePresetMutation();
    const [deletePreset] = useDeletePresetMutation();

    const handleSavePreset = async () => {
        if (presetName.trim() === "") return;

        if (!droppedItem) {
            setToastMessage("Please add a device first");
            displayToast();
            return;
        }

        try {
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

            await createPreset({
                name: presetName.trim(),
                devices: [deviceConfig],
            }).unwrap();

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

    const handlePresetDelete = async (id: number) => {
        try {
            await deletePreset(id).unwrap();
            setToastMessage("Preset deleted");
            displayToast();
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to delete preset";
            setToastMessage(errorMessage);
            displayToast();
        }
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

                const device = preset.devices[0];
                const normalizedDevice = normalizeDevice(device);

                const menuItem = MENU_ITEMS.find(
                    (item) => item.key === normalizedDevice.type
                );

                if (!menuItem) {
                    setToastMessage("Device type not found");
                    displayToast();
                    return;
                }

                setDroppedItemDirectly(menuItem);

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
        [setDroppedItemDirectly, updateSettings, displayToast, setToastMessage]
    );

    return {
        handleSavePreset,
        handlePresetDelete,
        handlePresetDrop,
    };
};
