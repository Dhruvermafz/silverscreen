import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Input, Select, message } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock API hooks (replace with actual RTK Query hooks)
const useGetMoviesQuery = () => ({
  data: [
    {
      _id: "1",
      tmdbId: 12345,
      title: "Inception",
      genres: ["Sci-Fi", "Action"],
      releaseDate: "2010-07-16",
      grossRevenue: 829895144,
      status: "visible",
      createdAt: "2023-02-05T10:00:00Z",
    },
  ],
  isLoading: false,
  error: null,
});

const useGetMovieRequestsQuery = () => ({
  data: [
    {
      _id: "req1",
      tmdbId: 67890,
      title: "New Movie",
      userId: { _id: "user1", username: "JohnDoe" },
      genres: ["Drama"],
      reason: "Highly anticipated film",
      status: "pending",
      createdAt: "2023-02-06T10:00:00Z",
    },
  ],
  isLoading: false,
  error: null,
});

const useUpdateMovieRequestMutation = () => ({
  mutate: async (data) => {
    // Simulate API call
    console.log("Updating movie request:", data);
    return { success: true };
  },
});

const useDeleteMovieRequestMutation = () => ({
  mutate: async (id) => {
    // Simulate API call
    console.log("Deleting movie request:", id);
    return { success: true };
  },
});

