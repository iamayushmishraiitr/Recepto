import React, { useState, useEffect } from "react";
import "./FiltersPanel.css";
import { Filters, filterOptions } from "./filterUtils"; // Import from util file

interface FiltersPanelProps {
  selectedFilters: Filters;
  onApply: (filters: Filters) => void;
  onCancel: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  selectedFilters,
  onApply,
  onCancel,
}) => {
  const [activeFilterTab, setActiveFilterTab] =
    useState<keyof Filters>("location");
  const [currentFilters, setCurrentFilters] =
    useState<Filters>(selectedFilters);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Reset local state when selectedFilters prop changes (e.g., panel reopens)
    setCurrentFilters(selectedFilters);
    setSearchQuery(""); // Reset search on tab change or reopen
  }, [selectedFilters]);

  useEffect(() => {
    setSearchQuery(""); // Reset search when filter tab changes
  }, [activeFilterTab]);

  const handleLocationCheckboxChange = (value: string) => {
    const currentLocations = currentFilters.location || [];
    const newLocations = currentLocations.includes(value)
      ? currentLocations.filter((loc) => loc !== value)
      : [...currentLocations, value];
    setCurrentFilters({ ...currentFilters, location: newLocations });
  };

  const handleScoreChange = (value: string | null) => {
    // For simplicity, allow only one score filter active at a time
    setCurrentFilters({ ...currentFilters, scoreRange: value });
  };

  const handleApply = () => {
    onApply(currentFilters);
  };

  const getAppliedCount = (filterType: keyof Filters): number => {
    if (filterType === "location") {
      return currentFilters.location?.length || 0;
    }
    if (filterType === "scoreRange") {
      return currentFilters.scoreRange !== null ? 1 : 0;
    }
    return 0;
  };

  const totalAppliedCount =
    getAppliedCount("location") + getAppliedCount("scoreRange");

  const filteredLocations = filterOptions.location.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="filters-panel card">
      <div className="filters-header">
        <h4>Filters</h4>
        {totalAppliedCount > 0 && (
          <span className="filters-applied-total">
            {totalAppliedCount} applied
          </span>
        )}
      </div>
      <div className="filters-body">
        <div className="filters-sidebar">
          <button
            className={`filter-tab ${
              activeFilterTab === "location" ? "active" : ""
            }`}
            onClick={() => setActiveFilterTab("location")}>
            Location{" "}
            {getAppliedCount("location") > 0 && (
              <span className="applied-count">
                {getAppliedCount("location")}
              </span>
            )}
          </button>
          <button
            className={`filter-tab ${
              activeFilterTab === "scoreRange" ? "active" : ""
            }`}
            onClick={() => setActiveFilterTab("scoreRange")}>
            Score{" "}
            {getAppliedCount("scoreRange") > 0 && (
              <span className="applied-count">
                {getAppliedCount("scoreRange")}
              </span>
            )}
          </button>
        </div>
        <div className="filters-content">
          {activeFilterTab === "location" && (
            <div className="filter-section">
              <h5>
                Location{" "}
                {getAppliedCount("location") > 0 && (
                  <span className="applied-count-header">
                    {getAppliedCount("location")} applied
                  </span>
                )}
              </h5>
              <div className="filter-search">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="#8F9BB3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="#8F9BB3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="filter-search-input form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="filter-search-clear"
                    onClick={() => setSearchQuery("")}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 6L6 18"
                        stroke="#8F9BB3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 6L18 18"
                        stroke="#8F9BB3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="filter-options-grid">
                {filteredLocations.map((option) => (
                  <div
                    key={option.id}
                    className="filter-option checkbox-option">
                    <input
                      type="checkbox"
                      id={`loc-${option.id}`}
                      checked={
                        currentFilters.location?.includes(option.name) || false
                      }
                      onChange={() => handleLocationCheckboxChange(option.name)}
                    />
                    <label htmlFor={`loc-${option.id}`}>{option.name}</label>
                  </div>
                ))}
                {filteredLocations.length === 0 && (
                  <p className="text-sm text-gray">
                    No locations match your search.
                  </p>
                )}
              </div>
            </div>
          )}
          {activeFilterTab === "scoreRange" && (
            <div className="filter-section">
              <h5>
                Score{" "}
                {getAppliedCount("scoreRange") > 0 && (
                  <span className="applied-count-header">
                    {getAppliedCount("scoreRange")} applied
                  </span>
                )}
              </h5>
              <p className="text-sm text-gray mb-2">Select score range:</p>
              <div className="filter-options-list">
                {" "}
                {/* Use list for radio buttons */}
                {/* Option to clear score filter */}
                <div className="filter-option radio-option">
                  <input
                    type="radio"
                    id="score-any"
                    name="scoreRange"
                    checked={currentFilters.scoreRange === null}
                    onChange={() => handleScoreChange(null)}
                  />
                  <label htmlFor="score-any">Any Score</label>
                </div>
                {filterOptions.scoreRange.map((option) => (
                  <div key={option.id} className="filter-option radio-option">
                    <input
                      type="radio"
                      id={`score-${option.id}`}
                      name="scoreRange" // Same name groups radio buttons
                      value={option.id}
                      checked={currentFilters.scoreRange === option.id}
                      onChange={() => handleScoreChange(option.id)}
                    />
                    <label htmlFor={`score-${option.id}`}>{option.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="filters-footer">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersPanel;
