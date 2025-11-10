import "../../styles/Modal.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  value: string;
  onValueChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const Modal = ({
  isOpen,
  title,
  value,
  onValueChange,
  onSave,
  onCancel,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter preset name"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              autoFocus
            />
            <p className="form-hint">
              By adding this effect as a preset you can reuse this anytime.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-save"
            onClick={onSave}
            disabled={value.trim() === ""}
          >
            Save Preset
          </button>
        </div>
      </div>
    </div>
  );
};