const FilmWrapper = () => {
  const navigate = useNavigate();
  const {
    data: movies,
    isLoading: moviesLoading,
    error: moviesError,
  } = useGetMoviesQuery();
  const {
    data: movieRequests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useGetMovieRequestsQuery();
  const [updateMovieRequest] = useUpdateMovieRequestMutation();
  const [deleteMovieRequest] = useDeleteMovieRequestMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isRequestActionModalOpen, setIsRequestActionModalOpen] =
    useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestAction, setRequestAction] = useState(null);

  if (moviesError || requestsError) {
    toast.error("Failed to load data", {
      position: "top-right",
      autoClose: 2000,
    });
  }

  const handleMovieDelete = (id) => {
    setSelectedMovie(id);
    setIsDeleteModalOpen(true);
  };

  const confirmMovieDelete = () => {
    // Implement delete API call
    toast.success(`Movie ${selectedMovie} deleted`, {
      position: "top-right",
      autoClose: 2000,
    });
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };

  const handleMovieStatusToggle = (id, currentStatus) => {
    // Implement status toggle API call
    toast.success(
      `Movie ${id} ${currentStatus === "visible" ? "banned" : "unbanned"}`,
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };

  const handleRequestAction = (id, action) => {
    setSelectedRequest(id);
    setRequestAction(action);
    setIsRequestActionModalOpen(true);
  };

  const confirmRequestAction = async () => {
    try {
      if (requestAction === "delete") {
        await deleteMovieRequest(selectedRequest).mutate();
        toast.success(`Movie request ${selectedRequest} deleted`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await updateMovieRequest({
          id: selectedRequest,
          status: requestAction,
        }).mutate();
        toast.success(`Movie request ${selectedRequest} ${requestAction}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      setIsRequestActionModalOpen(false);
      setSelectedRequest(null);
      setRequestAction(null);
    } catch (err) {
      toast.error(`Failed to ${requestAction} movie request`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <main className="main">
      <div className="container-fluid">
        {/* Movies Table */}
        <div className="row">
          <div className="col-12">
            <div className="main__title">
              <h2>Films</h2>
              <span className="main__title-stat">
                {moviesLoading ? "Loading..." : `${movies?.length || 0} Total`}
              </span>
              <div className="main__title-wrap">
                <select
                  className="filter__select"
                  name="sort"
                  id="filter__sort"
                >
                  <option value="createdAt">Date created</option>
                  <option value="grossRevenue">Gross Revenue</option>
                  <option value="releaseDate">Release Date</option>
                </select>
                <form action="#" className="main__title-form">
                  <input type="text" placeholder="Search movies..." />
                  <button type="button">
                    <i className="ti ti-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="catalog catalog--1">
              <table className="catalog__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>GENRES</th>
                    <th>RELEASE DATE</th>
                    <th>GROSS REVENUE</th>
                    <th>STATUS</th>
                    <th>CREATED DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {moviesLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : movies?.length ? (
                    movies.map((movie) => (
                      <tr key={movie._id}>
                        <td>
                          <div className="catalog__text">{movie.tmdbId}</div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            <a href={`/movies/${movie.tmdbId}`}>
                              {movie.title}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {movie.genres.join(", ")}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {movie.releaseDate
                              ? new Date(movie.releaseDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            ${movie.grossRevenue.toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`catalog__text catalog__text--${
                              movie.status === "visible" ? "green" : "red"
                            }`}
                          >
                            {movie.status}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {new Date(movie.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__btns">
                            <button
                              type="button"
                              className={`catalog__btn catalog__btn--${
                                movie.status === "visible"
                                  ? "banned"
                                  : "unbanned"
                              }`}
                              onClick={() =>
                                handleMovieStatusToggle(movie._id, movie.status)
                              }
                            >
                              <i className="ti ti-lock"></i>
                            </button>
                            <a
                              href={`/movies/${movie.tmdbId}`}
                              className="catalog__btn catalog__btn--view"
                            >
                              <i className="ti ti-eye"></i>
                            </a>
                            <a
                              href={`/admin/films/edit/${movie._id}`}
                              className="catalog__btn catalog__btn--edit"
                            >
                              <i className="ti ti-edit"></i>
                            </a>
                            <button
                              type="button"
                              className="catalog__btn catalog__btn--delete"
                              onClick={() => handleMovieDelete(movie._id)}
                            >
                              <i className="ti ti-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No movies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Movie Requests Table */}
        <div className="row">
          <div className="col-12">
            <div className="main__title">
              <h2>Movie Requests</h2>
              <span className="main__title-stat">
                {requestsLoading
                  ? "Loading..."
                  : `${movieRequests?.length || 0} Total`}
              </span>
              <div className="main__title-wrap">
                <select
                  className="filter__select"
                  name="sort"
                  id="filter__sort_requests"
                >
                  <option value="createdAt">Date created</option>
                  <option value="status">Status</option>
                </select>
                <form action="#" className="main__title-form">
                  <input type="text" placeholder="Search movie requests..." />
                  <button type="button">
                    <i className="ti ti-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="catalog catalog--1">
              <table className="catalog__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>USER</th>
                    <th>GENRES</th>
                    <th>STATUS</th>
                    <th>REASON</th>
                    <th>CREATED DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : movieRequests?.length ? (
                    movieRequests.map((request) => (
                      <tr key={request._id}>
                        <td>
                          <div className="catalog__text">{request._id}</div>
                        </td>
                        <td>
                          <div className="catalog__text">{request.title}</div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            <a href={`/u/${request.userId._id}`}>
                              {request.userId.username}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {request.genres.join(", ")}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`catalog__text catalog__text--${
                              request.status === "approved"
                                ? "green"
                                : request.status === "rejected"
                                ? "red"
                                : "yellow"
                            }`}
                          >
                            {request.status}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__text">{request.reason}</div>
                        </td>
                        <td>
                          <div className="catalog__text">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="catalog__btns">
                            <button
                              type="button"
                              className="catalog__btn catalog__btn--approve"
                              onClick={() =>
                                handleRequestAction(request._id, "approved")
                              }
                              disabled={request.status === "approved"}
                            >
                              <i className="ti ti-check"></i>
                            </button>
                            <button
                              type="button"
                              className="catalog__btn catalog__btn--reject"
                              onClick={() =>
                                handleRequestAction(request._id, "rejected")
                              }
                              disabled={request.status === "rejected"}
                            >
                              <i className="ti ti-x"></i>
                            </button>
                            <button
                              type="button"
                              className="catalog__btn catalog__btn--delete"
                              onClick={() =>
                                handleRequestAction(request._id, "delete")
                              }
                            >
                              <i className="ti ti-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No movie requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="main__paginator">
            <span className="main__paginator-pages">1 of 10</span>
            <ul className="main__paginator-list">
              <li>
                <a href="#">
                  <i className="ti ti-chevron-left"></i>
                  <span>Prev</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span>Next</span>
                  <i className="ti ti-chevron-right"></i>
                </a>
              </li>
            </ul>
            <ul className="paginator">
              <li className="paginator__item paginator__item--prev">
                <a href="#">
                  <i className="ti ti-chevron-left"></i>
                </a>
              </li>
              <li className="paginator__item paginator__item--active">
                <a href="#">1</a>
              </li>
              <li className="paginator__item">
                <a href="#">2</a>
              </li>
              <li className="paginator__item">
                <a href="#">3</a>
              </li>
              <li className="paginator__item">
                <span>...</span>
              </li>
              <li className="paginator__item">
                <a href="#">10</a>
              </li>
              <li className="paginator__item paginator__item--next">
                <a href="#">
                  <i className="ti ti-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={confirmMovieDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this movie?</p>
      </Modal>
      <Modal
        title={`Confirm ${
          requestAction === "delete"
            ? "Delete"
            : requestAction === "approved"
            ? "Approve"
            : "Reject"
        } Movie Request`}
        open={isRequestActionModalOpen}
        onOk={confirmRequestAction}
        onCancel={() => setIsRequestActionModalOpen(false)}
        okText={
          requestAction === "delete"
            ? "Delete"
            : requestAction === "approved"
            ? "Approve"
            : "Reject"
        }
        cancelText="Cancel"
      >
        <p>Are you sure you want to {requestAction} this movie request?</p>
      </Modal>
    </main>
  );
};

export default FilmWrapper;
