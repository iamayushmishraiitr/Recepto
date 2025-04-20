import React, { useState, useRef, useEffect } from "react";
import { useAppContext, Lead, User } from "../../context/AppContext"; // Import context and types
// import AssignModal from "../common/AssignModal"; // Remove old modal import
import AssignPopover from "../common/AssignPopover"; // Import the popover
import { FaTag } from "react-icons/fa"; // Import a tag icon
import "./LeadCard.css";

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const { users, unlockLead, assignLead, likeLead, dislikeLead } =
    useAppContext();
  // const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Remove old modal state
  const [isAssignPopoverOpen, setIsAssignPopoverOpen] = useState(false); // State for popover
  const assignButtonRef = useRef<HTMLButtonElement>(null); // Ref for the assign button

  const assignee = users.find((user) => user.id === lead.assignedTo);

  const handleUnlockClick = () => {
    if (window.confirm(`Unlock this lead for ${lead.creditCost} credits?`)) {
      unlockLead(lead.id);
    }
  };

  // This function is passed to the popover
  const handleAssign = (userId: string) => {
    assignLead(lead.id, userId);
    // Popover closes itself via its onClose prop after assignment
  };

  // Handler for the assign/reassign button click
  const handleAssignButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Prevent closing immediately if clicking outside logic catches the button click
    event.stopPropagation();
    setIsAssignPopoverOpen((prev) => !prev); // Toggle popover visibility
  };

  const getScoreColor = (score: number | null | undefined): string => {
    if (score === null || score === undefined) return "var(--mid-gray)"; // Default grey if no score
    if (score >= 70) return "var(--success-color)"; // Greenish (Using success color)
    if (score >= 0) return "#FFAA00"; // Orange (Ranges 0-69)
    // Handle potential edge cases if score can be negative?
    return "var(--mid-gray)";
  };

  const leadName =
    lead.type === "ReceptoNet" && !lead.isUnlocked
      ? "[Hidden Contact]"
      : lead.name;

  // Find user objects for the people list
  const peopleInvolved =
    lead.people
      ?.map((userId) => users.find((u) => u.id === userId))
      .filter((u): u is User => u !== undefined) || [];

  return (
    <>
      <div
        className={`lead-card card ${
          lead.type === "ReceptoNet" ? "receptonet-lead" : "orgnetwork-lead"
        }`}>
        <div className="lead-card-main">
          <div className="lead-card-avatar">
            <img
              src={
                lead.type === "OrgNetwork" && lead.people
                  ? "/user-avatar.jpg"
                  : "/company-icon.png"
              }
              alt={leadName}
            />
          </div>
          <div className="lead-card-content">
            <div className="lead-card-header">
              <div className="lead-card-info">
                <h3 className="lead-card-name">{leadName}</h3>
                <span className="lead-card-location text-sm text-gray">
                  {lead.location}
                </span>
              </div>
              {lead.type === "OrgNetwork" && lead.source && (
                <div className="lead-card-source text-sm text-gray">
                  {peopleInvolved.length > 0 && (
                    <div className="involved-avatars">
                      {peopleInvolved.slice(0, 3).map((person, index) => (
                        <img
                          key={person.id}
                          src={person.avatar}
                          alt={person.name}
                          title={person.name}
                          className="involved-avatar"
                          style={{ marginLeft: index > 0 ? "-8px" : "0" }} // Overlap effect
                        />
                      ))}
                      {peopleInvolved.length > 3 && (
                        <span className="involved-avatar-more">
                          +{peopleInvolved.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <span className="source-text">{lead.source}</span>
                </div>
              )}
            </div>
            <p className="lead-card-description text-md mt-2">
              {lead.description}
            </p>
            {lead.type === "OrgNetwork" && (
              <div className="org-specific-fields mt-2">
                {lead.groupName && (
                  <span className="group-tag text-sm">
                    <FaTag className="group-tag-icon" />
                    {lead.groupName}
                  </span>
                )}
              </div>
            )}
            <div className="lead-card-footer text-sm text-gray mt-2">
              <span>{lead.time}</span>
              {assignee && (
                <span
                  className="assigned-info"
                  title={`${assignee.name} - Assigned view`}>
                  Assigned to:
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="assignee-avatar"
                  />
                  {assignee.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="lead-card-actions">
          {lead.score !== null && lead.score !== undefined && (
            <div
              className="lead-score"
              style={{ backgroundColor: getScoreColor(lead.score) }}>
              {lead.score}
            </div>
          )}
          {!lead.isUnlocked ? (
            <button
              className="btn btn-secondary unlock-btn"
              onClick={handleUnlockClick}>
              Unlock Contact ({lead.creditCost} Cr)
            </button>
          ) : (
            <div className="unlocked-actions">
              <button
                ref={assignButtonRef} // Attach the ref here
                className="btn btn-secondary assign-btn"
                onClick={handleAssignButtonClick} // Use the new handler
                // disabled={!!lead.assignedTo} // Keep disabled logic for now, consider if reassign should always be possible
              >
                {lead.assignedTo ? "Reassign" : "Assign"}
              </button>
              <button
                className="btn btn-secondary view-details-btn"
                onClick={() => alert("View Details clicked (no action)")}>
                View Details
              </button>
            </div>
          )}
          <div className="action-buttons">
            <button
              className={`action-btn like-btn ${
                lead.likeStatus === "liked" ? "active" : ""
              }`}
              onClick={() => likeLead(lead.id)}
              disabled={lead.likeStatus === "liked"}
              title="Like">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2H7C6.20435 2 5.44129 2.31607 4.87868 2.87868C4.31607 3.44129 4 4.20435 4 5V14C4 14.473 4.10342 14.9402 4.3003 15.3713C4.49718 15.8024 4.78309 16.1874 5.13539 16.4999L10.2929 21.1249C10.4749 21.2897 10.7027 21.3886 10.9411 21.3983C11.1796 21.4081 11.4124 21.3279 11.5938 21.1749L17.5938 16.1749C17.8728 15.9427 18.0593 15.6239 18.1261 15.2749C18.1929 14.9259 18.1364 14.5659 17.9649 14.2529L14.9649 9.25291C14.8836 9.11783 14.775 9.00469 14.6475 8.92178C14.5199 8.83887 14.3772 8.78857 14.2299 8.77491"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={`action-btn dislike-btn ${
                lead.likeStatus === "disliked" ? "active" : ""
              }`}
              onClick={() => dislikeLead(lead.id)}
              disabled={lead.likeStatus === "disliked"}
              title="Dislike">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22H17C17.7956 22 18.5587 21.6839 19.1213 21.1213C19.6839 20.5587 20 19.7956 20 19V10C20 9.52705 19.8966 9.05978 19.6997 8.62871C19.5028 8.19764 19.2169 7.81258 18.8646 7.50014L13.7071 2.87514C13.5251 2.71031 13.2973 2.61139 13.0589 2.60166C12.8204 2.59193 12.5876 2.67212 12.4062 2.82514L6.40625 7.82514C6.12719 8.05726 5.94071 8.3761 5.8739 8.72514C5.80709 9.07419 5.86357 9.43413 6.03509 9.74714L9.03509 14.7471C9.11643 14.8822 9.22504 14.9953 9.35258 15.0782C9.48012 15.1611 9.62281 15.2114 9.7701 15.2251"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Render AssignPopover instead of AssignModal */}
      <AssignPopover
        isOpen={isAssignPopoverOpen}
        onClose={() => setIsAssignPopoverOpen(false)}
        users={users}
        onAssign={handleAssign}
        leadId={lead.id}
        targetElement={assignButtonRef.current} // Pass the button element
      />
    </>
  );
};

export default LeadCard;
