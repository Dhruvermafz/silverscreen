import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetProfileQuery,
  useCompleteOnboardingMutation,
} from "../actions/userApi";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import ListWrapper from "../components/Lists/ListWrapper";
import Contact from "../components/Common/Contact";
import ProfileWrapper from "../components/Profile/ProfileWrapper";
import OnboardingFlow from "../components/Onboarding/OnboardingFlow";
import FilmWrapper from "../components/Films/FilmWrapper";
import { setOnboardingComplete } from "../actions/slices/authSlices";
import HomeWrapper from "../components/Home/HomeWrapper";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Terms from "../components/Common/Terms";
import Error404 from "../components/Common/Error404";
import PrivacyPolicy from "../components/Common/PrivacyPolicy";
import MembersWrapper from "../components/Members/MembersWrapper";
import GroupsPage from "../components/Groups/GroupsPage";
import BoxOfficeWrapper from "../components/BoxOffice/BoxOfficeWrapper";
import MoviePage from "../components/Movie/MoviePage";
import GenrePage from "../components/Films/GenreWrapper";
import GroupDetailPage from "../components/Groups/GroupDetailPage";
import SearchPage from "../components/Search/SearchWrapper";
import About from "../components/Common/About";
import Faqs from "../components/Common/Faqs";
import ActorProfile from "../components/Movie/ActorProfile";
import DirectorProfile from "../components/Movie/DirectorProfile";
import CategoriesPage from "../components/Films/CategoriesPage";
import PrivateRoute from "./PrivateRoute";

const RouteWithHelmet = ({ element, name }) => {
  return (
    <>
      {name && (
        <Helmet>
          <title>{`CM Trading Co - ${name}`}</title>
        </Helmet>
      )}
      {element}
    </>
  );
};
const renderRoutes = (routes) => {
  return routes.flatMap(
    ({ path, name, element, requiredPermission, submenu }) => {
      const mainRoute =
        path && element ? (
          <Route
            key={path}
            path={path}
            element={
              requiredPermission ? (
                <PrivateRoute requiredPermission={requiredPermission}>
                  <RouteWithHelmet element={element} name={name} />
                </PrivateRoute>
              ) : (
                <RouteWithHelmet element={element} name={name} />
              )
            }
          />
        ) : null;

      const subRoutes = submenu ? renderRoutes(submenu) : [];

      return mainRoute ? [mainRoute, ...subRoutes] : subRoutes;
    }
  );
};
const Router = () => {
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

  return (
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
      <Route path="/categories" element={<CategoriesPage />} />
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
  );
};

export default Router;
