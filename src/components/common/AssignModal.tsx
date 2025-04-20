import React, { useState } from "react";
import { User } from "../../context/AppContext"; // Assuming User interface is exported
import "./AssignModal.css";

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[]; // List of users to assign to
  onAssign: (userId: string) => void;
  leadId: number; // To know which lead is being assigned
}

const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  onClose,
  users,
  onAssign,
  leadId,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleAssignClick = () => {
    if (selectedUserId) {
      onAssign(selectedUserId);
      onClose(); // Close modal after assigning
    } else {
      alert("Please select a user to assign.");
    }
  };

  // Filter out removed users and potentially the current user if needed
  const assignableUsers = users.filter((user) => user.role !== "Removed");

  return (
    <div className="modal-overlay" onClick={onClose}>
      {" "}
      {/* Close on overlay click */}
      <div
        className="modal-content assign-modal"
        onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Prevent closing on content click */}
        <h4>Assign Lead #{leadId}</h4>
        <div className="user-list">
          {assignableUsers.length > 0 ? (
            assignableUsers.map((user) => (
              <div
                key={user.id}
                className={`user-list-item ${
                  selectedUserId === user.id ? "selected" : ""
                }`}
                onClick={() => setSelectedUserId(user.id)}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                <span className="user-name">{user.name}</span>
                <span className="user-role">({user.role})</span>
              </div>
            ))
          ) : (
            <p>No assignable users found.</p>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAssignClick}
            disabled={!selectedUserId}>
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
