import React from "react";

const MovieSidebar = () => {
  return (
    <div class="lg:w-1/3 sidebar">
      <img
        alt="Paddington in Peru movie poster"
        class="w-full rounded-lg shadow-lg interactive-img"
        height="450"
        src="https://storage.googleapis.com/a1aa/image/W1sNrRpcuUp1VcsmZeQYN01loDotuhVKP27LSz1ugk8.jpg"
        width="300"
      />
      <div class="flex items-center space-x-2 mt-2">
        <i class="fas fa-heart text-green-500"></i>
        <span>170K</span>
        <i class="fas fa-eye text-blue-500"></i>
        <span>39K</span>
        <i class="fas fa-comment text-yellow-500"></i>
        <span>52K</span>
      </div>
      <div class="mt-4">
        <h2 class="text-lg font-bold">Where to Watch</h2>
        <button class="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg">
          <a
            href="https://youtu.be/NTvudSGfHRI?si=P433FQN7fIiYhvIU"
            target="_blank"
          >
            Trailer
          </a>
        </button>
        <p class="mt-2">Not streaming.</p>
        <a class="text-blue-500" href="#">
          All services...
        </a>
      </div>
    </div>
  );
};

export default MovieSidebar;
