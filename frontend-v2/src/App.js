import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import Sidebar from "./components/admin/Common/Sidebar";
// Renamed to avoid confusion
import CustomRouter from "./router/Router";
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        {isAdminRoute && <Sidebar />}
        <div className={isAdminRoute ? "content-with-sidebar" : "content-full"}>
          <CustomRouter />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
