import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import AppFooter from "./components/Common/Footer";
import HomeWrapper from "./components/Home/HomeWrapper";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
        <Navbar />
        <main className="p-4 flex-grow">
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;
