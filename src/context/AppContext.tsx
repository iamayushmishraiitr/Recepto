import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";

// --- Interfaces ---
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "Admin" | "Member" | "Removed"; // Role within the org
  lastActive: string; // Simplified
  // Stats (placeholders for now, need clarification on calculation)
  generated?: number;
  unlocked?: number;
  assignedLeadsCount?: number; // How many leads are assigned TO this user
}

export interface Lead {
  id: number;
  name: string; // Hidden for ReceptoNet until unlocked
  location: string;
  description: string;
  type: "ReceptoNet" | "OrgNetwork";
  source?: string; // Only OrgNetwork?
  time: string;
  groupName?: string; // Only OrgNetwork
  people?: string[]; // List of user IDs involved (Only OrgNetwork)
  score?: number | null;
  creditCost: number; // Random 0-3
  isUnlocked: boolean;
  assignedTo?: string | null; // User ID
  likeStatus?: "liked" | "disliked" | null;
}

interface OrganizationState {
  orgName: string;
  users: User[];
  leads: Lead[];
  credits: number;
}

interface AppContextType extends OrganizationState {
  currentUser: User | null; // Track logged-in user
  login: (username: string) => boolean; // Simple login for simulation
  logout: () => void; // Added logout function
  updateLead: (updatedLead: Lead) => void;
  unlockLead: (leadId: number) => boolean; // Returns true if successful
  assignLead: (leadId: number, userId: string) => void;
  likeLead: (leadId: number) => void;
  dislikeLead: (leadId: number) => void;
  updateUserRole: (userId: string, newRole: User["role"]) => void; // Added function
}

// --- Initial Mock Data (if localStorage is empty) ---
const initialMockUsers: User[] = [
  {
    id: "u1",
    name: "Anand Kumar",
    avatar: "https://media.istockphoto.com/id/1361217779/photo/portrait-of-happy-teenage-boy-at-park.jpg?s=612x612&w=0&k=20&c=yGHZLPu6UWwoj2wazbbepxmjl29MS1Hr2jV3N0FzjyI=",
    role: "Admin",
    lastActive: "Now",
    generated: 12,
    unlocked: 10,
    assignedLeadsCount: 5,
  },
  {
    id: "u2",
    name: "Olivia Rhye",
    avatar: "https://images.pexels.com/photos/1408978/pexels-photo-1408978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    role: "Member",
    lastActive: "2 min ago",
    generated: 123,
    unlocked: 123,
    assignedLeadsCount: 40,
  },
  {
    id: "u3",
    name: "Ayush Mishra",
    avatar: "https://images.pexels.com/photos/1408978/pexels-photo-1408978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    role: "Member",
    lastActive: "1 hr ago",
    generated: 56,
    unlocked: 56,
    assignedLeadsCount: 15,
  },
  {
    id: "u4",
    name: "Lana",
    avatar: "https://images.pexels.com/photos/1408978/pexels-photo-1408978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    role: "Removed",
    lastActive: "Yesterday",
    generated: 23,
    unlocked: 23,
    assignedLeadsCount: 25,
  },
];

const initialMockLeads: Lead[] = [
  // ReceptoNet Leads (Name hidden initially)
  {
    id: 1,
    name: "[Hidden] Tech Startup",
    location: "San Francisco, USA",
    description: "Seeking seed funding for innovative AI platform.",
    type: "ReceptoNet",
    time: "Found 1 hour ago",
    score: 92,
    creditCost: 2,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
  {
    id: 2,
    name: "[Hidden] E-commerce Brand",
    location: "London, UK",
    description: "Looking for marketing agency to scale operations.",
    type: "ReceptoNet",
    time: "Found 3 hours ago",
    score: 78,
    creditCost: 1,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
  // OrgNetwork Leads
  {
    id: 3,
    name: "Jennifer Markus",
    location: "Mumbai, India",
    description:
      "A team from Acme Corp is seeking a highly motivated Business Development Executive.",
    type: "OrgNetwork",
    source: "Orgs Network",
    time: "Today",
    groupName: "Sales Q2",
    people: ["u2", "u3"],
    score: 74,
    creditCost: 0,
    isUnlocked: true,
    assignedTo: "u2",
    likeStatus: "liked",
  }, // Example of unlocked, assigned, liked
  {
    id: 4,
    name: "Innovate Solutions",
    location: "Berlin, Germany",
    description:
      "Exploring partnership opportunities in the renewable energy sector.",
    type: "OrgNetwork",
    source: "Partner Web",
    time: "Yesterday",
    groupName: "BizDev",
    people: ["u3"],
    score: 65,
    creditCost: 1,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
  {
    id: 5,
    name: "Michael Chen",
    location: "Singapore",
    description:
      "Individual looking for SaaS solutions for project management.",
    type: "OrgNetwork",
    source: "LinkedIn",
    time: "Today",
    groupName: "Productivity Tools",
    people: ["u2"],
    score: 88,
    creditCost: 1,
    isUnlocked: false,
    assignedTo: null,
    likeStatus: null,
  },
];

const initialOrgState: OrganizationState = {
  orgName: "Default Corp",
  users: initialMockUsers,
  leads: initialMockLeads,
  credits: 100, // Starting credits
};

// --- LocalStorage Utilities ---
const LOCAL_STORAGE_KEY = "receptoOrgData";

const loadOrgData = (): OrganizationState => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      // Fallback to initial data if parsing fails
    }
  }
  // Initialize with mock data if nothing is stored
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialOrgState));
  return initialOrgState;
};

