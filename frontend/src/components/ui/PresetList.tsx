import type { Preset } from "../../lib/api";

interface PresetListProps {
    presets: Preset[];
    lightIcon: string;
    fanIcon: string;
    onDragStart: (e: React.DragEvent, preset: Preset) => void;
    onDelete: (id: number) => void;
}

export const PresetList = ({
    presets,
    lightIcon,
    fanIcon,
    onDragStart,
    onDelete,
}: PresetListProps) => {
    if (presets.length === 0) {
        return (
            <div className="saved-presets">
                <p className="sidebar-title">Saved Presets</p>
                <div className="noting-added">
                    <span>Nothing Added Yet</span>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-presets-container">
            <h2 className="sidebar-title preset-title">
                Presets
            </h2>

            <ul className="menu-vertical">
                {presets.map((preset) => (
                    <li
                        key={preset.id}
                        className="menu-item preset-item"
                        draggable
                        onDragStart={(e) => onDragStart(e, preset)}
                    >
                        {/* Device Icon Logic */}
                        <img
                            src={preset.devices?.[0]?.type === "1" ? lightIcon : fanIcon}
                            alt={
                                preset.devices?.[0]?.type === "1" ? "Light Device" : "Fan Device"
                            }
                            className="menu-item-icon"
                        />

                        <span className="preset-name">{preset.name}</span>
                        <button
                            className="preset-delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (
                                    preset.id &&
                                    window.confirm(`Delete preset "${preset.name}"?`)
                                ) {
                                    onDelete(preset.id);
                                }
                            }}
                            title="Delete preset"
                            aria-label={`Delete preset ${preset.name}`}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
