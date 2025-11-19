// Device normalization helper function
import { DEVICE_TYPES } from '../constants/devices';
import type { Device } from '../lib/api';

export interface NormalizedDevice {
  type: string;
  name: string;
  settings: Record<string, any>;
}


export function normalizeDevice(device: Partial<Device> | any): NormalizedDevice {
  if (!device || !device.type) {
    throw new Error('Device type is required');
  }


  const typeLower = device.type.toLowerCase().trim();
  let normalizedType: string;

  if (typeLower === 'light' || typeLower === '1') {
    normalizedType = DEVICE_TYPES.LIGHT;
  } else if (typeLower === 'fan' || typeLower === '2') {
    normalizedType = DEVICE_TYPES.FAN;
  } else {
    normalizedType = device.type;
  }

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

