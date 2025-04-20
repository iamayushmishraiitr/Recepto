import React from "react";
import "./LogoutConfirmModal.css";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose(); // Close after confirming
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content logout-confirm-modal"
        onClick={(e) => e.stopPropagation()}>
        <h4>Confirm Logout</h4>
        <p>Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-danger" // Use danger style for logout confirmation
            onClick={handleConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
