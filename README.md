# Ollyo Task - Device Control & Preset Management System

A full-stack web application for managing IoT devices (Lights and Fans) with preset configurations. Built with React + TypeScript frontend and PHP REST API backend.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Algorithm & Data Flow](#algorithm--data-flow)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)

## ✨ Features

- **Device Management**: Drag and drop devices (Light/Fan) onto canvas
- **Device Control**: 
  - Light: Power, Brightness, Color Temperature (Warm, Cool, Daylight, Red, Green, Blue)
  - Fan: Power, Speed control
- **Preset Management**: 
  - Save current device configuration as preset
  - Load presets by dragging to canvas
  - Delete presets
  - Duplicate name validation (case-insensitive)
- **Real-time Visual Feedback**: Animated device visuals based on settings
- **Responsive Design**: Mobile-friendly interface

## 🚀 Prerequisites

- **Node.js** (v16 or higher)
- **PHP** (v7.4 or higher)
- **MySQL** (v5.7 or higher)
- **npm** or **yarn**

## 🏃 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ollyo-task
```

### 2. Database Setup

#### Create Database
```bash
mysql -u root -p
CREATE DATABASE ollyo_task;
exit;
```

#### Configure Database Credentials
Edit `backend/config/db.config.php`:
```php
return [
    'host' => 'localhost',
    'port' => '3306',
    'database' => 'ollyo_task',
    'username' => 'root',
    'password' => 'your_password',
];
```

#### Import Schema
```bash
mysql -u root -p ollyo_task < backend/schema.sql
```

### 3. Start Backend Server

```bash
cd backend
php -S 0.0.0.0:8000
```

The backend will run on `http://localhost:8000`

### 4. Start Frontend Development Server

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5000` (or the port shown in terminal)

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
ollyo-task/
├── backend/
│   ├── api/
│   │   ├── devices.php          # Device CRUD endpoints
│   │   └── presets.php           # Preset CRUD endpoints
│   ├── config/
│   │   ├── database.php         # Database connection class
│   │   └── db.config.php        # Database configuration
│   ├── schema.sql               # Database schema
│   └── README.md               # Backend setup guide
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── devices/         # Device components (Fan, Light)
│   │   │   ├── layout/          # Layout components
│   │   │   └── ui/              # UI components (Modal, Toast, etc.)
│   │   ├── contexts/
│   │   │   └── DeviceContext.tsx # Global state management
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/
│   │   │   └── api.ts           # API service layer
│   │   ├── utils/
│   │   │   └── deviceNormalizer.ts # Device normalization helper
│   │   ├── types/               # TypeScript type definitions
│   │   ├── constants/           # Application constants
│   │   └── styles/              # CSS files
│   ├── package.json
│   └── vite.config.ts          # Vite configuration with proxy
│
└── README.md
```

## 🔄 Algorithm & Data Flow

### Preset Save Flow

```
1. User configures device (power, speed/brightness, colorTemp)
2. User clicks "Save Preset" button
3. Modal opens for preset name input
4. User enters name and clicks "Save"
5. Frontend:
   - Validates preset name
   - Normalizes device type (case-insensitive)
   - Creates device configuration object with current settings
   - Calls API: POST /api/presets.php
6. Backend:
   - Validates input (name, devices)
   - Checks for duplicate name (case-insensitive)
   - Normalizes device settings with defaults
   - Stores in database (presets table)
   - Returns created preset
7. Frontend:
   - Updates DeviceContext state
   - Shows success toast
   - Refreshes preset list in sidebar
```

### Preset Load Flow

```
1. User drags preset from sidebar
2. Drop event on canvas
3. Frontend:
   - Extracts preset data from drag event
   - Parses preset JSON
   - Normalizes device type from preset
   - Finds matching MenuItem for device type
   - Sets droppedItem state
   - Updates device settings from preset
   - Renders device with preset configuration
4. Device component receives settings and displays accordingly
```

### Device State Management Flow

```
1. Device dropped on canvas
2. useDeviceState hook initializes with default settings:
   - Light: {power: false, brightness: 50, colorTemp: 'warm'}
   - Fan: {power: false, speed: 50}
3. User interactions update state:
   - Toggle power → updates power state
   - Slider change → updates speed/brightness
   - Color selection → updates colorTemp
4. State changes trigger re-renders:
   - Visual effects update (fan rotation, light glow)
   - Control panel reflects current state
5. On preset save: current state serialized to JSON
```

### Data Normalization Algorithm

```typescript
function normalizeDevice(device):
  1. Extract device type
  2. Convert to lowercase for comparison
  3. Map to normalized type:
     - "light" or "1" → DEVICE_TYPES.LIGHT
     - "fan" or "2" → DEVICE_TYPES.FAN
  4. Get default settings based on type
  5. Merge provided settings with defaults
  6. Return normalized device object
```

## 🎨 Frontend Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              React Application                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ DeviceContext│      │  Components  │        │
│  │  (State Mgmt) │◄─────┤  (UI Layer)  │        │
│  └──────┬───────┘      └──────┬───────┘        │
│         │                     │                 │
│         │                     │                 │
│         ▼                     ▼                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │  API Service │      │ Custom Hooks │        │
│  │   (lib/api)  │      │  (Business   │        │
│  └──────┬───────┘      │    Logic)    │        │
│         │              └──────────────┘        │
│         │                                      │
│         ▼                                      │
│  ┌──────────────────────────────────────┐    │
│  │      PHP REST API (Backend)           │    │
│  └──────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
└── DeviceProvider (Context)
    └── MainLayout
        ├── Sidebar
        │   ├── Device Menu Items
        │   └── PresetList (Reusable component)
        ├── Header
        │   ├── Title
        │   ├── Save/Clear Actions
        │   └── Device Menu (mobile)
        ├── DeviceCanvas
        │   ├── FanDevice (when Fan dropped)
        │   │   └── ControlPanel
        │   └── LightDevice (when Light dropped)
        │       ├── Color Options
        │       └── ControlPanel
        ├── Modal (Preset Name Input)
        └── Toast (Notifications)
```

### State Management

#### React Context API
- **DeviceContext**: Global state for devices and presets
  - `devices`: Array of all devices
  - `presets`: Array of all presets
  - `loading`: Loading state
  - `error`: Error messages
  - Methods: `addPreset`, `deletePreset`, `refreshPresets`, etc.

#### Local State (Custom Hooks)
- **useDeviceState**: Device settings (power, speed, brightness, colorTemp)
- **useDragAndDrop**: Drag and drop state (draggedItem, droppedItem)
- **usePresetOperations**: Preset logic (save, delete, drop)
- **useModal**: Modal visibility and input state
- **useToast**: Toast notification state

### Key Components

#### 1. DeviceContext (`contexts/DeviceContext.tsx`)
- Provides global state management
- Handles API calls for devices and presets
- Auto-refreshes on mount
- Error handling and loading states

#### 2. MainLayout (`components/layout/MainLayout.tsx`)
- Main container component
- Orchestrates all interactions
- Handles preset save/load/delete
- Manages device state and drag-drop

#### 3. Device Components
- **FanDevice**: Fan visualization with rotation animation
- **LightDevice**: Light visualization with glow effects
- Both use `ControlPanel` for unified controls
- Responsive design adapts to mobile screens

#### 4. PresetList (`components/ui/PresetList.tsx`)
- Reusable component for displaying saved presets
- Handles preset drag-start and delete events
- Responsive layout (Sidebar on desktop, Top bar on mobile)
- Hover effects for delete actions

#### 5. usePresetOperations (`hooks/usePresetOperations.ts`)
- Custom hook encapsulating all preset-related logic
- Handles API calls (save, delete) and state updates
- Manages drag-and-drop logic for presets
- Improves code separation in MainLayout

#### 6. API Service Layer (`lib/api.ts`)
- Type-safe API functions
- Error handling
- JSON parsing/stringification
- Base URL configuration

#### 7. Device Normalizer (`utils/deviceNormalizer.ts`)
- Case-insensitive device type comparison
- Default settings application
- Database JSON parsing helpers

### Data Flow Patterns

1. **Unidirectional Data Flow**: 
   - Props down, events up
   - Context provides global state
   - Local hooks manage component-specific state

2. **Event-Driven Updates**:
   - User interactions trigger state updates
   - State changes trigger re-renders
   - API calls update context state

3. **Normalization Layer**:
   - All device data normalized before storage
   - Consistent data format across application
   - Type safety with TypeScript

## 🔧 Backend Architecture

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         Client (Frontend)               │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
               │ (JSON)
               ▼
┌─────────────────────────────────────────┐
│      PHP REST API Layer                  │
│  ┌──────────────┐  ┌──────────────┐     │
│  │ devices.php  │  │ presets.php  │     │
│  └──────┬───────┘  └──────┬───────┘     │
│         │                 │              │
│         └────────┬────────┘             │
│                  │                      │
│                  ▼                      │
│         ┌─────────────────┐            │
│         │  Database Class  │            │
│         │  (PDO Wrapper)   │            │
│         └────────┬─────────┘            │
└──────────────────┼─────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │   MySQL Database │
         │  - devices table │
         │  - presets table │
         └─────────────────┘
```

### API Endpoints

#### Devices API (`/api/devices.php`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/devices.php` | Fetch all devices |
| POST | `/api/devices.php` | Create new device |
| PUT | `/api/devices.php` | Update device settings |
| DELETE | `/api/devices.php?id=X` | Delete device |

#### Presets API (`/api/presets.php`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/presets.php` | Fetch all presets |
| POST | `/api/presets.php` | Create new preset |
| DELETE | `/api/presets.php?id=X` | Delete preset |

### Request/Response Format

**Request (POST /api/presets.php):**
```json
{
  "name": "My Preset",
  "devices": [
    {
      "type": "1",
      "name": "Light",
      "settings": {
        "power": true,
        "brightness": 75,
        "colorTemp": "warm"
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "My Preset",
    "devices": "[{\"type\":\"1\",\"name\":\"Light\",\"settings\":{...}}]",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### Database Schema

#### Devices Table
```sql
CREATE TABLE devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Presets Table
```sql
CREATE TABLE presets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    devices JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Backend Components

#### 1. Database Class (`config/database.php`)
- PDO-based database connection
- Configuration loading (env vars → config file → defaults)
- Error handling with JSON responses
- Connection pooling ready

#### 2. API Endpoints
- **CORS enabled**: Allows cross-origin requests
- **JSON responses**: Consistent response format
- **Error handling**: Proper HTTP status codes
- **Input validation**: Required field checks
- **Duplicate prevention**: Case-insensitive name validation

#### 3. Security Features
- Prepared statements (SQL injection prevention)
- Input validation
- Error message sanitization
- CORS configuration

## 📡 API Documentation

### Create Preset

**Endpoint:** `POST /api/presets.php`

**Request Body:**
```json
{
  "name": "string (required, unique)",
  "devices": [
    {
      "type": "string (required)",
      "name": "string (required)",
      "settings": {
        "power": "boolean",
        "brightness": "number (0-100, for Light)",
        "colorTemp": "string (for Light)",
        "speed": "number (0-100, for Fan)"
      }
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { /* preset object */ }
}
```

**Error Responses:**
- `400`: Missing required fields
- `409`: Duplicate preset name
- `500`: Server error

### Get All Presets

**Endpoint:** `GET /api/presets.php`

**Response:**
```json
{
  "success": true,
  "data": [ /* array of presets */ ]
}
```

### Delete Preset

**Endpoint:** `DELETE /api/presets.php?id={preset_id}`

**Response:**
```json
{
  "success": true,
  "message": "Preset deleted"
}
```

## ⚙️ Configuration

### Frontend Configuration

**Vite Proxy** (`frontend/vite.config.ts`):
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

### Backend Configuration

**Database Config** (`backend/config/db.config.php`):
```php
return [
    'host' => 'localhost',
    'port' => '3306',
    'database' => 'ollyo_task',
    'username' => 'root',
    'password' => 'your_password',
];
```

**Environment Variables** (optional, takes priority):
```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=ollyo_task
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
```

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
php -S 0.0.0.0:8000
```

### Building for Production
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## 📝 Notes

- **Device Types**: Normalized with case-insensitive comparison
- **Default Settings**: 
  - Light: `{power: false, brightness: 50, colorTemp: 'warm'}`
  - Fan: `{power: false, speed: 50}`
- **Preset Names**: Must be unique (case-insensitive validation)
- **CORS**: Enabled for all origins (configure for production)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `backend/config/db.config.php`
- Ensure database exists: `SHOW DATABASES;`
- Verify tables exist: `SHOW TABLES FROM ollyo_task;`

### API Connection Issues
- Verify backend is running on port 8000
- Check Vite proxy configuration
- Verify CORS headers in API responses

### Frontend Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v16+)

## 📄 License

This project is part of an interview task.
