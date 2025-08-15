import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useLogoutMutation } from "../../actions/authApi";
import { useGetProfileQuery } from "../../actions/userApi";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";
import logo from "../../assets/img/logo/logo.png";

const Header = () => {
  const { data: user, isLoading, isError, error } = useGetProfileQuery();
  const [logout] = useLogoutMutation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [searchValue, setSearchValue] = useState("");
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  // Fetch genres for Categories dropdown
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres.slice(0, 6) || []); // Limit to 6 genres
      } catch (error) {
        console.error("Error fetching genres:", error);
        message.error("Failed to load genres", 2);
      }
    };
    fetchGenres();
  }, []);

  // Handle profile fetch errors
  useEffect(() => {
    if (isError) {
      message.error(
        error?.data?.error || "Failed to fetch profile. Please log in again.",
        3
      );
    }
  }, [isError, error]);

  // Handle theme toggle
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      message.success(`Searching for "${searchValue}"`, 2);
      setSearchValue("");
      setMobileMenuVisible(false);
    } else {
      message.warning("Please enter a search term.", 2);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("token");
      message.success("Logged out successfully!", 1);
      navigate("/dashboard");
    } catch (err) {
      message.error(err?.data?.error || "Logout failed.", 3);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    message.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, 1);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible((prev) => !prev);
  };

  const displayName = user?.username?.includes("@")
    ? user?.email?.split("@")[0] || user?._id || "User"
    : user?.username || "User";

  return (
    <header>
      <div class="mn-header">
        <div className="mn-header-items">
          {/* Left Header */}
          <div className="left-header">
            <Link to="/" className="logo">
              <img src={logo} alt="DimeCine logo" />
            </Link>
          </div>

          {/* Right Header */}
          <div className="right-header">
            {/* Desktop Main Menu */}
            <div
              id="mn-main-menu-desk"
              className="d-none d-lg-block sticky-nav"
            >
              <div className="nav-desk">
                <div className="row">
                  <div className="col-md-12 align-self-center">
                    <div className="mn-main-menu">
                      <ul>
                        <li className="non-drop">
                          <Link to="/box-office">Box Office</Link>
                        </li>

                        <li className="non-drop">
                          <Link to="/films">Explore Films</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Icons */}
            <div className="mn-tool-icons">
              {/* Search */}
              <div className="mn-tool-search">
                <a
                  className="mn-main-search mn-search-toggle"
                  onClick={() =>
                    document.querySelector(".search-form input").focus()
                  }
                  aria-label="Search movies"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 612.01 612.01"
                  >
                    <path
                      d="M606.209 578.714 448.198 423.228C489.576 378.272 515 318.817 515 253.393 514.98 113.439 399.704 0 257.493 0S.006 113.439.006 253.393s115.276 253.393 257.487 253.393c61.445 0 117.801-21.253 162.068-56.586l158.624 156.099c7.729 7.614 20.277 7.614 28.006 0a19.291 19.291 0 0 0 .018-27.585zM257.493 467.8c-120.326 0-217.869-95.993-217.869-214.407S137.167 38.986 257.493 38.986c120.327 0 217.869 95.993 217.869 214.407S377.82 467.8 257.493 467.8z"
                      fill="#000000"
                    />
                  </svg>
                </a>
              </div>

              {/* User */}
              <div className="mn-tool-user">
                {isLoading ? (
                  <span>Loading...</span>
                ) : user ? (
                  <>
                    <a className="mn-main-user">
                      <i class="ri-account-circle-line"></i>
                    </a>
                    <ul className="sub-menu">
                      <li>
                        <Link to={`/u/${user?._id || "unknown"}`}>
                          <i className="ri-user-line me-2"></i> Profile
                        </Link>
                      </li>
                      {user?.isFilmmaker && (
                        <li>
                          <Link to="/portfolio">
                            <i className="ri-film-line me-2"></i> Portfolio
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link to="/settings">
                          <i className="ri-settings-3-line me-2"></i> Settings
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} aria-label="Logout">
                          <i className="ri-logout-box-r-line me-2"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <a href="javascript:void(0)" className="mn-main-user">
                      <svg
                        className="svg-icon"
                        viewBox="0 0 1024 1024"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M512.476 648.247c-170.169 0-308.118-136.411-308.118-304.681 0-168.271 137.949-304.681 308.118-304.681 170.169 0 308.119 136.411 308.119 304.681C820.594 511.837 682.645 648.247 512.476 648.247zM512.476 100.186c-135.713 0-246.12 109.178-246.12 243.381 0 134.202 110.407 243.381 246.12 243.381 135.719 0 246.126-109.179 246.126-243.381C758.602 209.364 648.195 100.186 512.476 100.186zM935.867 985.115l-26.164 0c-9.648 0-17.779-6.941-19.384-16.35-2.646-15.426-6.277-30.52-11.142-44.95-24.769-87.686-81.337-164.13-159.104-214.266-63.232 35.203-134.235 53.64-207.597 53.64-73.555 0-144.73-18.537-208.084-53.922-78 50.131-134.75 126.68-159.564 214.549 0 0-4.893 18.172-11.795 46.4-2.136 8.723-10.035 14.9-19.112 14.9L88.133 985.116c-9.415 0-16.693-8.214-15.47-17.452C91.698 824.084 181.099 702.474 305.51 637.615c58.682 40.472 129.996 64.267 206.966 64.267 76.799 0 147.968-23.684 206.584-63.991 124.123 64.932 213.281 186.403 232.277 329.772C952.56 976.901 945.287 985.115 935.867 985.115z" />
                      </svg>
                      Sign In
                    </a>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                      <li>
                        <Link to="/register">Register</Link>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
