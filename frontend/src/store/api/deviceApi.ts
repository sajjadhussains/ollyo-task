import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Device, Preset } from "../../lib/api";
import { parseDeviceFromDb, parsePresetFromDb } from "../../utils/deviceNormalizer";

const API_BASE = "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Device API endpoints with RTK Query
export const deviceApi = createApi({
  reducerPath: "deviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
    // Handle API response errors
    validateStatus: (response, result) => {
      if (response.status >= 200 && response.status < 300) {
        return true;
      }
      // Check if result has error message
      if (result && typeof result === 'object' && 'error' in result) {
        return false;
      }
      return false;
    },
  }),
  tagTypes: ["Device", "Preset"],
  endpoints: (builder) => ({
    // Device endpoints
    getDevices: builder.query<Device[], void>({
      query: () => "/devices.php",
      transformResponse: (response: ApiResponse<Device[]>) => {
        const devices = response.data || [];
        return devices.map(parseDeviceFromDb);
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Device" as const, id })),
            { type: "Device", id: "LIST" },
          ]
          : [{ type: "Device", id: "LIST" }],
      // Cache for 60 seconds
      keepUnusedDataFor: 60,
    }),

    createDevice: builder.mutation<
      Device,
      Omit<Device, "id" | "created_at" | "updated_at">
    >({
      query: (device) => ({
        url: "/devices.php",
        method: "POST",
        body: device,
      }),
      transformResponse: (response: ApiResponse<Device>) => {
        if (!response.data) {
          throw new Error("Failed to create device");
        }
        return parseDeviceFromDb(response.data);
      },
      invalidatesTags: [{ type: "Device", id: "LIST" }],
    }),

    updateDevice: builder.mutation<
      Device,
      { id: number; settings: Partial<Device> }
    >({
      query: ({ id, settings }) => ({
        url: "/devices.php",
        method: "PUT",
        body: { id, settings },
      }),
      transformResponse: (response: ApiResponse<Device>) => {
        if (!response.data) {
          throw new Error("Failed to update device");
        }
        return parseDeviceFromDb(response.data);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Device", id },
        { type: "Device", id: "LIST" },
      ],
    }),

    deleteDevice: builder.mutation<void, number>({
      query: (id) => ({
        url: `/devices.php?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Device", id },
        { type: "Device", id: "LIST" },
      ],
    }),

    // Preset endpoints
    getPresets: builder.query<Preset[], void>({
      query: () => "/presets.php",
      transformResponse: (response: ApiResponse<Preset[]>) => {
        const presets = response.data || [];
        return presets.map(parsePresetFromDb);
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Preset" as const, id })),
            { type: "Preset", id: "LIST" },
          ]
          : [{ type: "Preset", id: "LIST" }],
      // Cache for 60 seconds
      keepUnusedDataFor: 60,
    }),

    createPreset: builder.mutation<
      Preset,
      Omit<Preset, "id" | "created_at" | "updated_at">
    >({
      query: (preset) => ({
        url: "/presets.php",
        method: "POST",
        body: preset,
      }),
      transformResponse: (response: ApiResponse<Preset>) => {
        if (!response.data) {
          throw new Error("Failed to create preset");
        }
        return parsePresetFromDb(response.data);
      },
      invalidatesTags: [{ type: "Preset", id: "LIST" }],
    }),

    deletePreset: builder.mutation<void, number>({
      query: (id) => ({
        url: `/presets.php?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Preset", id },
        { type: "Preset", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDevicesQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useGetPresetsQuery,
  useCreatePresetMutation,
  useDeletePresetMutation,
} = deviceApi;

