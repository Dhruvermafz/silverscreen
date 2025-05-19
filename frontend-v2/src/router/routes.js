import NewItems from "../components/Home/NewItems";
import Contact from "../components/Contact/Contact";
import Profile from "../components/Profile/Profile";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import ListComponent from "../components/Lists/ListWrapper";
import CatalogFilms from "../components/Catalog/CatalogFilms";
import GroupsPage from "../components/Groups/GroupsPage";
import GroupDetailPage from "../components/Groups/GroupDetailPage";
import MembersWrapper from "../components/Members/MembersWrapper";
import SettingsWrapper from "../components/Settings/SettingsWrapper";
import Privacy from "../components/Common/Privacy";
import FilmPage from "../components/Catalog/FilmPage";
import About from "../components/Common/About";
import AdminWrapper from "../components/admin/AdminWrapper";
import UserWrapper from "../components/admin/Users/UserWrapper";
import CommentWrapper from "../components/admin/Comment/CommentWrapper";
import CatalogWrapper from "../components/admin/Catalog/CatalogWrapper";
import NewsroomPage from "../components/NewsRooms/NewsroomPage";

const masterRoutes = [
  {
    path: "/",
    name: "Home",
    element: <NewItems />,
  },
  {
    path: "/contact",
    name: "Contact",
    element: <Contact />,
  },
  {
    path: "/u/:id",
    name: "Profile",
    element: <Profile />,
  },
  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/signup",
    name: "Sign Up",
    element: <SignUp />,
  },
  {
    path: "/lists",
    name: "Lists",
    element: <ListComponent />,
  },
  {
    path: "/films",
    name: "Films",
    element: <CatalogFilms />,
  },
  {
    path: "/groups",
    name: "Groups",
    element: <GroupsPage />,
  },
  {
    path: "/group/:id",
    name: "Group Details",
    element: <GroupDetailPage />,
  },
  {
    path: "/members",
    name: "Members",
    element: <MembersWrapper />,
  },
  {
    path: "/settings",
    name: "Settings",
    element: <SettingsWrapper />,
  },
  {
    path: "/newsroom",
    name: "Newsrooms",
    element: <NewsroomPage />,
  },
  {
    path: "/privacy",
    name: "Privacy",
    element: <Privacy />,
  },
  {
    path: "/film/:id",
    name: "Film Details",
    element: <FilmPage />,
  },
  {
    path: "/about",
    name: "About",
    element: <About />,
  },
  {
    path: "/admin",
    name: "Admin Dashboard",
    element: <AdminWrapper />,
    requiredPermission: "ADMIN_ACCESS",
    submenu: [
      {
        path: "/admin/users",
        name: "Users",
        element: <UserWrapper />,
        requiredPermission: "ADMIN_ACCESS",
      },
      {
        path: "/admin/comments",
        name: "Comments",
        element: <CommentWrapper />,
        requiredPermission: "ADMIN_ACCESS",
      },
      {
        path: "/admin/catalog",
        name: "Catalog",
        element: <CatalogWrapper />,
        requiredPermission: "ADMIN_ACCESS",
      },
    ],
  },
];

export default masterRoutes;
