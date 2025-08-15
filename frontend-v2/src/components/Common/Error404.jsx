import React from "react";

const Error404 = () => {
  return (
    <div class="page-not-found">
      <img
        class="image"
        alt="Page Not Found"
        src="/htdocs_error/page_not_found.svg"
      />
      <h1 class="title">This Page Does Not Exist</h1>
      <p class="text">
        Sorry, the page you are looking for could not be found. It's just an
        accident that was not intentional.
      </p>
    </div>
  );
};

export default Error404;
