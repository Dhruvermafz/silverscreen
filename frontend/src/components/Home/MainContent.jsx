import React from "react";

const MainContent = () => {
  return (
    <div class="container mx-auto p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-4" id="movie-1">
          <img
            src="https://resizing.flixster.com/fqA2ALSWe0CIjYaDdkDiW4ONqLI=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p14169043_v_v13_at.jpg"
            alt="Call Me By Your Name movie poster"
            class="w-full h-64 object-cover rounded"
          />
          <h2 class="text-xl font-bold mt-4">Call Me By Your Name</h2>
          <p class="text-gray-600">2017 · Drama</p>
          <div class="flex items-center mt-2 space-x-1">
            <i class="fas fa-star text-yellow-500"></i>
            <i class="fas fa-star text-yellow-500"></i>
            <i class="fas fa-star text-yellow-500"></i>
            <i class="fas fa-star text-yellow-400"></i>
            <i class="fas fa-star text-gray-300"></i>
          </div>

          <div class="mt-4">
            <h3 class="text-lg font-bold">User Reviews</h3>
            <div id="reviews-1" class="text-sm text-gray-600"></div>
            <div id="review-form-1" class="mt-2 hidden">
              <input
                type="text"
                id="review-input-1"
                class="p-2 border border-gray-300 rounded"
                placeholder="Write your review here..."
              />
              <button
                class="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
                onclick="submitReview(1)"
              >
                Submit Review
              </button>
            </div>
            <button
              class="bg-yellow-500 text-white px-4 py-2 mt-2 rounded"
              onclick="toggleReviewForm(1)"
            >
              Add Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
