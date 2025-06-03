import React, { useEffect, useState } from "react";
import { getMovies } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";
import PriceCell from "./PriceCell";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={fetchMovies} />;

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>CinemaWorld Price</th>
            <th>FilmWorld Price</th>
            <th>Cheapest Price</th>
            <th>Provider</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={`${movie.title}-${movie.year}`}>
              <td>{movie.title}</td>
              <td>{movie.year}</td>
              <PriceCell
                price={movie.providers?.cinemaworld}
                isCheapest={movie.cheapestProvider === "cinemaworld"}
              />
              <PriceCell
                price={movie.providers?.filmworld}
                isCheapest={movie.cheapestProvider === "filmworld"}
              />
              <td className="fw-bold">
                {movie.cheapestPrice
                  ? `$${movie.cheapestPrice.toFixed(2)}`
                  : "Unavailable"}
              </td>
              <td>
                {movie.cheapestProvider
                  ? movie.cheapestProvider.charAt(0).toUpperCase() +
                    movie.cheapestProvider.slice(1)
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieList;