const saveOrgData = (state: OrganizationState) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

// --- Context Definition ---
const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Context Provider ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orgState, setOrgState] = useState<OrganizationState>(loadOrgData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Persist changes to localStorage whenever orgState changes
  useEffect(() => {
    saveOrgData(orgState);
  }, [orgState]);

  // Simple login simulation
  const login = useCallback(
    (username: string): boolean => {
      // In a real app, you'd check password too
      const user = orgState.users.find(
        (u) => u.name === username && u.role !== "Removed"
      );
      if (user) {
        setCurrentUser(user);
        console.log(`Logged in as ${user.name}`);
        return true;
      }
      // Don't alert here, handle error in the LoginScreen component
      return false;
    },
    [orgState.users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    console.log("Logged out");
    // Optionally clear localStorage or parts of it if needed,
    // but for multi-user simulation on same browser, we keep it.
  }, []);

  const updateLead = useCallback((updatedLead: Lead) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === updatedLead.id ? updatedLead : lead
      ),
    }));
  }, []);

  const unlockLead = useCallback(
    (leadId: number): boolean => {
      const leadToUnlock = orgState.leads.find((lead) => lead.id === leadId);
      if (!leadToUnlock || leadToUnlock.isUnlocked) return false;

      if (orgState.credits < leadToUnlock.creditCost) {
        alert("Not enough credits!");
        return false;
      }

      setOrgState((prevState) => {
        const newLeads = prevState.leads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                isUnlocked: true,
                name: lead.name.replace("[Hidden] ", ""),
              } // Reveal name
            : lead
        );
        return {
          ...prevState,
          leads: newLeads,
          credits: prevState.credits - leadToUnlock.creditCost,
        };
      });
      return true;
    },
    [orgState.credits, orgState.leads]
  );

  const assignLead = useCallback((leadId: number, userId: string) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === leadId ? { ...lead, assignedTo: userId } : lead
      ),
    }));
    // In a real app, you might update user stats here too
  }, []);

  const likeLead = useCallback((leadId: number) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === leadId ? { ...lead, likeStatus: "liked" } : lead
      ),
    }));
  }, []);

  const dislikeLead = useCallback((leadId: number) => {
    setOrgState((prevState) => ({
      ...prevState,
      leads: prevState.leads.map((lead) =>
        lead.id === leadId ? { ...lead, likeStatus: "disliked" } : lead
      ),
    }));
  }, []);

  // Function to update user role
  const updateUserRole = useCallback(
    (userId: string, newRole: User["role"]) => {
      // Prevent changing the logged-in user's role or removing them (simple guard)
      if (userId === currentUser?.id) {
        alert("You cannot change your own role.");
        return;
      }

      setOrgState((prevState) => ({
        ...prevState,
        users: prevState.users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        ),
        // Also unassign leads if user is removed
        leads:
          newRole === "Removed"
            ? prevState.leads.map((lead) =>
                lead.assignedTo === userId
                  ? { ...lead, assignedTo: null }
                  : lead
              )
            : prevState.leads,
      }));
    },
    [currentUser?.id]
  );

  const contextValue: AppContextType = {
    ...orgState,
    currentUser,
    login,
    logout,
    updateLead,
    unlockLead,
    assignLead,
    likeLead,
    dislikeLead,
    updateUserRole, // Added to context value
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// --- Custom Hook to use the Context ---
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
