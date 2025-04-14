import React from "react";

const HeroSection = () => {
  return (
    <div class="relative">
      <img
        src="https://i0.wp.com/cdn.bgr.com/2014/10/interstellar.jpeg"
        alt="Interstellar movie scene with space background"
        class="w-full h-64 object-cover"
      />
      <div class="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-50">
        <h1 class="text-4xl font-bold">Track films you’ve watched.</h1>
        <p class="mt-2 text-lg">
          Save those you want to see. Tell your friends what’s good.
        </p>
        <button class="bg-red-600 text-white px-6 py-2 rounded mt-4 hover:bg-red-700">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
