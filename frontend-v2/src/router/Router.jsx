// src/routes/Router.jsx (or wherever your routes file is)

import React from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  useGetProfileQuery,
  useCompleteOnboardingMutation,
} from "../actions/userApi";
import { setOnboardingComplete } from "../actions/slices/authSlices";

// Components
import HomeWrapper from "../components/Home/HomeWrapper";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import Contact from "../components/Common/Contact";
import ProfileWrapper from "../components/Profile/ProfileWrapper";
import FilmWrapper from "../components/Films/FilmWrapper";
import ListWrapper from "../components/Lists/ListWrapper";
import Terms from "../components/Common/Terms";
import PrivacyPolicy from "../components/Common/PrivacyPolicy";
import About from "../components/Common/About";
import Faqs from "../components/Common/Faqs";
import Error404 from "../components/Common/Error404";
import MembersWrapper from "../components/Members/MembersWrapper";
import GroupsPage from "../components/Groups/GroupsPage";
import GroupDetailPage from "../components/Groups/GroupDetailPage";
import MoviePage from "../components/Movie/MoviePage";
import CategoriesPage from "../components/Films/CategoriesPage";
import SearchPage from "../components/Search/SearchWrapper";
import ActorProfile from "../components/Movie/ActorProfile";
import DirectorProfile from "../components/Movie/DirectorProfile";
import GenrePage from "../components/Films/GenreWrapper";
import OnboardingFlow from "../components/Onboarding/OnboardingFlow";

import PrivateRoute from "./PrivateRoute";

// Reusable Page Wrapper with Title (React 19 Native)
const Page = ({ title, children, requireAuth = false }) => {
  const fullTitle = title ? `${title} - DimeCine` : "DimeCine";

  const content = (
    <>
      <title>{fullTitle}</title>
      <meta
        name="description"
        content="DimeCine — Discover, discuss, and share your passion for cinema with a vibrant community of movie lovers."
      />
      {children}
    </>
  );

  return requireAuth ? <PrivateRoute>{content}</PrivateRoute> : content;
};

const Router = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userId, isAuthenticated } = useSelector((state) => state.auth);

  const { data: profile } = useGetProfileQuery(userId, {
    skip: !userId || !isAuthenticated,
  });

  const [completeOnboarding] = useCompleteOnboardingMutation();

  const handleOnboardingComplete = async () => {
    try {
      await completeOnboarding({
        userId,
        preferences: profile?.preferences || {},
        role: profile?.role || "viewer",
      }).unwrap();

      dispatch(setOnboardingComplete());
      localStorage.removeItem("cameFromSignup");
      navigate("/");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Page title="Home">
            <HomeWrapper />
          </Page>
        }
      />
      <Route
        path="/login"
        element={
          <Page title="Login">
            <Login />
          </Page>
        }
      />
      <Route
        path="/signup"
        element={
          <Page title="Sign Up">
            <Signup />
          </Page>
        }
      />
      <Route
        path="/contact"
        element={
          <Page title="Contact Us">
            <Contact />
          </Page>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Page title="Privacy Policy">
            <PrivacyPolicy />
          </Page>
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <Page title="Terms & Conditions">
            <Terms />
          </Page>
        }
      />
      <Route
        path="/about"
        element={
          <Page title="About">
            <About />
          </Page>
        }
      />
      <Route
        path="/faqs"
        element={
          <Page title="FAQs">
            <Faqs />
          </Page>
        }
      />
      <Route
        path="/categories"
        element={
          <Page title="Browse by Vibe">
            <CategoriesPage />
          </Page>
        }
      />
      <Route
        path="/search"
        element={
          <Page title="Search">
            <SearchPage />
          </Page>
        }
      />

      {/* Explore & Discovery (Public but enhanced when logged in) */}
      <Route
        path="/explore"
        element={
          <Page title="Explore Films">
            <FilmWrapper />
          </Page>
        }
      />
      <Route
        path="/movies/:id"
        element={
          <Page title="Movie">
            <MoviePage />
          </Page>
        }
      />
      <Route
        path="/actor/:id"
        element={
          <Page title="Actor">
            <ActorProfile />
          </Page>
        }
      />
      <Route
        path="/director/:id"
        element={
          <Page title="Director">
            <DirectorProfile />
          </Page>
        }
      />
      <Route
        path="/genres"
        element={
          <Page title="Genres">
            <GenrePage />
          </Page>
        }
      />
      <Route
        path="/members"
        element={
          <Page title="Community Members">
            <MembersWrapper />
          </Page>
        }
      />
      <Route
        path="/groups"
        element={
          <Page title="Groups">
            <GroupsPage />
          </Page>
        }
      />
      <Route
        path="/group/:groupId"
        element={
          <Page title="Group">
            <GroupDetailPage />
          </Page>
        }
      />

      {/* Authenticated Routes */}
      <Route
        path="/lists"
        element={
          <Page title="My Lists" requireAuth>
            <ListWrapper />
          </Page>
        }
      />
      <Route
        path="/u/:id"
        element={
          <Page title="Profile">
            <ProfileWrapper />
          </Page>
        }
      />

      {/* Onboarding Flow */}
      <Route
        path="/onboarding"
        element={
          <Page title="Welcome to DimeCine">
            <OnboardingFlow
              userId={userId}
              onComplete={handleOnboardingComplete}
            />
          </Page>
        }
      />

      {/* Catch-all 404 */}
      <Route
        path="*"
        element={
          <Page title="Page Not Found">
            <Error404 />
          </Page>
        }
      />
    </Routes>
  );
};

export default Router;
