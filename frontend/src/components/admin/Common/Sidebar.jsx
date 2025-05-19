import React from "react";

const Sidebar = () => {
  return (
    <div class="sidebar">
      <a href="index.html" class="sidebar__logo">
        <img src="img/logo.svg" alt="" />
      </a>

      <div class="sidebar__user">
        <div class="sidebar__user-img">
          <img src="img/user.svg" alt="" />
        </div>

        <div class="sidebar__user-title">
          <span>Admin</span>
          <p>John Doe</p>
        </div>

        <button class="sidebar__user-btn" type="button">
          <i class="ti ti-logout"></i>
        </button>
      </div>

      <div class="sidebar__nav-wrap">
        <ul class="sidebar__nav">
          <li class="sidebar__nav-item">
            <a
              href="index.html"
              class="sidebar__nav-link sidebar__nav-link--active"
            >
              <i class="ti ti-layout-grid"></i> <span>Dashboard</span>
            </a>
          </li>

          <li class="sidebar__nav-item">
            <a href="catalog.html" class="sidebar__nav-link">
              <i class="ti ti-movie"></i> <span>Catalog</span>
            </a>
          </li>

          <li class="sidebar__nav-item">
            <a href="users.html" class="sidebar__nav-link">
              <i class="ti ti-users"></i> <span>Users</span>
            </a>
          </li>

          <li class="sidebar__nav-item">
            <a href="comments.html" class="sidebar__nav-link">
              <i class="ti ti-message"></i> <span>Comments</span>
            </a>
          </li>

          <li class="sidebar__nav-item">
            <a href="reviews.html" class="sidebar__nav-link">
              <i class="ti ti-star-half-filled"></i> <span>Reviews</span>
            </a>
          </li>

          <li class="sidebar__nav-item">
            <a href="settings.html" class="sidebar__nav-link">
              <i class="ti ti-settings"></i> <span>Settings</span>
            </a>
          </li>

          <li class="sidebar__nav-item">
            <a
              class="sidebar__nav-link"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="ti ti-files"></i> <span>Pages</span>{" "}
              <i class="ti ti-chevron-down"></i>
            </a>

            <ul class="dropdown-menu sidebar__dropdown-menu">
              <li>
                <a href="add-item.html">Add item</a>
              </li>
              <li>
                <a href="edit-user.html">Edit user</a>
              </li>
              <li>
                <a href="signin.html">Sign In</a>
              </li>
              <li>
                <a href="signup.html">Sign Up</a>
              </li>
              <li>
                <a href="forgot.html">Forgot password</a>
              </li>
              <li>
                <a href="404.html">404 Page</a>
              </li>
            </ul>
          </li>

          <li class="sidebar__nav-item">
            <a
              href="https://hotflix.volkovdesign.com/main/index.html"
              class="sidebar__nav-link"
            >
              <i class="ti ti-arrow-left"></i> <span>Back to HotFlix</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar__copyright">
        © HOTFLIX, 2019—2024. <br />
        Create by{" "}
        <a
          href="https://themeforest.net/user/dmitryvolkov/portfolio"
          target="_blank"
        >
          Dmitry Volkov
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
