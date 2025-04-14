import React from "react";

const WriteReview = () => {
  return (
    <div class="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-4xl space-y-6">
      <div class="flex justify-between items-center border-b pb-4">
        <button class="text-gray-400 hover:text-white flex items-center gap-1">
          <i class="fas fa-arrow-left"></i>
          <a href="index.html">Back</a>
        </button>
        <h2 class="text-2xl font-semibold">I Watched...</h2>
        <i class="fas fa-times text-gray-400 hover:text-white cursor-pointer"></i>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <img
          src="https://m.media-amazon.com/images/I/61DUasB6X5L._AC_UF894,1000_QL80_.jpg"
          alt="Interstellar"
          class="w-36 h-52 object-cover rounded-lg shadow"
        />
        <div class="flex-1">
          <h3 class="text-2xl font-bold">
            Interstellar <span class="text-gray-400 font-medium">(2014)</span>
          </h3>

          <div class="flex items-center gap-3 mt-4">
            <input id="watched" type="checkbox" class="mr-1" />
            <label for="watched">Watched on</label>
            <input
              type="date"
              class="bg-gray-700 text-white rounded px-3 py-1 w-40"
            />
          </div>

          <div class="flex items-center gap-2 mt-2">
            <input id="watched-before" type="checkbox" />
            <label for="watched-before">I’ve watched this film before</label>
          </div>

          <textarea
            class="bg-gray-700 w-full mt-4 p-3 rounded h-24 resize-none"
            placeholder="Add a review..."
          ></textarea>

          <div class="flex items-center justify-between mt-4">
            <div class="flex flex-col w-1/2">
              <label for="tags" class="text-sm text-gray-400 mb-1">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                class="bg-gray-700 text-white px-2 py-1 rounded"
                placeholder="e.g. sci-fi, Nolan, space"
              />
            </div>

            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-400">Rating</label>
              <div class="flex gap-1 cursor-pointer" id="stars">
                <i class="fas fa-star text-gray-500" data-index="1"></i>
                <i class="fas fa-star text-gray-500" data-index="2"></i>
                <i class="fas fa-star text-gray-500" data-index="3"></i>
                <i class="fas fa-star text-gray-500" data-index="4"></i>
                <i class="fas fa-star text-gray-500" data-index="5"></i>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-400">Like</label>
              <i
                class="fas fa-heart text-gray-500 hover:text-red-500 cursor-pointer"
                id="like-btn"
              ></i>
            </div>
          </div>

          <button class="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full">
            <a href="index.html">SAVE</a>
          </button>
        </div>
      </div>

      <div class="mt-8">
        <h4 class="text-xl font-semibold mb-4">Recommended for you</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-700 rounded-lg p-2">
            <img
              src="https://m.media-amazon.com/images/I/71niXI3lxlL._AC_UF894,1000_QL80_.jpg"
              alt="Inception"
              class="rounded w-full h-40 object-cover"
            />
            <p class="mt-2 text-center">Inception (2010)</p>
          </div>
          <div class="bg-gray-700 rounded-lg p-2">
            <img
              src="https://m.media-amazon.com/images/I/71nSnpkK0mL._AC_UF894,1000_QL80_.jpg"
              alt="The Martian"
              class="rounded w-full h-40 object-cover"
            />
            <p class="mt-2 text-center">The Martian (2015)</p>
          </div>
          <div class="bg-gray-700 rounded-lg p-2">
            <img
              src="https://m.media-amazon.com/images/I/81k1b6y3Y4L._AC_UF894,1000_QL80_.jpg"
              alt="Gravity"
              class="rounded w-full h-40 object-cover"
            />
            <p class="mt-2 text-center">Gravity (2013)</p>
          </div>
          <div class="bg-gray-700 rounded-lg p-2">
            <img
              src="https://m.media-amazon.com/images/I/71UFBewy-KL._AC_UF894,1000_QL80_.jpg"
              alt="Arrival"
              class="rounded w-full h-40 object-cover"
            />
            <p class="mt-2 text-center">Arrival (2016)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
