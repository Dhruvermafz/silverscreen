import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import AppFooter from "./components/Common/Footer";
import HomeWrapper from "./components/Home/HomeWrapper";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import MovieWrapper from "./components/Movie/MovieWrapper";
import ListComponent from "./components/Lists/ListWrapper";
import MembersWrapper from "./components/Members/MembersWrapper";
import About from "./components/Common/About";
import Contact from "./components/Common/Contact";
import ProfileWrapper from "./components/Common/Profile";
import AddMovieRequest from "./components/Movie/MovieRequest";
import MoviePage from "./components/Movie/MoviePage";
import SettingsWrapper from "./components/Common/Settings";
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
            <Route path="/films" element={<MovieWrapper />} />
            <Route path="/lists" element={<ListComponent />} />
            <Route path="/members" element={<MembersWrapper />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/u/:id" element={<ProfileWrapper />} />

            <Route path="/movies/:id" element={<MoviePage />} />
            <Route path="/settings" element={<SettingsWrapper />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;
