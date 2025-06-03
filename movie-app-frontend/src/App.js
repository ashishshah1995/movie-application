import React from "react";
import MovieList from "./components/MovieList";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Movie Price Comparison</h1>
      <MovieList />
    </div>
  );
}

export default App;
