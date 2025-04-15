import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import AppFooter from "./components/Common/Footer";
import HomeWrapper from "./components/Home/HomeWrapper";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import MovieWrapper from "./components/Movie/MovieWrapper";

function App() {
  return (
    <Router>
      <div className="bg-dark text-gray-300 min-h-screen flex flex-col">
        <Navbar />
        <main className="p-8 flex-grow page-container">
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/movies/:id" element={<MovieWrapper />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;
