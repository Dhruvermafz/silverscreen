import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetProfileQuery,
  useCompleteOnboardingMutation,
} from "./actions/userApi";

import Header from "./components/Common/Header";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ListWrapper from "./components/Lists/ListWrapper";
import MobileHeader from "./components/Common/MobileHeader";
import Contact from "./components/Common/Contact";
import ProfileWrapper from "./components/Profile/ProfileWrapper";
import OnboardingFlow from "./components/Onboarding/OnboardingFlow";
import FilmWrapper from "./components/Films/FilmWrapper";
import { setOnboardingComplete } from "./actions/slices/authSlices";
import HomeWrapper from "./components/Home/HomeWrapper";
import Footer from "./components/Common/Footer";
import Preloader from "./components/Common/Preloader";
import Terms from "./components/Common/Terms";
import Error404 from "./components/Common/Error404";
import PrivacyPolicy from "./components/Common/PrivacyPolicy";
import MembersWrapper from "./components/Members/MembersWrapper";
import GroupsPage from "./components/Groups/GroupsPage";
import BoxOfficeWrapper from "./components/BoxOffice/BoxOfficeWrapper";
import MoviePage from "./components/Movie/MoviePage";
import GenrePage from "./components/Films/GenreWrapper";
import GroupDetailPage from "./components/Groups/GroupDetailPage";
import SearchPage from "./components/Search/SearchWrapper";
import About from "./components/Common/About";
import Faqs from "./components/Common/Faqs";
import ActorProfile from "./components/Movie/ActorProfile";
import DirectorProfile from "./components/Movie/DirectorProfile";
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, isAuthenticated, role, cameFromSignup } = useSelector(
    (state) => state.auth
  );
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery(
    userId,
    {
      skip: !userId || !isAuthenticated,
    }
  );
  const [completeOnboarding] = useCompleteOnboardingMutation();
  const token = localStorage.getItem("token");
  console.log(token);
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!isAuthenticated || !token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Onboarding route for first-time joiners
  const OnboardingRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!isAuthenticated || !token) {
      return <Navigate to="/login" replace />;
    }
    if (profileLoading) {
      return null; // Wait for profile data
    }
    // Check if first-time joiner: empty preferences and default role
    const isFirstTimeJoiner =
      (!profile?.preferences ||
        (profile.preferences.genres.length === 0 &&
          profile.preferences.cinemas.length === 0 &&
          profile.preferences.contentPreferences.length === 0 &&
          profile.preferences.languages.length === 0)) &&
      profile?.role === "viewer" &&
      cameFromSignup;
    if (!isFirstTimeJoiner) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // Admin check
  const isAdmin = () => role === "admin";
  return (
    <main class="wrapper sb-default">
      <Header />

      <div class="mn-main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/box-office" element={<BoxOfficeWrapper />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/about" element={<About />} />
          {/* Protected Routes */}
          <Route path="/explore" element={<FilmWrapper />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/lists" element={<ListWrapper />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/group/:groupId" element={<GroupDetailPage />} />
          <Route path="/u/:id" element={<ProfileWrapper />} />
          <Route path="/members" element={<MembersWrapper />} />
          {/* Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              <OnboardingFlow
                userId={userId}
                onComplete={() => {
                  completeOnboarding({
                    userId,
                    preferences: profile?.preferences || {},
                    role: profile?.role || "viewer",
                  })
                    .unwrap()
                    .then(() => {
                      dispatch(setOnboardingComplete());
                      localStorage.removeItem("cameFromSignup");
                      navigate("/");
                    })
                    .catch((error) => {
                      console.error("Failed to complete onboarding:", error);
                    });
                }}
              />
            }
          />

          <Route path="/actor/:id" element={<ActorProfile />} />
          <Route path="/director/:id" element={<DirectorProfile />} />
          <Route path="/genres" element={<GenrePage />} />
          <Route path="/faqs" element={<Faqs />} />
          {/* 404 Route */}
          <Route path="*" element={<Error404 />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>

      <Footer />
    </main>
  );
}

export default App;
