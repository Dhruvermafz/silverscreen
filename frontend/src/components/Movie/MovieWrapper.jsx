import React from "react";
import MovieSidebar from "./MovieSidebar";
import MovieContent from "./MovieContent";

const MovieWrapper = () => {
  return (
    <main class="p-4">
      <div class="flex flex-col lg:flex-row">
        <MovieSidebar />
        <MovieContent />
      </div>
    </main>
  );
};

export default MovieWrapper;
