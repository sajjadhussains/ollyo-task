import fanIcon from "../assets/icons/fan-icon.png";
import lightIcon from "../assets/icons/light-icon.png";
import type { MenuItem } from "../types/device.types";

export const MENU_ITEMS: MenuItem[] = [
  { key: "1", label: "Light", icon: lightIcon },
  { key: "2", label: "Fan", icon: fanIcon },
];

export const DEVICE_TYPES = {
  LIGHT: "1",
  FAN: "2",
} as const;
