import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import {
  useGetListsQuery,
  useGetListsByUserIdQuery,
  useCreateListMutation,
  useDeleteListMutation,
  useAddMovieToListMutation,
  useUpdateListMutation,
  useRemoveMovieFromListMutation,
} from "../../actions/listApi";
import { useGetProfileQuery } from "../../actions/userApi";
import axios from "axios";
import placehold from "../../assets/img/banner/1.jpg";

const ListWrapper = () => {
  const { data: user } = useGetProfileQuery();
  const userId = user?._id || null;

  const {
    data: publicLists = [],
    refetch: refetchPublic,
    isLoading: publicListsLoading,
    error: publicListsError,
  } = useGetListsQuery();
  const {
    data: userLists = [],
    refetch: refetchUser,
    isLoading: userListsLoading,
    error: userListsError,
  } = useGetListsByUserIdQuery(userId, { skip: !userId });

  const lists = userId ? userLists : publicLists;
  const refetch = userId ? refetchUser : refetchPublic;
  const listsLoading = userId ? userListsLoading : publicListsLoading;
  const listsError = userId ? userListsError : publicListsError;

  const [createList, { isLoading: createLoading }] = useCreateListMutation();
  const [deleteList, { isLoading: deleteLoading }] = useDeleteListMutation();
  const [addMovieToList, { isLoading: addMovieLoading }] =
    useAddMovieToListMutation();
  const [updateList, { isLoading: updateLoading }] = useUpdateListMutation();
  const [removeMovieFromList, { isLoading: removeMovieLoading }] =
    useRemoveMovieFromListMutation();

  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "967df4e131f467edcdd674b650bf257c";

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isMoviesModalVisible, setIsMoviesModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editListName, setEditListName] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    privacy: [], // "public", "private"
    sort: "createdAt.desc",
  });
  const [currentListPage, setCurrentListPage] = useState(1);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const pageSize = 8; // Lists per page
  const moviesPageSize = 5; // Movies per page

  useEffect(() => {
    if (listsError) {
      message.error(listsError?.data?.message || "Failed to load lists", 2);
    }
  }, [listsError]);

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      return {
        title: response.data.title,
        posterUrl: response.data.poster_path
          ? `https://image.tmdb.org/t/p/w200${response.data.poster_path}`
          : placehold,
        tmdbUrl: `https://www.themoviedb.org/movie/${movieId}`,
      };
    } catch (error) {
      console.error("Error fetching movie details", error);
      return null;
    }
  };

  const searchMovies = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      setSearchResults(
        response.data.results.map((movie) => ({
          value: movie.id.toString(),
          label: movie.title,
          movie,
        }))
      );
    } catch (error) {
      console.error("Error searching movies", error);
      message.error("Failed to search movies", 2);
    }
  };

  const validateListName = (name) => {
    if (!name.trim()) return "List name cannot be empty";
    if (!/^[a-zA-Z0-9\s_-]{3,50}$/.test(name))
      return "List name must be 3-50 characters and contain only letters, numbers, spaces, underscores, or hyphens";
    return null;
  };

  const handleCreateList = async () => {
    const validationError = validateListName(newListName);
    if (validationError) {
      message.warning(validationError, 2);
      return;
    }
    try {
      await createList({ name: newListName, isPrivate }).unwrap();
      setNewListName("");
      setIsPrivate(false);
      setIsCreateModalVisible(false);
      refetch();
      message.success("List created successfully", 2);
    } catch (error) {
      message.error(error?.data?.message || "Failed to create list", 2);
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteList(id).unwrap();
      refetch();
      message.success("List deleted successfully", 2);
    } catch (error) {
      message.error(error?.data?.message || "Failed to delete list", 2);
    }
  };

  const handleEditList = async () => {
    const validationError = validateListName(editListName);
    if (validationError) {
      message.warning(validationError, 2);
      return;
    }
    try {
      await updateList({
        listId: selectedList._id,
        name: editListName,
        isPrivate: editIsPrivate,
      }).unwrap();
      setIsEditModalVisible(false);
      refetch();
      message.success("List updated successfully", 2);
    } catch (error) {
      message.error(error?.data?.message || "Failed to update list", 2);
    }
  };

  const handleAddMovie = async (movieId) => {
    try {
      const selectedMovie = searchResults.find(
        (result) => result.value === movieId
      )?.movie;
      if (!selectedMovie) {
        message.error("Invalid movie selected", 2);
        return;
      }
      await addMovieToList({
        listId: selectedList._id,
        movie: {
          id: selectedMovie.id,
          title: selectedMovie.title,
          poster_path: selectedMovie.poster_path,
        },
      }).unwrap();
      refetch();
      setSearchQuery("");
      setSearchResults([]);
      message.success("Movie added to list", 2);
    } catch (error) {
      message.error(error?.data?.message || "Failed to add movie", 2);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    try {
      await removeMovieFromList({
        listId: selectedList._id,
        movieId,
      }).unwrap();
      refetch();
      message.success("Movie removed from list", 2);
    } catch (error) {
      message.error(error?.data?.message || "Failed to remove movie", 2);
    }
  };

  const handleShareList = () => {
    if (selectedList.isPrivate) {
      message.warning(
        "This is a private list and can only be viewed by you.",
        2
      );
      return;
    }
    const shareUrl = `${window.location.origin}/lists/${selectedList._id}`;
    navigator.clipboard.writeText(shareUrl);
    message.success("List URL copied to clipboard", 2);
  };

  const handleCardClick = async (list) => {
    setSelectedList(list);
    setEditListName(list.name);
    setEditIsPrivate(list.isPrivate);
    setIsMoviesModalVisible(true);
    setCurrentMoviePage(1);

    const details = {};
    for (const movie of list.movies) {
      const data = await fetchMovieDetails(movie.movieId);
      if (data) details[movie._id] = data;
    }
    setMovieDetails(details);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleFilterChange = useCallback((filters) => {
    setSelectedFilter(filters);
    setCurrentListPage(1);
  }, []);

  const handlePrivacyChange = (value) => {
    const newPrivacy = selectedFilter.privacy.includes(value)
      ? selectedFilter.privacy.filter((p) => p !== value)
      : [...selectedFilter.privacy, value];
    handleFilterChange({ ...selectedFilter, privacy: newPrivacy });
  };

  const handleClearFilters = () => {
    handleFilterChange({ privacy: [], sort: "createdAt.desc" });
  };

  const handleSortChange = (value) => {
    handleFilterChange({ ...selectedFilter, sort: value });
  };

  // Filter and sort lists
  const filteredLists = lists
    .filter((list) => {
      if (selectedFilter.privacy.length === 0) return true;
      return selectedFilter.privacy.includes(
        list.isPrivate ? "private" : "public"
      );
    })
    .sort((a, b) => {
      if (selectedFilter.sort === "createdAt.desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (selectedFilter.sort === "createdAt.asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (selectedFilter.sort === "name.asc") {
        return a.name.localeCompare(b.name);
      } else if (selectedFilter.sort === "name.desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

  const paginatedLists = filteredLists.slice(
    (currentListPage - 1) * pageSize,
    currentListPage * pageSize
  );
  const paginatedMovies = selectedList
    ? selectedList.movies.slice(
        (currentMoviePage - 1) * moviesPageSize,
        currentMoviePage * moviesPageSize
      )
    : [];

  const totalPages = Math.ceil(filteredLists.length / pageSize);
  const maxPagesToShow = 8;
  const currentPageGroup = Math.floor((currentListPage - 1) / maxPagesToShow);
  const startPage = currentPageGroup * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="row">
      <div className="col-xxl-12">
        <section className="mn-shop">
          {/* Shop Banners */}
          <div className="m-b-30">
            <div className="row">
              <div className="col-md-6">
                <div className="mn-ofr-banners">
                  <div className="mn-bnr-body">
                    <div className="mn-bnr-img">
                      <span className="lbl">New</span>
                      <img src="/assets/img/banner/5.jpg" alt="banner" />
                    </div>
                    <div className="mn-bnr-detail">
                      <h5>Create Your Movie Lists</h5>
                      <p>Organize your favorite films.</p>
                      <button
                        className="mn-btn-2"
                        onClick={() => setIsCreateModalVisible(true)}
                        disabled={!user}
                        aria-label="Create new list"
                      >
                        <span>Create Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mn-ofr-banners m-t-767">
                  <div className="mn-bnr-body">
                    <div className="mn-bnr-img">
                      <span className="lbl">Share</span>
                      <img src="/assets/img/banner/6.jpg" alt="banner" />
                    </div>
                    <div className="mn-bnr-detail">
                      <h5>Share Your Lists</h5>
                      <p>Let friends see your movie picks.</p>
                      <Link to="/lists" className="mn-btn-2">
                        <span>Explore Lists</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Sidebar */}
            <div
              className={`filter-sidebar-overlay ${
                isSidebarOpen ? "active" : ""
              }`}
              onClick={toggleSidebar}
            ></div>
            <div
              className={`mn-shop-sidebar mn-filter-sidebar col-lg-3 col-md-12 ${
                isSidebarOpen ? "active" : ""
              }`}
            >
              <div id="shop_sidebar">
                <div className="mn-sidebar-wrap">
                  <div className="mn-sidebar-block">
                    <div className="mn-sb-title">
                      <h3 className="mn-sidebar-title">Filters</h3>
                      <a
                        href="javascript:void(0)"
                        className="filter-close"
                        onClick={toggleSidebar}
                      >
                        <i className="ri-close-large-line"></i>
                      </a>
                    </div>
                    <div className="mn-sb-block-content p-t-15">
                      <h5 className="section-title style-1 mb-30">Privacy</h5>
                      <ul>
                        <li>
                          <div className="mn-sidebar-block-item">
                            <input
                              type="checkbox"
                              value="public"
                              checked={selectedFilter.privacy.includes(
                                "public"
                              )}
                              onChange={() => handlePrivacyChange("public")}
                              id="privacy-public"
                            />
                            <label htmlFor="privacy-public">
                              <span>Public</span>
                            </label>
                            <span className="checked"></span>
                          </div>
                        </li>
                        {user && (
                          <li>
                            <div className="mn-sidebar-block-item">
                              <input
                                type="checkbox"
                                value="private"
                                checked={selectedFilter.privacy.includes(
                                  "private"
                                )}
                                onChange={() => handlePrivacyChange("private")}
                                id="privacy-private"
                              />
                              <label htmlFor="privacy-private">
                                <span>Private</span>
                              </label>
                              <span className="checked"></span>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mn-shop-rightside col-md-12 m-t-991">
              {/* Shop Top */}
              <div className="mn-pro-list-top d-flex">
                <div className="col-md-6 mn-grid-list">
                  <div className="mn-gl-btn">
                    <button
                      className="grid-btn filter-toggle-icon"
                      onClick={toggleSidebar}
                      aria-label="Toggle filters"
                    >
                      <i className="ri-filter-2-line"></i>
                    </button>
                    <button
                      className={`grid-btn btn-grid-50 ${
                        isGridView ? "active" : ""
                      }`}
                      onClick={() => setIsGridView(true)}
                      aria-label="Grid view"
                    >
                      <i className="ri-gallery-view-2"></i>
                    </button>
                    <button
                      className={`grid-btn btn-list-50 ${
                        !isGridView ? "active" : ""
                      }`}
                      onClick={() => setIsGridView(false)}
                      aria-label="List view"
                    >
                      <i className="ri-list-check-2"></i>
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mn-sort-select">
                  <div className="mn-select-inner">
                    <select
                      name="mn-select"
                      id="mn-select"
                      value={selectedFilter.sort}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="createdAt.desc">Newest</option>
                      <option value="createdAt.asc">Oldest</option>
                      <option value="name.asc">Name (A-Z)</option>
                      <option value="name.desc">Name (Z-A)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Select Bar */}
              <div className="mn-select-bar d-flex">
                {selectedFilter.privacy.map((privacy) => (
                  <span key={privacy} className="mn-select-btn">
                    {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
                    <a
                      className="mn-select-cancel"
                      href="javascript:void(0)"
                      onClick={() => handlePrivacyChange(privacy)}
                    >
                      ×
                    </a>
                  </span>
                ))}
                {selectedFilter.privacy.length > 0 && (
                  <span className="mn-select-btn mn-select-btn-clear">
                    <a
                      className="mn-select-clear"
                      href="javascript:void(0)"
                      onClick={handleClearFilters}
                    >
                      Clear All
                    </a>
                  </span>
                )}
              </div>

              {/* Shop Content */}
              <div className="shop-pro-content">
                <div className="row">
                  <div className="col-12 mb-3">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        searchMovies(searchQuery);
                      }}
                    >
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search lists by name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          aria-label="Search lists"
                        />
                        <button type="submit" className="btn btn-primary">
                          <i className="ri-search-line"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div
                className={`shop-pro-inner ${isGridView ? "" : "list-view-50"}`}
              >
                <div className="row">
                  {listsLoading ? (
                    <div className="col-12 text-center">
                      <p>Loading lists...</p>
                    </div>
                  ) : paginatedLists.length === 0 ? (
                    <div className="col-12 text-center">
                      <p>
                        No lists found.{" "}
                        {user
                          ? "Create a new list to get started!"
                          : "Please log in to view your lists."}
                      </p>
                    </div>
                  ) : (
                    paginatedLists.map((list) => (
                      <div
                        key={list._id}
                        className={`col-lg-3 col-md-4 col-sm-6 col-12 m-b-24 mn-product-box pro-gl-content ${
                          isGridView ? "" : "width-50"
                        }`}
                      >
                        <div className="mn-product-card">
                          <div className="mn-product-img">
                            <div className="lbl">
                              <span className={list.isPrivate ? "new" : "hot"}>
                                {list.isPrivate ? "Private" : "Public"}
                              </span>
                            </div>
                            <div className="mn-img">
                              <Link to={`/lists/${list._id}`} className="image">
                                <img
                                  className="main-img"
                                  src={
                                    list.movies[0]?.poster_path
                                      ? `https://image.tmdb.org/t/p/w200${list.movies[0].poster_path}`
                                      : placehold
                                  }
                                  alt={list.name}
                                />
                                <img
                                  className="hover-img"
                                  src={
                                    list.movies[0]?.poster_path
                                      ? `https://image.tmdb.org/t/p/w200${list.movies[0].poster_path}`
                                      : placehold
                                  }
                                  alt={list.name}
                                />
                              </Link>
                              <div className="mn-options">
                                <ul>
                                  <li>
                                    <a
                                      href="javascript:void(0)"
                                      data-tooltip
                                      title="View Movies"
                                      onClick={() => handleCardClick(list)}
                                    >
                                      <i className="ri-eye-line"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="javascript:void(0)"
                                      data-tooltip
                                      title="Share"
                                      onClick={() => {
                                        setSelectedList(list);
                                        handleShareList();
                                      }}
                                    >
                                      <i className="ri-share-line"></i>
                                    </a>
                                  </li>
                                  {user && list.userId === userId && (
                                    <li>
                                      <a
                                        href="javascript:void(0)"
                                        data-tooltip
                                        title="Edit List"
                                        onClick={() => {
                                          setSelectedList(list);
                                          setEditListName(list.name);
                                          setEditIsPrivate(list.isPrivate);
                                          setIsEditModalVisible(true);
                                        }}
                                      >
                                        <i className="ri-pencil-line"></i>
                                      </a>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="mn-product-detail">
                            <div className="cat">
                              <Link to={`/lists/${list._id}`}>
                                Created{" "}
                                {new Date(list.createdAt).toLocaleDateString()}
                              </Link>
                            </div>
                            <h5>
                              <Link to={`/lists/${list._id}`}>{list.name}</Link>
                            </h5>
                            <p className="mn-info">
                              {list.movies.length} movie
                              {list.movies.length !== 1 ? "s" : ""}
                            </p>
                            <div className="mn-pro-option">
                              {user && list.userId === userId && (
                                <a
                                  href="javascript:void(0);"
                                  className="mn-wishlist"
                                  data-tooltip
                                  title="Delete List"
                                  onClick={() => handleDeleteList(list._id)}
                                  disabled={deleteLoading}
                                >
                                  <i className="ri-trash-line"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="mn-pro-pagination m-b-15">
                <span>
                  Showing {(currentListPage - 1) * pageSize + 1}-
                  {Math.min(currentListPage * pageSize, filteredLists.length)}{" "}
                  of {filteredLists.length} item(s)
                </span>
                <ul className="mn-pro-pagination-inner">
                  {currentListPage > 1 && (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => setCurrentListPage(currentListPage - 1)}
                      >
                        <i className="ri-arrow-left-double-line"></i> Prev
                      </a>
                    </li>
                  )}
                  {pages.map((p) => (
                    <li key={p}>
                      <a
                        className={p === currentListPage ? "active" : ""}
                        href="javascript:void(0)"
                        onClick={() => setCurrentListPage(p)}
                      >
                        {p}
                      </a>
                    </li>
                  ))}
                  {endPage < totalPages && (
                    <>
                      <li>
                        <span>...</span>
                      </li>
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            setCurrentListPage(currentListPage + 1)
                          }
                        >
                          Next <i className="ri-arrow-right-double-line"></i>
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Create List Modal */}
        <div
          className={`modal fade ${isCreateModalVisible ? "show d-block" : ""}`}
          tabIndex="-1"
          aria-labelledby="createListModalLabel"
          aria-hidden={!isCreateModalVisible}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createListModalLabel">
                  Create New List
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsCreateModalVisible(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="newListName" className="form-label">
                    List Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="newListName"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name"
                    aria-label="List name"
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    aria-label="Private list"
                  />
                  <label className="form-check-label" htmlFor="isPrivate">
                    Private List
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateModalVisible(false)}
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateList}
                  disabled={createLoading}
                  aria-label="Create list"
                >
                  {createLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit List Modal */}
        <div
          className={`modal fade ${isEditModalVisible ? "show d-block" : ""}`}
          tabIndex="-1"
          aria-labelledby="editListModalLabel"
          aria-hidden={!isEditModalVisible}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editListModalLabel">
                  Edit List
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsEditModalVisible(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editListName" className="form-label">
                    List Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editListName"
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
                    placeholder="Enter new list name"
                    aria-label="New list name"
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="editIsPrivate"
                    checked={editIsPrivate}
                    onChange={(e) => setEditIsPrivate(e.target.checked)}
                    aria-label="Private list"
                  />
                  <label className="form-check-label" htmlFor="editIsPrivate">
                    Private List
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalVisible(false)}
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditList}
                  disabled={updateLoading}
                  aria-label="Save changes"
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Modal */}
        <div
          className={`modal fade ${isMoviesModalVisible ? "show d-block" : ""}`}
          tabIndex="-1"
          aria-labelledby="moviesModalLabel"
          aria-hidden={!isMoviesModalVisible}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="moviesModalLabel">
                  {selectedList?.name} - Movies
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsMoviesModalVisible(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {user && selectedList?.userId === userId && (
                  <div className="mb-3">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        searchMovies(searchQuery);
                      }}
                    >
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search movies to add..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          aria-label="Search movies"
                        />
                        <button type="submit" className="btn btn-primary">
                          <i className="ri-search-line"></i>
                        </button>
                      </div>
                    </form>
                    {searchResults.length > 0 && (
                      <ul className="list-group mt-2">
                        {searchResults.map((result) => (
                          <li
                            key={result.value}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleAddMovie(result.value)}
                            style={{ cursor: "pointer" }}
                          >
                            {result.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {paginatedMovies.length === 0 ? (
                  <p>No movies in this list yet.</p>
                ) : (
                  <div className="row">
                    {paginatedMovies.map((movie) => (
                      <div key={movie._id} className="col-md-4 mb-3">
                        <div className="mn-product-card">
                          <div className="mn-product-img">
                            <div className="mn-img">
                              <a
                                href={movieDetails[movie._id]?.tmdbUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="image"
                              >
                                <img
                                  className="main-img"
                                  src={
                                    movieDetails[movie._id]?.posterUrl ||
                                    placehold
                                  }
                                  alt={
                                    movieDetails[movie._id]?.title ||
                                    movie.title
                                  }
                                />
                                <img
                                  className="hover-img"
                                  src={
                                    movieDetails[movie._id]?.posterUrl ||
                                    placehold
                                  }
                                  alt={
                                    movieDetails[movie._id]?.title ||
                                    movie.title
                                  }
                                />
                              </a>
                            </div>
                          </div>
                          <div className="mn-product-detail">
                            <h5>
                              <a
                                href={movieDetails[movie._id]?.tmdbUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {movieDetails[movie._id]?.title || movie.title}
                              </a>
                            </h5>
                            {user && selectedList?.userId === userId && (
                              <div className="mn-pro-option">
                                <a
                                  href="javascript:void(0);"
                                  className="mn-wishlist"
                                  data-tooltip
                                  title="Remove Movie"
                                  onClick={() =>
                                    handleRemoveMovie(movie.movieId)
                                  }
                                  disabled={removeMovieLoading}
                                >
                                  <i className="ri-trash-line"></i>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mn-pro-pagination m-b-15">
                  <span>
                    Showing {(currentMoviePage - 1) * moviesPageSize + 1}-
                    {Math.min(
                      currentMoviePage * moviesPageSize,
                      selectedList?.movies.length || 0
                    )}{" "}
                    of {selectedList?.movies.length || 0} item(s)
                  </span>
                  <ul className="mn-pro-pagination-inner">
                    {currentMoviePage > 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            setCurrentMoviePage(currentMoviePage - 1)
                          }
                        >
                          <i className="ri-arrow-left-double-line"></i> Prev
                        </a>
                      </li>
                    )}
                    {Array.from(
                      {
                        length: Math.ceil(
                          (selectedList?.movies.length || 0) / moviesPageSize
                        ),
                      },
                      (_, i) => i + 1
                    ).map((p) => (
                      <li key={p}>
                        <a
                          className={p === currentMoviePage ? "active" : ""}
                          href="javascript:void(0)"
                          onClick={() => setCurrentMoviePage(p)}
                        >
                          {p}
                        </a>
                      </li>
                    ))}
                    {currentMoviePage <
                      Math.ceil(
                        (selectedList?.movies.length || 0) / moviesPageSize
                      ) && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            setCurrentMoviePage(currentMoviePage + 1)
                          }
                        >
                          Next <i className="ri-arrow-right-double-line"></i>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsMoviesModalVisible(false)}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListWrapper;
