// API service layer for devices and presets

export interface Device {
  id?: number;
  type: string;
  name: string;
  settings: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Preset {
  id?: number;
  name: string;
  devices: Device[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const API_BASE = "http://device-simulator.atwebpages.com/api";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }
  return data;
}

// Devices API
export const devicesApi = {
  async getAll(): Promise<Device[]> {
    const response = await fetch(`${API_BASE}/devices.php`);
    const result = await handleResponse<Device[]>(response);
    return result.data || [];
  },

  async create(
    device: Omit<Device, "id" | "created_at" | "updated_at">
  ): Promise<Device> {
    const response = await fetch(`${API_BASE}/devices.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    });
    const result = await handleResponse<Device>(response);
    if (!result.data) throw new Error("Failed to create device");
    return result.data;
  },

  async update(id: number, settings: Record<string, any>): Promise<Device> {
    const response = await fetch(`${API_BASE}/devices.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, settings }),
    });
    const result = await handleResponse<Device>(response);
    if (!result.data) throw new Error("Failed to update device");
    return result.data;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/devices.php?id=${id}`, {
      method: "DELETE",
    });
    await handleResponse<void>(response);
  },
};

// Presets API
export const presetsApi = {
  async getAll(): Promise<Preset[]> {
    const response = await fetch(`${API_BASE}/presets.php`);
    const result = await handleResponse<Preset[]>(response);
    return result.data || [];
  },

  async create(
    preset: Omit<Preset, "id" | "created_at" | "updated_at">
  ): Promise<Preset> {
    const response = await fetch(`${API_BASE}/presets.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preset),
    });
    const result = await handleResponse<Preset>(response);
    if (!result.data) throw new Error("Failed to create preset");
    return result.data;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/presets.php?id=${id}`, {
      method: "DELETE",
    });
    await handleResponse<void>(response);
  },
};
