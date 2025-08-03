import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import GroupsPage from "./components/Groups/GroupsPage";
import GroupDetailPage from "./components/Groups/GroupDetailPage";
import NewsroomDetailPage from "./components/NewsRooms/NewsroomDetailPage";
import NewsroomPage from "./components/NewsRooms/NewsroomPage";
import AdminWrapper from "./components/admin/AdminWrapper";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import FlagSubmission from "./components/flag-system/FlagSubmission";
import { setOnboardingComplete } from "./actions/slices/authSlices";
import {
  useGetProfileQuery,
  useCompleteOnboardingMutation,
} from "./actions/userApi";
import FlagDashboard from "./components/flag-system/FlagDashbaord";
import UserWrapper from "./components/admin/Users/UserWrapper";
import TermsAndPrivacy from "./components/Common/TermsAndPrivacy";
import BoxOfficeWrapper from "./components/BoxOffice/BoxOfficeWrapper";
import FilmWrapper from "./components/admin/Catalog/FilmWrapper";
import TrendingMovies from "./components/Home/TrendingMovies";
import GenreMovies from "./components/Home/GenreMovies";
import ReviewWrapper from "./components/admin/Reviews/ReviewsWrapper";
import FindABug from "./components/Common/FindABug";
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
    <div className="bg-dark text-gray-300 min-h-screen flex flex-col">
      <Navbar />

      <main className="p-8 flex-grow page-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<TermsAndPrivacy />} />
          {/* Protected Routes */}
          <Route path="/films" element={<MovieWrapper />} />
          <Route path="/lists" element={<ListComponent />} />
          <Route path="/members" element={<MembersWrapper />} />
          <Route path="/u/:id" element={<ProfileWrapper />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/group/:groupId" element={<GroupDetailPage />} />
          <Route path="/newsrooms" element={<NewsroomPage />} />
          <Route path="/newsrooms/:id" element={<NewsroomDetailPage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/movies/trending" element={<TrendingMovies />} />
          <Route path="/movies/genre/:genreId" element={<GenreMovies />} />
          <Route path="/settings" element={<SettingsWrapper />} />
          <Route path="/movie-request" element={<AddMovieRequest />} />
          <Route
            path="/flags/add"
            element={
              <FlagSubmission
                userId={userId}
                onSuccess={() => {
                  navigate("/u/" + userId);
                }}
              />
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminWrapper />} />
          <Route path="/admin/users" element={<UserWrapper />} />
          <Route path="/admin/flags" element={<FlagDashboard />} />
          <Route path="/admin/films" element={<FilmWrapper />} />
          <Route path="/admin/reviews" element={<ReviewWrapper />} />
          <Route path="/box-office" element={<BoxOfficeWrapper />} />
          <Route path="/report-a-bug" element={<FindABug />} />
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

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  );
}

// Placeholder for 404 page
const NotFound = () => (
  <div className="text-center p-8">
    <h2>404 - Page Not Found</h2>
    <p>Sorry, the page you're looking for doesn't exist.</p>
  </div>
);

export default App;
