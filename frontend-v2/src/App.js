import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import Sidebar from "./components/admin/Common/Sidebar";
import NewItems from "./components/Home/NewItems";
import Contact from "./components/Contact/Contact";
import Profile from "./components/Profile/Profile";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import ListComponent from "./components/Lists/ListWrapper";
import CatalogFilms from "./components/Catalog/CatalogFilms";
import GroupsPage from "./components/Groups/GroupsPage";
import GroupDetailPage from "./components/Groups/GroupDetailPage";
import MembersWrapper from "./components/Members/MembersWrapper";
import SettingsWrapper from "./components/Settings/SettingsWrapper";
import Privacy from "./components/Common/Privacy";
import FilmPage from "./components/Catalog/FilmPage";
import About from "./components/Common/About";
import AdminWrapper from "./components/admin/AdminWrapper";
import UserWrapper from "./components/admin/Users/UserWrapper";
import CommentWrapper from "./components/admin/Comment/CommentWrapper";
import CatalogWrapper from "./components/admin/Catalog/CatalogWrapper";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        {isAdminRoute && <Sidebar />}
        <div className={isAdminRoute ? "content-with-sidebar" : "content-full"}>
          <Routes>
            <Route path="/" element={<NewItems />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/u/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/lists" element={<ListComponent />} />
            <Route path="/films" element={<CatalogFilms />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/group/:id" element={<GroupDetailPage />} />
            <Route path="/members" element={<MembersWrapper />} />
            <Route path="/settings" element={<SettingsWrapper />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/film/:id" element={<FilmPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<AdminWrapper />} />
            <Route path="/admin/users" element={<UserWrapper />} />
            <Route path="/admin/comments" element={<CommentWrapper />} />
            <Route path="/admin/catalog" element={<CatalogWrapper />} />
          </Routes>
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
