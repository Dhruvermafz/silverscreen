import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import NewItems from "./components/Home/NewItems";
import Contact from "./components/Contact/Contact";
import Profile from "./components/Profile/Profile";
import logo from "./logo.svg";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import ListComponent from "./components/Lists/ListWrapper";
import CatalogFilms from "./components/Catalog/CatalogFilms";
import GroupsPage from "./components/Groups/GroupsPage";
import GroupDetailPage from "./components/Groups/GroupDetailPage";
import MembersWrapper from "./components/Members/MembersWrapper";
import SettingsWrapper from "./components/Settings/SettingsWrapper";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<NewItems />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/u" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/lists" element={<ListComponent />} />
          <Route path="/films" element={<CatalogFilms />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/group/:id" element={<GroupDetailPage />} />
          <Route path="/members" element={<MembersWrapper />} />
          <Route path="/settings" element={<SettingsWrapper />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
