import React, { useState } from "react";
import LeadCard from "./LeadCard";
import FiltersPanel from "../common/FiltersPanel";
import { useAppContext, Lead } from "../../context/AppContext"; // Import context and Lead type
import { Filters } from "../common/filterUtils"; // Import Filters interface
import "./LeadsPage.css";

// Mock data for leads - REMOVED, now using context
/*
const mockLeads = [
  {
    id: 1,
    name: "Jennifer Markus",
    location: "Mumbai, India",
    description:
      'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business deals.',
    type: "user" as const, // user or company
    source: "Orgs Network",
    time: "Today",
    groupName: "Group name",
    score: 74,
  },
  {
    id: 2,
    name: "Jennifer Markus",
    location: "Mumbai, India",
    description:
      'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business deals.',
    type: "user" as const,
    source: "Orgs Network",
    time: "Today",
    groupName: "Group name",
    score: 74,
  },
  {
    id: 3,
    name: "Jennifer",
    location: "Mumbai, India",
    description: "Looking for network opportunities and partnerships",
    type: "company" as const,
    time: "Found 2 hour",
    score: null,
  },
  {
    id: 4,
    name: "Jennifer Markus",
    location: "Mumbai, India",
    description:
      'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business deals.',
    type: "user" as const,
    time: "Today",
    score: null,
  },
  {
    id: 5,
    name: "Jennifer",
    location: "Mumbai, India",
    description: "Looking for network opportunities and partnerships",
    type: "company" as const,
    time: "Found 2 hour",
    score: null,
  },
];
*/

// Define the Filters interface used locally in LeadsPage - REMOVED
/*
interface Filters {
  location: string[];
  scoreRange: string | null; // Keep for local filter state management
}
*/

const LeadsPage: React.FC = () => {
  const { leads } = useAppContext(); // Get leads from context
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    location: [],
    scoreRange: null, // Use scoreRange here
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = (filters: Filters) => {
    setSelectedFilters(filters);
    setShowFilters(false);
  };

  // Filter the leads based on selected filters
  const filteredLeads = leads.filter((lead) => {
    // Use leads from context
    let locationMatch = true;
    if (selectedFilters.location.length > 0) {
      // Match if any part of the location string is included in the selected locations
      // This is a basic match, might need refinement based on exact location format
      locationMatch = selectedFilters.location.some((loc) =>
        lead.location.includes(loc)
      );
    }

    let scoreMatch = true;
    if (selectedFilters.scoreRange !== null) {
      if (lead.score === null || lead.score === undefined) {
        scoreMatch = false; // Exclude leads with no score if a score filter is active
      } else if (selectedFilters.scoreRange === "ge70") {
        scoreMatch = lead.score >= 70;
      } else if (selectedFilters.scoreRange === "lt70") {
        scoreMatch = lead.score < 70;
      }
    }

    return locationMatch && scoreMatch;
  });

  const appliedFilterCount =
    (selectedFilters.location.length > 0 ? 1 : 0) +
    (selectedFilters.scoreRange !== null ? 1 : 0);

  return (
    <div className="leads-page">
      <div className="leads-header">
        <div className="filters-button-container">
          <button
            className="btn btn-secondary filters-button"
            onClick={toggleFilters}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Filters</span>
            {/* Calculate count based on actual applied filters */}
            {appliedFilterCount > 0 && (
              <span className="filters-count">{appliedFilterCount}</span>
            )}
          </button>

          {showFilters && (
            <FiltersPanel
              selectedFilters={selectedFilters}
              onApply={applyFilters}
              onCancel={() => setShowFilters(false)}
            />
          )}
        </div>
      </div>

      <div className="leads-list">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        ) : (
          <p className="no-leads-message">
            No leads match the current filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
