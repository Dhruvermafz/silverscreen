import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";

const Filter = ({ onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("0");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedSort, setSelectedSort] = useState("0");
  const [loading, setLoading] = useState(false);

  // TMDB genre IDs mapping for static genres
  const genreIdMapping = {
    1: 28, // Action/Adventure -> Action
    3: 16, // Animation
    4: 36, // Biography -> History
    5: 35, // Comedy
    8: 99, // Documentary
    9: 18, // Drama
    12: 10751, // Family
    13: 14, // Fantasy
    14: 36, // History
    15: 27, // Horror
    20: 10752, // Military/War -> War
    21: 10402, // Music
    22: 80, // Mystery/Crime -> Crime
    27: 10749, // Romance
    30: 878, // Science Fiction
    34: 37, // Western
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres([{ id: 0, name: "All genres" }, ...fetchedGenres]);
      } catch (error) {
        toast.error("Failed to load genres", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };
    fetchGenres();
  }, []);

  const handleApplyFilter = async () => {
    setLoading(true);
    try {
      const filter = {};
      if (selectedGenre !== "0") {
        filter.genre = genreIdMapping[selectedGenre] || selectedGenre;
      }
      if (selectedRating !== "0") {
        const ratingMap = {
          1: 3.0,
          2: 5.0,
          3: 7.0,
          4: 8.0,
        };
        filter.rating = ratingMap[selectedRating];
      }
      const sortMap = {
        0: "popularity.desc",
        1: "release_date.desc",
        2: "release_date.asc",
      };
      filter.sort = sortMap[selectedSort];

      onFilterChange(filter); // Pass filter object to parent
    } catch (error) {
      toast.error("Failed to apply filters", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="filter">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="filter__content">
              <button className="filter__menu" type="button">
                <i className="ti ti-filter"></i>Filter
              </button>

              <div className="filter__items">
                <select
                  className="filter__select"
                  name="genre"
                  id="filter__genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))
                  ) : (
                    <option value="0">Loading genres...</option>
                  )}
                </select>

                <select
                  className="filter__select"
                  name="rate"
                  id="filter__rate"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="0">Any rating</option>
                  <option value="1">from 3.0</option>
                  <option value="2">from 5.0</option>
                  <option value="3">from 7.0</option>
                  <option value="4">Golden Star</option>
                </select>

                <select
                  className="filter__select"
                  name="sort"
                  id="filter__sort"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="0">Relevance</option>
                  <option value="1">Newest</option>
                  <option value="2">Oldest</option>
                </select>
              </div>

              <button
                className="filter__btn"
                type="button"
                onClick={handleApplyFilter}
                disabled={loading}
              >
                {loading ? "Applying..." : "Apply"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
