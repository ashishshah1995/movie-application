import React, { useEffect, useState } from "react";
import { getMovies } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";
import PriceCell from "./PriceCell";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("movieFavorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMovies();
      setMovies(data);
      setFilteredMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    let results = movies;

    if (searchTerm) {
      results = results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.year.toString().includes(searchTerm)
      );
    }

    switch (sortBy) {
      case "title":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "year":
        results.sort((a, b) => b.year - a.year);
        break;
      case "price":
        results.sort(
          (a, b) =>
            (a.cheapestPrice || Infinity) - (b.cheapestPrice || Infinity)
        );
        break;
      default:
        break;
    }

    setFilteredMovies(results);
  }, [searchTerm, sortBy, movies]);

  const toggleFavorite = (movieId) => {
    let updatedFavorites;
    if (favorites.includes(movieId)) {
      updatedFavorites = favorites.filter((id) => id !== movieId);
    } else {
      updatedFavorites = [...favorites, movieId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("movieFavorites", JSON.stringify(updatedFavorites));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={fetchMovies} />;

  return (
    <div className="movie-list-container">
      <h2 className="movie-list-title">🎬 Movie Price Comparison</h2>

      <div className="movie-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-options">
          <span className="filter-icon">⚙️</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Default</option>
            <option value="title">Title (A-Z)</option>
            <option value="year">Year (Newest)</option>
            <option value="price">Price (Lowest)</option>
          </select>
        </div>

        <div className="view-toggle">
          <button
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "active" : ""}
            title="Table view"
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "active" : ""}
            title="Grid view"
          >
            Grid
          </button>
        </div>
      </div>

      <div className="results-count">
        Showing {filteredMovies.length} of {movies.length} movies
      </div>

      {viewMode === "table" && (
        <div className="table-container">
          <table className="movie-table">
            <thead>
              <tr>
                <th style={{ width: "30px" }}></th>
                <th>Title</th>
                <th>Year</th>
                <th>CinemaWorld</th>
                <th>FilmWorld</th>
                <th>Best Deal</th>
                <th>Savings</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => {
                const isFavorite = favorites.includes(movie.id);
                const priceDiff =
                  movie.providers?.cinemaworld && movie.providers?.filmworld
                    ? Math.abs(
                        movie.providers.cinemaworld - movie.providers.filmworld
                      )
                    : 0;

                return (
                  <tr key={`${movie.id}-${movie.title}`} className="movie-row">
                    <td>
                      <span
                        className={`favorite-star ${
                          isFavorite ? "active" : ""
                        }`}
                        onClick={() => toggleFavorite(movie.id)}
                        title={
                          isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {isFavorite ? "★" : "☆"}
                      </span>
                    </td>
                    <td
                      className="movie-title"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      {movie.title}
                    </td>
                    <td>{movie.year}</td>
                    <PriceCell
                      price={movie.providers?.cinemaworld}
                      isCheapest={movie.cheapestProvider === "cinemaworld"}
                    />
                    <PriceCell
                      price={movie.providers?.filmworld}
                      isCheapest={movie.cheapestProvider === "filmworld"}
                    />
                    <td className="best-price">
                      {movie.cheapestPrice
                        ? `💰 $${movie.cheapestPrice.toFixed(2)}`
                        : "Unavailable"}
                    </td>
                    <td className="savings">
                      {priceDiff > 0 ? `Save $${priceDiff.toFixed(2)}` : "-"}
                    </td>
                    <td className="provider-badge">
                      {movie.cheapestProvider ? (
                        <span
                          className={`provider-tag ${movie.cheapestProvider}`}
                        >
                          {movie.cheapestProvider.charAt(0).toUpperCase() +
                            movie.cheapestProvider.slice(1)}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "grid" && (
        <div className="movie-grid">
          {filteredMovies.map((movie) => {
            const isFavorite = favorites.includes(movie.id);
            const priceDiff =
              movie.providers?.cinemaworld && movie.providers?.filmworld
                ? Math.abs(
                    movie.providers.cinemaworld - movie.providers.filmworld
                  )
                : 0;

            return (
              <div key={`${movie.id}-${movie.title}`} className="movie-card">
                <div className="card-header">
                  <h3 onClick={() => setSelectedMovie(movie)}>{movie.title}</h3>
                  <span
                    className={`favorite-star ${isFavorite ? "active" : ""}`}
                    onClick={() => toggleFavorite(movie.id)}
                    title={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    {isFavorite ? "★" : "☆"}
                  </span>
                </div>
                <div className="card-body">
                  <div className="card-year">Year: {movie.year}</div>
                  <div className="card-prices">
                    <div className="price-item">
                      <span className="price-label">CinemaWorld:</span>
                      <span
                        className={`price-value ${
                          movie.cheapestProvider === "cinemaworld"
                            ? "best-price"
                            : ""
                        }`}
                      >
                        {movie.providers?.cinemaworld
                          ? `$${movie.providers.cinemaworld.toFixed(2)}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="price-item">
                      <span className="price-label">FilmWorld:</span>
                      <span
                        className={`price-value ${
                          movie.cheapestProvider === "filmworld"
                            ? "best-price"
                            : ""
                        }`}
                      >
                        {movie.providers?.filmworld
                          ? `$${movie.providers.filmworld.toFixed(2)}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="card-deal">
                    <span>Best Deal: </span>
                    <span className="best-price">
                      {movie.cheapestPrice
                        ? `$${movie.cheapestPrice.toFixed(2)}`
                        : "Unavailable"}
                    </span>
                    {priceDiff > 0 && (
                      <div className="savings-badge">
                        Save ${priceDiff.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  {movie.cheapestProvider && (
                    <span className={`provider-tag ${movie.cheapestProvider}`}>
                      {movie.cheapestProvider.charAt(0).toUpperCase() +
                        movie.cheapestProvider.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMovie && (
        <div className="movie-modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>
            <h2>
              {selectedMovie.title} ({selectedMovie.year})
            </h2>
            <div className="modal-prices">
              <div
                className={`price-card ${
                  selectedMovie.cheapestProvider === "cinemaworld" ? "best" : ""
                }`}
              >
                <h3>CinemaWorld</h3>
                <div className="price-value">
                  {selectedMovie.providers?.cinemaworld
                    ? `$${selectedMovie.providers.cinemaworld.toFixed(2)}`
                    : "N/A"}
                </div>
              </div>
              <div
                className={`price-card ${
                  selectedMovie.cheapestProvider === "filmworld" ? "best" : ""
                }`}
              >
                <h3>FilmWorld</h3>
                <div className="price-value">
                  {selectedMovie.providers?.filmworld
                    ? `$${selectedMovie.providers.filmworld.toFixed(2)}`
                    : "N/A"}
                </div>
              </div>
            </div>
            {selectedMovie.cheapestProvider && (
              <div className="best-deal">
                Best Deal: {selectedMovie.cheapestProvider} at $
                {selectedMovie.cheapestPrice.toFixed(2)}
              </div>
            )}
            <button
              className={`favorite-btn ${
                favorites.includes(selectedMovie.id) ? "active" : ""
              }`}
              onClick={() => toggleFavorite(selectedMovie.id)}
            >
              <span className="star-icon">
                {favorites.includes(selectedMovie.id) ? "★" : "☆"}
              </span>
              {favorites.includes(selectedMovie.id)
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
