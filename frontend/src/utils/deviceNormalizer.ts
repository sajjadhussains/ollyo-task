// Device normalization helper function
import { DEVICE_TYPES } from '../constants/devices';
import type { Device } from '../lib/api';

export interface NormalizedDevice {
  type: string;
  name: string;
  settings: Record<string, any>;
}

/**
 * Normalizes device type with case-insensitive comparison
 * and ensures proper default settings
 */
export function normalizeDevice(device: Partial<Device> | any): NormalizedDevice {
  if (!device || !device.type) {
    throw new Error('Device type is required');
  }

  // Normalize type (case-insensitive comparison)
  const typeLower = device.type.toLowerCase().trim();
  let normalizedType: string;

  if (typeLower === 'light' || typeLower === '1') {
    normalizedType = DEVICE_TYPES.LIGHT;
  } else if (typeLower === 'fan' || typeLower === '2') {
    normalizedType = DEVICE_TYPES.FAN;
  } else {
    normalizedType = device.type; // Keep original if not recognized
  }

  // Get default settings based on type
  let defaultSettings: Record<string, any>;
  if (normalizedType === DEVICE_TYPES.LIGHT) {
    defaultSettings = {
      power: false,
      brightness: 50,
      colorTemp: 'warm',
    };
  } else if (normalizedType === DEVICE_TYPES.FAN) {
    defaultSettings = {
      power: false,
      speed: 50,
    };
  } else {
    defaultSettings = {};
  }

  // Merge provided settings with defaults
  const settings = {
    ...defaultSettings,
    ...(device.settings || {}),
  };

  return {
    type: normalizedType,
    name: device.name || 'Unnamed Device',
    settings,
  };
}

/**
 * Parses device from database (JSON settings may be string)
 */
export function parseDeviceFromDb(device: any): Device {
  let settings = device.settings;
  if (typeof settings === 'string') {
    try {
      settings = JSON.parse(settings);
    } catch (e) {
      console.error('Failed to parse device settings:', e);
      settings = {};
    }
  }

  return {
    ...device,
    settings,
  };
}

/**
 * Parses preset from database (JSON devices may be string)
 */
export function parsePresetFromDb(preset: any): any {
  let devices = preset.devices;
  if (typeof devices === 'string') {
    try {
      devices = JSON.parse(devices);
    } catch (e) {
      console.error('Failed to parse preset devices:', e);
      devices = [];
    }
  }

  return {
    ...preset,
    devices: Array.isArray(devices) ? devices.map(parseDeviceFromDb) : [],
  };
}

