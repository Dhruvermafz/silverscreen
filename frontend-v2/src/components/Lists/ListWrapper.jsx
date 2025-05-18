import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
} from "../../actions/listApi";
import axios from "axios";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiShare2,
  FiCopy,
  FiSearch,
  FiX,
} from "react-icons/fi";
import placehold from "../../img/covers/cover.jpg";

const ListComponent = () => {
  const { data: lists = [], refetch } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const [deleteList] = useDeleteListMutation();

  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "967df4e131f467edcdd674b650bf257c";

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [isMoviesModalVisible, setIsMoviesModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editListName, setEditListName] = useState("");
  const [movieDetails, setMovieDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentListPage, setCurrentListPage] = useState(1);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const pageSize = 8; // Lists per page
  const moviesPageSize = 5; // Movies per page

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      return {
        title: response.data.title,
        posterUrl: `https://image.tmdb.org/t/p/w200${response.data.poster_path}`,
        tmdbUrl: `https://www.themoviedb.org/movie/${movieId}`,
      };
    } catch (error) {
      console.error("Error fetching movie details", error);
      return null;
    }
  };

  const searchMovies = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
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
      toast.error("Failed to search movies", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.warning("List name cannot be empty", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      await createList({ name: newListName }).unwrap();
      setNewListName("");
      setIsCreateModalVisible(false);
      refetch();
      toast.success("List created successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to create list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteList(id).unwrap();
      refetch();
      toast.success("List deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to delete list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleEditList = async () => {
    if (!editListName.trim()) {
      toast.warning("List name cannot be empty", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      await axios.put(`/api/lists/${selectedList._id}`, { name: editListName });
      setIsEditModalVisible(false);
      refetch();
      toast.success("List renamed successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to rename list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAddMovie = async (movieId) => {
    try {
      await axios.post(`/api/lists/${selectedList._id}/movies`, { movieId });
      refetch();
      setSearchQuery("");
      setSearchResults([]);
      toast.success("Movie added to list", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add movie", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRemoveMovie = async (movieId) => {
    try {
      await axios.delete(`/api/lists/${selectedList._id}/movies/${movieId}`);
      refetch();
      toast.success("Movie removed from list", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to remove movie", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleShareList = () => {
    const shareUrl = `${window.location.origin}/lists/${selectedList._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("List URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleCardClick = async (list) => {
    setSelectedList(list);
    setIsMoviesModalVisible(true);
    setEditListName(list.name);

    const details = {};
    for (const movie of list.movies) {
      const data = await fetchMovieDetails(movie.movieId);
      if (data) details[movie._id] = data;
    }
    setMovieDetails(details);
  };

  const paginatedLists = lists.slice(
    (currentListPage - 1) * pageSize,
    currentListPage * pageSize
  );
  const paginatedMovies = selectedList
    ? selectedList.movies.slice(
        (currentMoviePage - 1) * moviesPageSize,
        currentMoviePage * moviesPageSize
      )
    : [];

  return (
    <div className="list-component section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalVisible(true)}
              aria-label="Create new list"
            >
              <FiPlus /> Create New List
            </button>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {paginatedLists.map((item) => (
            <div key={item._id} className="col">
              <div className="card h-100">
                <img
                  src={item.coverImage || placehold}
                  className="card-img-top"
                  alt={`${item.name} cover`}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{`${item.movies.length} movies`}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    className="btn btn-link text-danger"
                    onClick={() => handleDeleteList(item._id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <FiTrash2 />
                  </button>
                  <div className="dropdown">
                    <button
                      className="btn btn-link"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      aria-label="More actions"
                    >
                      <FiShare2 />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedList(item);
                            setEditListName(item.name);
                            setIsEditModalVisible(true);
                          }}
                        >
                          <FiEdit /> Rename
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedList(item);
                            handleShareList();
                          }}
                        >
                          <FiShare2 /> Share
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            toast.info("Duplicating list (mock)", {
                              position: "top-right",
                              autoClose: 2000,
                            })
                          }
                        >
                          <FiCopy /> Duplicate
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  className="card-img-overlay btn btn-link"
                  onClick={() => handleCardClick(item)}
                  style={{ background: "transparent", border: "none" }}
                  aria-label={`View ${item.name}`}
                />
              </div>
            </div>
          ))}
        </div>

        {lists.length > pageSize && (
          <nav aria-label="List pagination" className="mt-4">
            <ul className="pagination justify-content-center">
              {Array.from({
                length: Math.ceil(lists.length / pageSize),
              }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentListPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentListPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Create List Modal */}
        <div
          className={`modal fade ${isCreateModalVisible ? "show d-block" : ""}`}
          tabIndex="-1"
          aria-labelledby="createListModalLabel"
          aria-hidden={!isCreateModalVisible}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
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
                />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  aria-label="List name"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateList}
                >
                  Create
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
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editListModalLabel">
                  Rename List
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsEditModalVisible(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new list name"
                  value={editListName}
                  onChange={(e) => setEditListName(e.target.value)}
                  aria-label="New list name"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditList}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Movies List Modal */}
        <div
          className={`modal fade ${isMoviesModalVisible ? "show d-block" : ""}`}
          tabIndex="-1"
          aria-labelledby="moviesModalLabel"
          aria-hidden={!isMoviesModalVisible}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="moviesModalLabel">
                  {selectedList?.name || "Movies"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setIsMoviesModalVisible(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search movies to add"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchMovies(e.target.value);
                    }}
                    aria-label="Search movies"
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <FiSearch />
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <ul className="list-group mb-3">
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
                {paginatedMovies.length > 0 ? (
                  <ul className="list-group">
                    {paginatedMovies.map((movie) => {
                      const data = movieDetails[movie._id];
                      return (
                        <li
                          key={movie._id}
                          className="list-group-item d-flex align-items-center justify-content-between"
                        >
                          <div className="d-flex align-items-center gap-3">
                            {data ? (
                              <>
                                <img
                                  src={data.posterUrl}
                                  alt={data.title}
                                  style={{
                                    width: "50px",
                                    borderRadius: "4px",
                                  }}
                                />
                                <a
                                  href={data.tmdbUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-decoration-none"
                                >
                                  {data.title}
                                </a>
                              </>
                            ) : (
                              <span>{movie.title}</span>
                            )}
                          </div>
                          <button
                            className="btn btn-link text-danger"
                            onClick={() => handleRemoveMovie(movie._id)}
                            aria-label={`Remove ${data?.title || "movie"}`}
                          >
                            <FiTrash2 />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-center text-muted">
                    Add movies to this list
                  </p>
                )}
                {selectedList?.movies.length > moviesPageSize && (
                  <nav
                    aria-label="Movies pagination"
                    className="mt-3 d-flex justify-content-center"
                  >
                    <ul className="pagination">
                      {Array.from({
                        length: Math.ceil(
                          selectedList.movies.length / moviesPageSize
                        ),
                      }).map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentMoviePage === index + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentMoviePage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
