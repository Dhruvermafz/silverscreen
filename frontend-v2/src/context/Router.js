import HomeWrapper from "../components/Home/HomeWrapper";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import MovieWrapper from "../components/Movie/MovieWrapper";
import ListComponent from "../components/Lists/ListWrapper";
import MembersWrapper from "../components/Members/MembersWrapper";
import About from "../components/Common/About";
import Contact from "../components/Common/Contact";
import ProfileWrapper from "../components/Common/Profile";
import AddMovieRequest from "../components/Movie/MovieRequest";
import MoviePage from "../components/Movie/MoviePage";
import SettingsWrapper from "../components/Common/Settings";
import GroupsPage from "../components/Groups/GroupsPage";
import GroupDetailPage from "../components/Groups/GroupDetailPage";
import NewsroomDetailPage from "../components/NewsRooms/NewsroomDetailPage";
import NewsroomPage from "../components/NewsRooms/NewsroomPage";
import AdminWrapper from "../components/admin/AdminWrapper";
import OnboardingFlow from "../components/onboarding/OnboardingFlow";
import FlagSubmission from "../components/flag-system/FlagSubmission";
import FlagDashboard from "../components/flag-system/FlagDashbaord";
import UserWrapper from "../components/admin/Users/UserWrapper";
import TermsAndPrivacy from "../components/Common/TermsAndPrivacy";
import BoxOfficeWrapper from "../components/BoxOffice/BoxOfficeWrapper";
import NotFound from "../components/Common/NotFound";
const routes = [
  // Public Routes
  {
    path: "/",
    element: <HomeWrapper />,
    isPublic: true,
  },
  {
    path: "/login",
    element: <Login />,
    isPublic: true,
  },
  {
    path: "/signup",
    element: <Signup />,
    isPublic: true,
  },
  {
    path: "/about",
    element: <About />,
    isPublic: true,
  },
  {
    path: "/contact",
    element: <Contact />,
    isPublic: true,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndPrivacy />,
    isPublic: true,
  },
  // Protected Routes
  {
    path: "/films",
    element: <MovieWrapper />,
    isProtected: true,
  },
  {
    path: "/lists",
    element: <ListComponent />,
    isProtected: true,
  },
  {
    path: "/members",
    element: <MembersWrapper />,
    isProtected: true,
  },
  {
    path: "/u/:id",
    element: <ProfileWrapper />,
    isProtected: true,
  },
  {
    path: "/groups",
    element: <GroupsPage />,
    isProtected: true,
  },
  {
    path: "/group/:groupId",
    element: <GroupDetailPage />,
    isProtected: true,
  },
  {
    path: "/newsrooms",
    element: <NewsroomPage />,
    isProtected: true,
  },
  {
    path: "/newsrooms/:id",
    element: <NewsroomDetailPage />,
    isProtected: true,
  },
  {
    path: "/movies/:id",
    element: <MoviePage />,
    isProtected: true,
  },
  {
    path: "/settings",
    element: <SettingsWrapper />,
    isProtected: true,
  },
  {
    path: "/movie-request",
    element: <AddMovieRequest />,
    isProtected: true,
  },
  {
    path: "/flags/add",
    element: <FlagSubmission />,
    isProtected: true,
    props: (navigate, userId) => ({
      userId,
      onSuccess: () => navigate("/u/" + userId),
    }),
  },
  // Admin Routes
  {
    path: "/admin/dashboard",
    element: <AdminWrapper />,
    isAdmin: true,
  },
  {
    path: "/admin/users",
    element: <UserWrapper />,
    isAdmin: true,
  },
  {
    path: "/admin/flags",
    element: <FlagDashboard />,
    isAdmin: true,
  },
  {
    path: "/box-office",
    element: <BoxOfficeWrapper />,
    isProtected: true,
  },
  // Onboarding Route
  {
    path: "/onboarding",
    element: <OnboardingFlow />,
    isOnboarding: true,
    props: (
      navigate,
      userId,
      completeOnboarding,
      dispatch,
      setOnboardingComplete
    ) => ({
      userId,
      onComplete: (preferences, role) => {
        completeOnboarding({
          userId,
          preferences: preferences || {},
          role: role || "viewer",
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
      },
    }),
  },
  // 404 Route
  {
    path: "*",
    element: <NotFound />,
    isPublic: true,
  },
];

// Placeholder for 404 page

export default routes;
