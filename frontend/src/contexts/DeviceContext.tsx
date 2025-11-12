import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { devicesApi, presetsApi, type Device, type Preset } from '../lib/api';
import { parseDeviceFromDb, parsePresetFromDb } from '../utils/deviceNormalizer';

interface DeviceContextType {
  devices: Device[];
  presets: Preset[];
  loading: boolean;
  error: string | null;
  addDevice: (device: Omit<Device, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDevice: (id: number, settings: Record<string, any>) => Promise<void>;
  deleteDevice: (id: number) => Promise<void>;
  addPreset: (preset: Omit<Preset, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deletePreset: (id: number) => Promise<void>;
  refreshDevices: () => Promise<void>;
  refreshPresets: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDevices = async () => {
    try {
      setError(null);
      const data = await devicesApi.getAll();
      setDevices(data.map(parseDeviceFromDb));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
      console.error('Error fetching devices:', err);
    }
  };

  const refreshPresets = async () => {
    try {
      setError(null);
      const data = await presetsApi.getAll();
      setPresets(data.map(parsePresetFromDb));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch presets');
      console.error('Error fetching presets:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([refreshDevices(), refreshPresets()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const addDevice = async (device: Omit<Device, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newDevice = await devicesApi.create(device);
      setDevices((prev) => [parseDeviceFromDb(newDevice), ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create device';
      setError(errorMessage);
      throw err;
    }
  };

  const updateDevice = async (id: number, settings: Record<string, any>) => {
    try {
      setError(null);
      const updatedDevice = await devicesApi.update(id, settings);
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? parseDeviceFromDb(updatedDevice) : d))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update device';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteDevice = async (id: number) => {
    try {
      setError(null);
      await devicesApi.delete(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete device';
      setError(errorMessage);
      throw err;
    }
  };

  const addPreset = async (preset: Omit<Preset, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newPreset = await presetsApi.create(preset);
      setPresets((prev) => [parsePresetFromDb(newPreset), ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create preset';
      setError(errorMessage);
      throw err;
    }
  };

  const deletePreset = async (id: number) => {
    try {
      setError(null);
      await presetsApi.delete(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete preset';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        presets,
        loading,
        error,
        addDevice,
        updateDevice,
        deleteDevice,
        addPreset,
        deletePreset,
        refreshDevices,
        refreshPresets,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}

