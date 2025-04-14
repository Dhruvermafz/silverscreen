import React from "react";
import MovieSidebar from "./MovieSidebar";

const MovieContent = () => {
  return (
    <div class="flex flex-col lg:flex-row">
      <MovieSidebar />
      <div class="lg:w-2/3 lg:pl-8 mt-4 lg:mt-0">
        <h2 class="text-3xl font-bold text-white">Paddington in Peru</h2>
        <p class="text-gray-400">
          2024 Directed by
          <a class="text-blue-500" href="#">
            Dougal Wilson
          </a>
        </p>
        <p class="mt-4 text-gray-300">A little bear goes a long way.</p>
        <p class="mt-4">
          Paddington travels to Peru to visit his beloved Aunt Lucy, who now
          resides at the Home for Retired Bears. With the Brown Family in tow, a
          thrilling adventure ensues when a mystery plunges them into an
          unexpected journey through the Amazon rainforest and up to the
          mountain peaks of Peru.
        </p>
        <div class="mt-4">
          <h3 class="text-lg font-bold">Cast</h3>
          <div class="flex flex-wrap mt-2">
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Ben Whishaw
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Hugh Bonneville
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Emily Mortimer
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Samuel Joslin
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Madeleine Harris
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Antonio Banderas
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Olivia Colman
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Julie Walters
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Jim Broadbent
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Carla Tous
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Hayley Atwell
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Oliver Maltman
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Joel Fry
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Robbie Gee
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Sanjeev Bhaskar
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Imelda Staunton
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Ben Miller
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Jessica Hynes
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Ella Darcey
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Aloerisa Spencer
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Nicholas Burns
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Aleshya Reynolds
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Amit Shah
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Ella Buccolieri
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Carlos Carlin
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Simon Farnaby
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Emma Sidi
            </span>
            <span class="bg-gray-700 text-white px-2 py-1 rounded-lg m-1">
              Hugh Grant
            </span>
          </div>
        </div>
        <div class="mt-4 ratings-section">
          <h3 class="text-lg font-bold">Ratings</h3>
          <div class="flex items-center mt-2">
            <div class="w-32 h-8 bg-gray-700 rounded-lg relative">
              <div
                class="absolute top-0 left-0 h-full bg-green-500"
                style="width: 35%;"
              ></div>
            </div>
            <span class="ml-2">3.5</span>
          </div>
          <p class="mt-2">371 fans</p>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-bold">Details</h3>
          <p class="mt-2">106 mins</p>
          <div class="flex space-x-2 mt-2">
            <a class="text-blue-500" href="#">
              More at
            </a>
            <a class="text-blue-500" href="#">
              IMDb
            </a>
            <a class="text-blue-500" href="#">
              TMDb
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieContent;
