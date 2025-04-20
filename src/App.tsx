import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import LeadsPage from "./components/leads/LeadsPage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import { useAppContext } from "./context/AppContext";
import LoginScreen from "./components/auth/LoginScreen";

const App: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar active={true} />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/leads" replace />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/leads" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
