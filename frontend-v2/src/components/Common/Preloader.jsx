import React from "react";

const Preloader = () => {
  return (
    <div id="mn-overlay">
      <div class="loader">
        <img src="assets/img/logo/loader.png" alt="loader" />
        <span class="shape"></span>
      </div>
    </div>
  );
};

export default Preloader;
