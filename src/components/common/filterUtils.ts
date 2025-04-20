// src/components/common/filterUtils.ts

// Define the shape of the filters object used across components
export interface Filters {
  location: string[];
  scoreRange: string | null; // Use string IDs like 'gt70', 'lt70'
}

// Define available filter options
export const filterOptions = {
  location: [
    { id: 'india', name: 'India' },
    { id: 'uk', name: 'United Kingdom' },
    { id: 'usa', name: 'United States of America' },
    { id: 'saudi', name: 'Saudi Arabia' },
    { id: 'singapore', name: 'Singapore' },
    { id: 'taiwan', name: 'Taiwan' },
    { id: 'france', name: 'France' },
    { id: 'germany', name: 'Germany' },
    { id: 'china', name: 'China' },
    // Add other potential locations if needed from mock data
    { id: 'san_francisco_usa', name: 'San Francisco, USA'}, 
    { id: 'london_uk', name: 'London, UK'}, 
    { id: 'mumbai_india', name: 'Mumbai, India'},
    { id: 'berlin_germany', name: 'Berlin, Germany'},
  ],
  scoreRange: [
    { id: 'ge70', name: '70+'}, // Greenish score range
    { id: 'lt70', name: '< 70'}, // Orange score range
  ],
}; 